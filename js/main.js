/**
 * ==============================================================================
 * Fern Aila Asiñero — Portfolio Scripts (main.js)
 * Production-ready, zero-dependency vanilla JavaScript.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ----------------------------------------------------------------------------
  // 1. Accessibility & Motion Preference Check
  // ----------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----------------------------------------------------------------------------
  // 2. Mobile Navigation Toggle & Accessible Drawer
  // ----------------------------------------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const siteHeader = document.getElementById('site-header');

  const openMobileNav = () => {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.classList.add('open');
    primaryNav.classList.add('nav-open');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling on mobile
  };

  const closeMobileNav = () => {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('open');
    primaryNav.classList.remove('nav-open');
    document.body.style.overflow = '';
  };

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close mobile nav on link click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.classList.contains('nav-open')) {
        closeMobileNav();
        navToggle.focus();
      }
    });

    // Close when clicking outside of the open drawer
    document.addEventListener('click', (e) => {
      if (
        primaryNav.classList.contains('nav-open') &&
        !primaryNav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMobileNav();
      }
    });
  }

  // Header background elevation on scroll
  const handleScrollHeader = () => {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader();

  // ----------------------------------------------------------------------------
  // 3. Smooth Scrolling for Anchor Links
  // ----------------------------------------------------------------------------
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        if (prefersReducedMotion) {
          targetElement.scrollIntoView();
        } else {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }

        // Update URL hash without breaking history or jump
        if (history.pushState) {
          history.pushState(null, '', targetId);
        }

        // Ensure target is focusable for screen readers
        if (!targetElement.hasAttribute('tabindex')) {
          targetElement.setAttribute('tabindex', '-1');
        }
        targetElement.focus({ preventScroll: true });
      }
    });
  });

  // ----------------------------------------------------------------------------
  // 4. Active Nav Link Highlight (IntersectionObserver)
  // ----------------------------------------------------------------------------
  const sections = document.querySelectorAll('main > section[id]');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const sectionObserverOptions = {
      root: null,
      rootMargin: '-20% 0px -55% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${currentId}`) {
              link.setAttribute('aria-current', 'page');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, sectionObserverOptions);

    sections.forEach((sec) => sectionObserver.observe(sec));
  }

  // ----------------------------------------------------------------------------
  // 5. Scroll Fade-in Animation (IntersectionObserver)
  // ----------------------------------------------------------------------------
  const fadeElements = document.querySelectorAll('.fade-in');

  if (prefersReducedMotion) {
    // If user prefers reduced motion, immediately make all elements visible
    fadeElements.forEach((el) => el.classList.add('visible'));
  } else if ('IntersectionObserver' in window) {
    const fadeObserverOptions = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Trigger animation once
        }
      });
    }, fadeObserverOptions);

    fadeElements.forEach((el) => fadeObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    fadeElements.forEach((el) => el.classList.add('visible'));
  }

  // ----------------------------------------------------------------------------
  // 6. Profile Image Fallback Handler
  // ----------------------------------------------------------------------------
  const profileImg = document.getElementById('profile-img');
  const profileFallback = document.getElementById('profile-fallback');

  const showFallback = () => {
    if (profileImg) {
      profileImg.style.display = 'none';
    }
    if (profileFallback) {
      profileFallback.style.display = 'block';
    }
  };

  const showImage = () => {
    if (profileImg) {
      profileImg.style.display = 'block';
    }
    if (profileFallback) {
      profileFallback.style.display = 'none';
    }
  };

  if (profileImg) {
    profileImg.addEventListener('error', showFallback);
    profileImg.addEventListener('load', () => {
      if (profileImg.naturalWidth === 0) {
        showFallback();
      } else {
        showImage();
      }
    });

    // Handle cached or pre-loaded check
    if (profileImg.complete) {
      if (profileImg.naturalWidth === 0) {
        showFallback();
      } else {
        showImage();
      }
    }
  }
});
