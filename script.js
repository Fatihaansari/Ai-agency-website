/* ==========================================================
   Neura Agency — Interactions
   ========================================================== */
(function () {
  'use strict';

  /* ---------- Loading Screen ---------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => loader && loader.classList.add('hide'), 500);
  });

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky Navbar + Active link on scroll ---------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const backTop = document.getElementById('backToTop');

  function onScroll() {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 30);
    if (backTop) backTop.classList.toggle('show', y > 400);

    // Active section detection
    let current = '';
    sections.forEach((s) => {
      const top = s.offsetTop - 120;
      if (y >= top) current = s.id;
    });
    if (current) {
      navLinks.forEach((l) => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + current);
      });
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile Nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navLinks');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      })
    );
  }

  /* ---------- Back to Top ---------- */
  if (backTop) {
    backTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  /* ---------- Scroll Reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));

  /* ---------- Animated Counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.count;
        const duration = 1600;
        const start = performance.now();
        const isYear = target > 1900;
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = Math.floor(eased * target);
          el.textContent = isYear ? val : val + (target >= 90 && target < 100 ? '%' : target >= 50 ? '+' : '');
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = isYear ? target : target + (target >= 90 && target < 100 ? '%' : target >= 50 ? '+' : '');
        }
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((c) => counterIO.observe(c));

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((o) => o.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------- Contact Form Validation ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    const successMsg = document.getElementById('formSuccess');
    const fields = ['name', 'email', 'subject', 'message'];

    function setError(name, msg) {
      const input = form.querySelector('[name="' + name + '"]');
      const err = form.querySelector('[data-err="' + name + '"]');
      const field = input.closest('.field');
      if (msg) {
        field.classList.add('error');
        err.textContent = msg;
      } else {
        field.classList.remove('error');
        err.textContent = '';
      }
    }

    function validate() {
      let ok = true;
      const values = {};
      fields.forEach((f) => (values[f] = form[f].value.trim()));

      if (values.name.length < 2) { setError('name', 'Please enter your name.'); ok = false; }
      else setError('name', '');

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRe.test(values.email)) { setError('email', 'Enter a valid email address.'); ok = false; }
      else setError('email', '');

      if (values.subject.length < 3) { setError('subject', 'Subject is too short.'); ok = false; }
      else setError('subject', '');

      if (values.message.length < 10) { setError('message', 'Message must be at least 10 characters.'); ok = false; }
      else setError('message', '');

      return ok;
    }

    fields.forEach((f) => {
      form[f].addEventListener('input', () => {
        if (form.querySelector('[data-err="' + f + '"]').textContent) validate();
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) return;
      // Simulate submission
      form.querySelector('button[type="submit"]').textContent = 'Sending…';
      setTimeout(() => {
        form.reset();
        successMsg.hidden = false;
        form.querySelector('button[type="submit"]').innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
        setTimeout(() => (successMsg.hidden = true), 5000);
      }, 800);
    });
  }
})();
