// Initialize EmailJS
(function() {
    // Replace with your actual public key from EmailJS
    emailjs.init('YOUR_PUBLIC_KEY');
})();

// DOM Elements
const navbar = document.getElementById('navbar');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const contactForm = document.getElementById('contact-form');
const toastContainer = document.getElementById('toast-container');
const currentYearSpan = document.getElementById('current-year');

// Set current year in footer
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// Navigation scroll effect
function handleScroll() {
    if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const isActive = mobileMenuToggle.classList.contains('active');
    
    if (isActive) {
        mobileMenuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
    } else {
        mobileMenuToggle.classList.add('active');
        mobileNav.classList.add('active');
    }
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth'
        });
    }
    
    // Close mobile menu if open
    if (mobileNav.classList.contains('active')) {
        toggleMobileMenu();
    }
}

// Scroll to contact section
function scrollToContact() {
    scrollToSection('contact');
}

// Toast notification system
function showToast(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Remove toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Contact form submission
async function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !message) {
        showToast('Please fill in all fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
    }
    
    const submitButton = event.target.querySelector('.submit-button');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <div class="loading-spinner"></div>
        Sending...
    `;
    
    try {
        // EmailJS configuration
        const EMAILJS_SERVICE_ID = "service_ssumpzg";
        const EMAILJS_TEMPLATE_ID = "template_7kpinwb";
        const EMAILJS_PUBLIC_KEY = "If-N38_YZB3Kk1XhX";
        
        const templateParams = {
            name: name,
            message: message,
            email: email,
            
        };
        
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
        
        showToast('Thank you! Your message has been sent successfully.', 'success');
        event.target.reset();
        
    } catch (error) {
        console.error('Error sending message:', error);
        showToast('There was a problem sending your message. Please try again later.', 'error');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Intersection Observer for animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .about-card, .values-card, .founder-story');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Mobile detection
function isMobile() {
    return window.innerWidth < 768;
}

// Handle video fallback for mobile
function setupVideoFallback() {
    const video = document.querySelector('.hero-video');
    if (video && isMobile()) {
        video.style.objectPosition = 'right';
    }
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

// Add loading spinner styles
function addLoadingStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Setup mobile nav links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                scrollToSection(href.substring(1));
            } else if (href.includes('glossary.html')) {
                // Allow normal navigation for glossary page
                return;
            } else {
                e.preventDefault();
                window.location.href = href;
            }
        });
    });
    
    // Setup desktop nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                scrollToSection(href.substring(1));
            } else if (href.includes('glossary.html')) {
                // Allow normal navigation for glossary page
                return;
            } else {
                e.preventDefault();
                window.location.href = href;
            }
        });
    });
    
    // Initialize features
    setupAnimations();
    setupVideoFallback();
    setupSmoothScroll();
    addLoadingStyles();
    
    // Handle initial scroll position
    handleScroll();
});

// Handle window resize
window.addEventListener('resize', function() {
    setupVideoFallback();
    
    // Close mobile menu on resize if screen becomes larger
    if (window.innerWidth >= 768 && mobileNav.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// Handle page visibility change (for video autoplay)
document.addEventListener('visibilitychange', function() {
    const video = document.querySelector('.hero-video');
    if (video) {
        if (document.hidden) {
            video.pause();
        } else {
            video.play().catch(e => console.log('Video autoplay prevented'));
        }
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// Touch gesture support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    // Swipe up on mobile menu to close it
    if (diff > swipeThreshold && mobileNav.classList.contains('active')) {
        toggleMobileMenu();
    }
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll handler
const debouncedScrollHandler = debounce(handleScroll, 10);
window.removeEventListener('scroll', handleScroll);
window.addEventListener('scroll', debouncedScrollHandler);

// Error handling for video loading
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.hero-video');
    if (video) {
        video.addEventListener('error', function() {
            console.log('Video failed to load, using fallback image');
            const fallback = document.querySelector('.hero-fallback');
            if (fallback) {
                fallback.style.display = 'block';
            }
        });
    }
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels to interactive elements
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
            button.setAttribute('aria-label', 'Button');
        }
    });
    
    // Add skip link for accessibility
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #1f2937;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10001;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const mainContent = document.querySelector('.hero-section');
    if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('role', 'main');
    }
});

// Export functions for global access
window.scrollToContact = scrollToContact;
window.scrollToSection = scrollToSection; 