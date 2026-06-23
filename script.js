/**
 * Muhammad's Portfolio — Interactive Scripts (v2)
 * Handles:
 * 1. Sticky Navigation header background modifier (.scrolled) on scroll (>60px)
 * 2. Mobile navigation toggle, open overlay and body scroll-lock (.menu-open)
 * 3. Offset-aware smooth scrolling for anchor links
 * 4. Active Navigation highlighting using Intersection Observer (threshold 0.4)
 * 5. Scroll Indicator bobbing arrow fade-out (>200px scroll)
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const header = document.getElementById('main-header');
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollIndicator = document.getElementById('scroll-indicator');
  const sections = document.querySelectorAll('section[id]');

  /* ==========================================================================
     1. STICKY HEADER SCROLL BACKGROUND & SCROLL INDICATOR FADE
     ========================================================================== */
  const handleScrollEffects = () => {
    const scrollY = window.scrollY;

    // Toggle header scrolled styling
    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Fade out Hero scroll indicator
    if (scrollIndicator) {
      if (scrollY > 200) {
        scrollIndicator.classList.add('fade');
      } else {
        scrollIndicator.classList.remove('fade');
      }
    }
  };

  window.addEventListener('scroll', handleScrollEffects);
  // Run once initially to capture initial load state
  handleScrollEffects();

  /* ==========================================================================
     2. MOBILE MENU TOGGLE & BODY SCROLL LOCK
     ========================================================================== */
  const toggleMobileMenu = () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  };

  const closeMobileMenu = () => {
    nav.classList.remove('open');
    menuToggle.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  menuToggle.addEventListener('click', toggleMobileMenu);

  // Close menu if user clicks overlay background area
  nav.addEventListener('click', (e) => {
    if (e.target === nav) {
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     3. OFFSET-AWARE SMOOTH SCROLLING
     ========================================================================== */
  const headerHeight = 64; // Set to match the CSS header height (64px)

  const smoothScrollToTarget = (targetId) => {
    const targetSection = document.querySelector(targetId);
    if (!targetSection) return;

    const elementPosition = targetSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  // Nav links smooth scroll handler
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId.startsWith('#')) return;

      e.preventDefault();
      closeMobileMenu();
      smoothScrollToTarget(targetId);
    });
  });

  // CTA buttons smooth scroll handler
  const ctaButtons = document.querySelectorAll('a[href^="#"]:not(.nav-link)');
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('href');
      smoothScrollToTarget(targetId);
    });
  });

  /* ==========================================================================
     4. ACTIVE SECTION HIGHLIGHTING (Intersection Observer)
     ========================================================================== */
  const activeObserverOptions = {
    root: null, // Viewport
    rootMargin: `-${headerHeight}px 0px -40% 0px`, // Offset by header height
    threshold: 0.2 // Trigger when 20% of section enters viewport area
  };

  const activeObserverCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const activeObserver = new IntersectionObserver(activeObserverCallback, activeObserverOptions);
  sections.forEach(section => activeObserver.observe(section));
});
