/* Interactions: mobile nav, theme toggle, smooth scroll, reveal, modal */
(function(){
  'use strict';

  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const projectButtons = document.querySelectorAll('.open-project');
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalClose = modal.querySelector('.modal-close');
  const yearEl = document.getElementById('year');

  // Set year
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme: persist in localStorage
  const preferred = localStorage.getItem('theme');
  if(preferred) document.documentElement.setAttribute('data-theme', preferred);
  themeToggle && themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeToggle.setAttribute('aria-pressed', String(next === 'dark'));
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
  });

  // Mobile nav
  navToggle && navToggle.addEventListener('click', () => {
    const open = primaryNav.getAttribute('data-open') === 'true';
    primaryNav.setAttribute('data-open', String(!open));
    navToggle.setAttribute('aria-expanded', String(!open));
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(href === '#') return;
      const el = document.querySelector(href);
      if(el){
        e.preventDefault();
        el.scrollIntoView({behavior:'smooth',block:'start'});
        // Close mobile nav when link clicked
        if(window.innerWidth < 640){ primaryNav.setAttribute('data-open','false'); navToggle.setAttribute('aria-expanded','false'); }
      }
    });
  });

  // Intersection observer reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, {threshold:0.12});

  document.querySelectorAll('section, .card').forEach(n => io.observe(n));

  // Projects modal
  projectButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.dataset.title || 'Project';
      const desc = btn.dataset.desc || '';
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modal.setAttribute('aria-hidden','false');
      modal.querySelector('.modal-panel').focus();
    });
  });
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal(); });
  function closeModal(){ modal.setAttribute('aria-hidden','true'); }

  // Contact form (basic client-side handling)
  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = new FormData(contactForm);
      const name = form.get('name');
      const email = form.get('email');
      const message = form.get('message');
      // Fallback: open mailto when no backend is provided
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:your.email@example.com?subject=${encodeURIComponent('Portfolio contact from ' + name)}&body=${body}`;
    });
  }
})();