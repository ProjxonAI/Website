// ===================================
// PROJXON AI - MAIN JAVASCRIPT
// ===================================

// Navigation
const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

// Scroll behavior for navigation
let lastScroll = 0;

const handleNavState = (scrollPos) => {
  if (scrollPos > 50) {
    nav.classList.add('nav--scrolled');
  } else {
    nav.classList.remove('nav--scrolled');
  }
};

// Hero + element parallax effect
const heroBg = document.querySelector('.hero__bg');
const parallaxItems = document.querySelectorAll('[data-parallax]');

const updateParallaxItems = () => {
  if (!parallaxItems.length) return;
  
  parallaxItems.forEach((item) => {
    const strength = parseFloat(item.dataset.parallax) || 0.08;
    const rect = item.getBoundingClientRect();
    const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * strength;
    item.style.transform = `translateY(${offset}px)`;
  });
};

const handleHeroParallax = () => {
  if (heroBg) {
    const offset = window.scrollY * 0.15;
    heroBg.style.transform = `translateY(${offset}px)`;
  }
  updateParallaxItems();
};

window.addEventListener(
  'scroll',
  () => {
    lastScroll = window.scrollY;
    handleNavState(lastScroll);
    handleHeroParallax();
  },
  { passive: true },
);

window.addEventListener('resize', () => {
  requestAnimationFrame(updateParallaxItems);
});

document.addEventListener('DOMContentLoaded', () => {
  updateParallaxItems();
  handleNavState(window.scrollY);
});

// Mobile menu toggle
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('mobile-menu--open');
    
    // Toggle icon
    const icon = navToggle.querySelector('svg');
    if (mobileMenu.classList.contains('mobile-menu--open')) {
      icon.innerHTML = '<path d="M18 6L6 18M6 6l12 12"/>';
    } else {
      icon.innerHTML = '<path d="M3 12h18M3 6h18M3 18h18"/>';
    }
  });
  
  // Close menu when clicking on a link
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('mobile-menu--open');
      const icon = navToggle.querySelector('svg');
      icon.innerHTML = '<path d="M3 12h18M3 6h18M3 18h18"/>';
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !navToggle.contains(e.target)) {
      if (mobileMenu.classList.contains('mobile-menu--open')) {
        mobileMenu.classList.remove('mobile-menu--open');
        const icon = navToggle.querySelector('svg');
        icon.innerHTML = '<path d="M3 12h18M3 6h18M3 18h18"/>';
      }
    }
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Skip if it's just "#"
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      
      const navHeight = nav.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for animations
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.card:not([data-parallax]), .features__item:not([data-parallax]), .stats__item');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
});

// Add loading state to buttons
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function(e) {
    // Don't add loading state to submit buttons (handled separately)
    if (this.type === 'submit') return;
    
    // Don't add loading state to navigation links
    if (this.tagName === 'A' && !this.getAttribute('data-loading')) return;
  });
});

