-- ============================================================
-- entitlements: server-only paywall flag
-- ------------------------------------------------------------
-- Source of truth for "is this user a paying customer?"
-- Only the service_role key (used by the Stripe webhook Edge
-- Function) can write to this table. The user can read their
-- own row but cannot mutate it from the browser, which makes
-- the paywall tamper-proof.
-- ============================================================

create table if not exists public.entitlements (
  user_id            uuid primary key references auth.users(id) on delete cascade,
  is_paid            boolean not null default false,
  stripe_customer_id text,
  stripe_session_id  text,
  paid_at            timestamptz,
  updated_at         timestamptz not null default now()
);

alter table public.entitlements enable row level security;

-- Users can read their own entitlement row (so the frontend knows
-- whether to unlock premium content). They cannot insert/update/delete.
drop policy if exists "Users read own entitlement" on public.entitlements;
create policy "Users read own entitlement"
  on public.entitlements for select
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- One-time backfill: any existing paying user that was tracked
-- via user_progress.has_subscribed gets a matching entitlements
-- row so they don't lose access during the cutover.
-- ============================================================
insert into public.entitlements (user_id, is_paid, paid_at, updated_at)
select user_id, true, now(), now()
  from public.user_progress
 where has_subscribed = true
on conflict (user_id) do nothing;
