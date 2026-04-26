// ============================================================
// stripe-webhook  (Supabase Edge Function, Deno runtime)
// ------------------------------------------------------------
// Stripe sends events here when a payment finishes. We:
//   1. Verify the request signature with STRIPE_WEBHOOK_SECRET.
//   2. On `checkout.session.completed`, read `client_reference_id`
//      (the Supabase auth.users.id we attached to the Payment Link).
//   3. Use the service-role key to upsert `entitlements.is_paid = true`.
//
// Deploy:
//   supabase functions deploy stripe-webhook --no-verify-jwt
//
// Required secrets (set with `supabase secrets set KEY=...`):
//   STRIPE_SECRET_KEY            sk_live_... (or sk_test_... for testing)
//   STRIPE_WEBHOOK_SECRET        whsec_...      (live-mode signing secret)
//   STRIPE_WEBHOOK_SECRET_TEST   whsec_test_... (optional, test-mode secret)
//
// Either webhook secret is sufficient on its own. If both are set, the
// function accepts events signed with either one — useful while you have
// both a live-mode and a test-mode endpoint registered against this URL.
//
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected by
// the platform — do NOT set them manually.
// ============================================================

import Stripe from 'https://esm.sh/stripe@17.5.0?target=denonext';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const STRIPE_SECRET_KEY          = Deno.env.get('STRIPE_SECRET_KEY')!;
const STRIPE_WEBHOOK_SECRET      = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';
const STRIPE_WEBHOOK_SECRET_TEST = Deno.env.get('STRIPE_WEBHOOK_SECRET_TEST') ?? '';
const SUPABASE_URL               = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY           = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

if (!STRIPE_WEBHOOK_SECRET && !STRIPE_WEBHOOK_SECRET_TEST) {
  console.error('FATAL: at least one of STRIPE_WEBHOOK_SECRET or STRIPE_WEBHOOK_SECRET_TEST must be set');
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

// Stripe needs an async-aware crypto provider on Deno because
// Web Crypto's HMAC is async (Node's is sync).
const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  const rawBody = await req.text();

  // Try each configured secret. Stripe sends only one signature per
  // request, signed with the secret of the endpoint it targeted; we
  // don't know in advance whether that's the live or test endpoint,
  // so we try both and accept whichever validates.
  const candidates: Array<{ name: string; value: string }> = [];
  if (STRIPE_WEBHOOK_SECRET)      candidates.push({ name: 'live', value: STRIPE_WEBHOOK_SECRET });
  if (STRIPE_WEBHOOK_SECRET_TEST) candidates.push({ name: 'test', value: STRIPE_WEBHOOK_SECRET_TEST });

  let event: Stripe.Event | null = null;
  let lastError = 'no signing secret configured';
  for (const c of candidates) {
    try {
      event = await stripe.webhooks.constructEventAsync(
        rawBody,
        signature,
        c.value,
        undefined,
        cryptoProvider,
      );
      console.log(`Signature verified with ${c.name}-mode secret`);
      break;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  if (!event) {
    console.error('Signature verification failed against all secrets:', lastError);
    return new Response(`Webhook Error: ${lastError}`, { status: 400 });
  }

  console.log(`Stripe event received: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        await grantEntitlement(event.data.object as Stripe.Checkout.Session);
        break;
      }

      case 'charge.refunded': {
        await revokeOnFullRefund(event.data.object as Stripe.Charge);
        break;
      }

      default:
        // Acknowledge any other event so Stripe doesn't keep retrying.
        console.log(`Ignoring event type: ${event.type}`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Handler error:', msg);
    // Returning 500 tells Stripe to retry. That's the right behaviour
    // for transient DB errors.
    return new Response(`Handler error: ${msg}`, { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'content-type': 'application/json' },
    status: 200,
  });
});

// ------------------------------------------------------------
// grant entitlement: flip is_paid = true for the user that
// `client_reference_id` points to.
// ------------------------------------------------------------
async function grantEntitlement(session: Stripe.Checkout.Session) {
  // Only grant when payment actually settled. `payment_status` is
  // 'paid' for cards and 'no_payment_required' for $0 sessions.
  if (
    session.payment_status !== 'paid' &&
    session.payment_status !== 'no_payment_required'
  ) {
    console.log(
      `Skipping ${session.id}: payment_status=${session.payment_status}`,
    );
    return;
  }

  const userId = session.client_reference_id;
  if (!userId) {
    // Without a user id we can't map to a Supabase account. This will
    // happen if someone hits the raw Payment Link URL without going
    // through the site's "Unlock" button. Log and bail.
    console.warn(
      `Session ${session.id} has no client_reference_id; cannot grant.`,
    );
    return;
  }

  const customerId =
    typeof session.customer === 'string'
      ? session.customer
      : session.customer?.id ?? null;

  const { error } = await supabase
    .from('entitlements')
    .upsert(
      {
        user_id: userId,
        is_paid: true,
        stripe_customer_id: customerId,
        stripe_session_id: session.id,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

  if (error) {
    throw new Error(`entitlements upsert failed: ${error.message}`);
  }

  console.log(`Granted entitlement to user ${userId} (session ${session.id})`);
}

// ------------------------------------------------------------
// revoke on full refund: if a charge is fully refunded, look up
// the customer in our entitlements table and flip is_paid = false.
// (Partial refunds keep access — you can tighten this later.)
// ------------------------------------------------------------
async function revokeOnFullRefund(charge: Stripe.Charge) {
  if (!charge.refunded) return;

  const customerId =
    typeof charge.customer === 'string'
      ? charge.customer
      : charge.customer?.id;
  if (!customerId) return;

  const { error } = await supabase
    .from('entitlements')
    .update({
      is_paid: false,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    throw new Error(`entitlements revoke failed: ${error.message}`);
  }

  console.log(`Revoked entitlement for stripe customer ${customerId}`);
}
