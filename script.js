
'use strict';

/* ── DOM refs ─────────────────────────────────── */
const loader       = document.getElementById('loader');
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const navLinks     = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');
const typedEl      = document.getElementById('typed-text');
const reveals      = document.querySelectorAll('.reveal');
const skillFills   = document.querySelectorAll('.skill-fill');
const counters     = document.querySelectorAll('.counter');
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');
const backToTop    = document.getElementById('backToTop');
const yearEl       = document.getElementById('year');

/* ── Loader ─────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 1800);
});
document.body.style.overflow = 'hidden'; // prevent scroll while loading

/* ── Year ─────────────────────────────────── */
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Navbar scroll ─────────────────────────────────── */
function handleScroll() {
  /* Scrolled class */
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  /* Back-to-top visibility */
  backToTop.classList.toggle('visible', window.scrollY > 400);

  /* Active nav link */
  const sections = document.querySelectorAll('section[id]');
  let current = '';

  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });

  navLinkItems.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // run once on load

/* ── Hamburger menu ─────────────────────────────────── */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── Typing animation ─────────────────────────────────── */
const phrases = [
  'Java Full Stack Developer',
  'Web Developer',
  'Frontend Developer',
  'Problem Solver'
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingPause = false;

function typeText() {
  if (typingPause) return;

  const current = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 55 : 95;

  if (!isDeleting && charIndex === current.length) {
    // Pause at end of phrase
    typingPause = true;
    setTimeout(() => {
      typingPause = false;
      isDeleting = true;
    }, 2000);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 300; // brief pause before typing next
  }

  setTimeout(typeText, speed);
}

// Start after loader clears
setTimeout(typeText, 2000);

/* ── Scroll Reveal ─────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

reveals.forEach(el => revealObserver.observe(el));

/* ── Skill bars ─────────────────────────────────── */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.getAttribute('data-width');
        fill.style.width = width + '%';
        skillObserver.unobserve(fill);
      }
    });
  },
  { threshold: 0.3 }
);

skillFills.forEach(fill => skillObserver.observe(fill));

/* ── Counter animation ─────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800;
  const step     = target / (duration / 16); // ~60 fps
  let current    = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach(counter => counterObserver.observe(counter));

/* ── Contact Form Validation ─────────────────────────────────── */
function showError(fieldId, msg) {
  const el = document.getElementById(fieldId + 'Error');
  if (el) el.textContent = msg;
}

function clearErrors() {
  ['name', 'email', 'message'].forEach(f => showError(f, ''));
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();
  formSuccess.classList.remove('show');

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  let valid = true;

  if (!name) {
    showError('name', 'Please enter your full name.');
    valid = false;
  } else if (name.length < 2) {
    showError('name', 'Name must be at least 2 characters.');
    valid = false;
  }

  if (!email) {
    showError('email', 'Please enter your email address.');
    valid = false;
  } else if (!validateEmail(email)) {
    showError('email', 'Please enter a valid email address.');
    valid = false;
  }

  if (!message) {
    showError('message', 'Please enter your message.');
    valid = false;
  } else if (message.length < 10) {
    showError('message', 'Message must be at least 10 characters.');
    valid = false;
  }

  if (valid) {
    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      submitBtn.disabled = false;
submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';

Swal.fire({
  icon: 'success',
  title: 'Message Sent!',
  text: 'Thank you for contacting me. I will get back to you soon.',
  confirmButtonColor: '#3b82f6'
});

contactForm.reset();
    }, 1400);
  }
});

/* ── Back to Top ─────────────────────────────────── */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Smooth scroll for all anchor links ─────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
