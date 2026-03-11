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

// Initialize Lenis
let lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  lenis.on('scroll', (e) => {
    handleNavState(e.animatedScroll);
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
} else {
  // Fallback if Lenis fails to load
  window.addEventListener('scroll', () => {
    lastScroll = window.scrollY;
    handleNavState(lastScroll);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  handleNavState(window.scrollY);
});

// Mobile menu toggle
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('mobile-menu--open');
    
    const icon = navToggle.querySelector('svg');
    if (mobileMenu.classList.contains('mobile-menu--open')) {
      icon.innerHTML = '<path d="M18 6L6 18M6 6l12 12"/>';
    } else {
      icon.innerHTML = '<path d="M3 12h18M3 6h18M3 18h18"/>';
    }
  });
  
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('mobile-menu--open');
      const icon = navToggle.querySelector('svg');
      icon.innerHTML = '<path d="M3 12h18M3 6h18M3 18h18"/>';
    });
  });
  
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
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      
      if (lenis) {
        lenis.scrollTo(target, { offset: -nav.offsetHeight });
      } else {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - nav.offsetHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.flow__feature, .flow__closing, .flow__services');
  
  animatedElements.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(el);
  });
});
