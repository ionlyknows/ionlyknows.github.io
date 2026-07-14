/* =====================================================
   Jefferson Laspiñas — Portfolio
   Vanilla JS, modular, ES6+
   Table of Contents:
   1. Utilities
   2. Loader
   3. Starfield Canvas
   4. Cursor Glow
   5. Navbar (scroll state, progress ring, active link, mobile menu)
   6. Smooth Scroll (anchor links)
   7. Scroll Reveal (IntersectionObserver)
   8. Typing Effect
   9. Animated Counters
   10. Skill Bars
   11. Contact Form Validation
   12. Back To Top
   13. Footer Year
   14. Init
   ===================================================== */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. UTILITIES ---------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const throttleRAF = (fn) => {
    let ticking = false;
    return (...args) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          fn(...args);
          ticking = false;
        });
        ticking = true;
      }
    };
  };

  /* ---------- 2. LOADER ---------- */
  const initLoader = () => {
    const loader = $('#loader');
    if (!loader) return;
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('is-hidden'), 400);
    });
    // Fallback in case 'load' already fired
    if (document.readyState === 'complete') {
      setTimeout(() => loader.classList.add('is-hidden'), 400);
    }
  };

  /* ---------- 3. STARFIELD CANVAS ---------- */
  const initStarfield = () => {
    const canvas = $('#starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let width, height;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const density = Math.floor((width * height) / 9000);
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
        driftY: Math.random() * 0.05 + 0.01,
      }));
    };

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      frame += 1;
      stars.forEach((s) => {
        const alpha = s.baseAlpha + Math.sin(frame * s.twinkleSpeed + s.phase) * 0.25;
        ctx.beginPath();
        ctx.fillStyle = `rgba(220, 232, 255, ${clamp(alpha, 0, 1)})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        if (!prefersReducedMotion) {
          s.y -= s.driftY;
          if (s.y < 0) s.y = height;
        }
      });
      requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', throttleRAF(resize));
    draw();
  };

  /* ---------- 4. CURSOR GLOW ---------- */
  const initCursorGlow = () => {
    const glow = $('#cursorGlow');
    if (!glow || prefersReducedMotion) return;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animate = () => {
      glow.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      requestAnimationFrame(animate);
    };
    animate();
  };

  /* ---------- 5. NAVBAR ---------- */
  const initNavbar = () => {
    const navbar = $('#navbar');
    const navToggle = $('#navToggle');
    const navLinksWrap = $('#navLinks');
    const navLinks = $$('.nav-link');
    const progressRing = $('#navProgressRing');
    const RING_CIRCUMFERENCE = 106.8; // 2 * PI * r(17)

    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const onScroll = throttleRAF(() => {
      // Scrolled state
      navbar.classList.toggle('is-scrolled', window.scrollY > 40);

      // Progress ring
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      if (progressRing) {
        progressRing.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - progress));
      }

      // Active section highlighting
      let currentId = sections[0]?.id;
      const scrollPos = scrollTop + window.innerHeight * 0.3;
      sections.forEach((section) => {
        if (section.offsetTop <= scrollPos) currentId = section.id;
      });
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
      });
    });

    window.addEventListener('scroll', onScroll);
    onScroll();

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
      const isOpen = navLinksWrap.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile menu on link click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navLinksWrap.classList.remove('is-open');
        navToggle?.classList.remove('is-open');
        navToggle?.setAttribute('aria-expanded', 'false');
      });
    });
  };

  /* ---------- 6. SMOOTH SCROLL ---------- */
  const initSmoothScroll = () => {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId.length < 2) return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const navH = document.getElementById('navbar')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navH + 1;
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    });
  };

  /* ---------- 7. SCROLL REVEAL ---------- */
  const initScrollReveal = () => {
    const items = $$('.reveal');
    if (!items.length) return;

    items.forEach((item) => {
      const delay = item.dataset.revealDelay;
      if (delay) item.style.setProperty('--reveal-delay', `${delay}ms`);
    });

    if (prefersReducedMotion) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    items.forEach((item) => observer.observe(item));
  };

  /* ---------- 8. TYPING EFFECT ---------- */
  const initTypingEffect = () => {
    const el = $('#typedText');
    if (!el) return;

    const phrases = [
      'Front-End Developer',
      'UI / UX Designer',
      'Creative Problem Solver',
      'Building Immersive Interfaces',
    ];

    if (prefersReducedMotion) {
      el.textContent = phrases[0];
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const TYPE_SPEED = 65;
    const DELETE_SPEED = 35;
    const HOLD_TIME = 1400;

    const tick = () => {
      const current = phrases[phraseIndex];

      if (!deleting) {
        charIndex += 1;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, HOLD_TIME);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex -= 1;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    };

    tick();
  };

  /* ---------- 9. ANIMATED COUNTERS ---------- */
  const initCounters = () => {
    const counters = $$('[data-count]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      if (prefersReducedMotion) {
        el.textContent = String(target);
        return;
      }
      const duration = 1400;
      const start = performance.now();

      const step = (now) => {
        const progress = clamp((now - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        el.textContent = String(Math.floor(eased * target));
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = String(target);
        }
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((el) => observer.observe(el));
  };

  /* ---------- 10. SKILL BARS ---------- */
  const initSkillBars = () => {
    const bars = $$('.skill-bar__fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            bar.style.width = `${bar.dataset.width}%`;
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.4 }
    );

    bars.forEach((bar) => observer.observe(bar));
  };

  /* ---------- 11. CONTACT FORM VALIDATION ---------- */
  const initContactForm = () => {
    const form = $('#contactForm');
    if (!form) return;
    const status = $('#formStatus');

    const validators = {
      name: (val) => val.trim().length >= 2 || 'Please enter your name.',
      email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Please enter a valid email address.',
      message: (val) => val.trim().length >= 10 || 'Message should be at least 10 characters.',
    };

    const showError = (field, message) => {
      const group = field.closest('.form-group');
      const errorEl = group?.querySelector('.form-error');
      group?.classList.toggle('has-error', Boolean(message));
      if (errorEl) errorEl.textContent = message || '';
    };

    Object.keys(validators).forEach((name) => {
      const field = form.elements[name];
      field?.addEventListener('blur', () => {
        const result = validators[name](field.value);
        showError(field, result === true ? '' : result);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      Object.keys(validators).forEach((name) => {
        const field = form.elements[name];
        const result = validators[name](field.value);
        if (result !== true) {
          isValid = false;
          showError(field, result);
        } else {
          showError(field, '');
        }
      });

      if (!isValid) {
        status.textContent = 'Please fix the errors above before sending.';
        status.style.color = '#ff6b6b';
        return;
      }

      // No backend wired up — simulate a successful transmission.
      status.style.color = 'var(--c-cyan)';
      status.textContent = 'Transmitting…';
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      setTimeout(() => {
        status.textContent = 'Message received. I\u2019ll get back to you soon!';
        submitBtn.disabled = false;
        form.reset();
      }, 900);
    });
  };

  /* ---------- 12. BACK TO TOP ---------- */
  const initBackToTop = () => {
    const btn = $('#backToTop');
    if (!btn) return;

    const onScroll = throttleRAF(() => {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    });
    window.addEventListener('scroll', onScroll);

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  };

  /* ---------- 13. FOOTER YEAR ---------- */
  const initFooterYear = () => {
    const el = $('#year');
    if (el) el.textContent = String(new Date().getFullYear());
  };

  /* ---------- 14. INIT ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initStarfield();
    initCursorGlow();
    initNavbar();
    initSmoothScroll();
    initScrollReveal();
    initTypingEffect();
    initCounters();
    initSkillBars();
    initContactForm();
    initBackToTop();
    initFooterYear();
  });
})();