/* ─────────────────────────────────────────
   BERESHIT — main.js
   ───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // ── Load data and build page ──────────────────────────────────────
  fetch('data.json')
    .then(r => r.json())
    .then(data => {
      buildPage(data);
      initCursor();
      initScrollReveal();
      initNavScroll();
      initRocketBtn();
    })
    .catch(err => {
      console.error('Error loading data.json:', err);
      // Fallback: init interactions even if data fails
      initCursor();
      initScrollReveal();
      initNavScroll();
      initRocketBtn();
    });

  // ── Build page from JSON ──────────────────────────────────────────
  function buildPage(data) {
    const { brand, contact, services, why } = data;



    // Portfolio images
    const postImg = document.getElementById('img-post');
    const histImg = document.getElementById('img-historia');
    if (postImg) postImg.src = brand.post_image;
    if (histImg) histImg.src = brand.historia_image;

    // Hero tagline
    const taglineEl = document.getElementById('hero-tagline');
    if (taglineEl) taglineEl.innerHTML = brand.tagline
      .split('·')
      .map((t, i) => i === 2 ? `<strong>${t.trim()}</strong>` : t.trim())
      .join(' · ');

    // Services grid
    const grid = document.getElementById('services-grid');
    if (grid) {
      grid.innerHTML = services.map(s => `
        <div class="service-card${s.status === 'coming' ? ' card-coming' : ''} reveal">
          <span class="service-icon">${s.icon}</span>
          <span class="service-tag ${s.status === 'active' ? 'tag-active' : 'tag-soon'}">${s.status_label}</span>
          <h3>${s.title}</h3>
          <p>${s.desc}</p>
          <ul class="service-list">
            ${s.items.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `).join('');
    }

    // Why items
    const whyList = document.getElementById('why-items');
    if (whyList) {
      whyList.innerHTML = why.map(w => `
        <div class="why-item reveal">
          <div class="why-num">${w.num}</div>
          <div>
            <h4>${w.title}</h4>
            <p>${w.desc}</p>
          </div>
        </div>
      `).join('');
    }

    // Contact links
    const waBtn   = document.getElementById('btn-wa');
    const igBtn   = document.getElementById('btn-ig');
    const mailBtn = document.getElementById('btn-mail');
    if (waBtn)   waBtn.href   = `https://wa.me/${contact.whatsapp}`;
    if (igBtn)   igBtn.href   = `https://instagram.com/${contact.instagram}`;
    if (mailBtn) mailBtn.href = `mailto:${contact.email}`;

    const navCta = document.getElementById('nav-cta');
    if (navCta) navCta.href = `https://wa.me/${contact.whatsapp}`;

    // Re-observe reveals after dynamic content
    initScrollReveal();
  }

  // ── Custom cursor ─────────────────────────────────────────────────
  function initCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });
    document.addEventListener('mouseover', e => {
      if (e.target.closest('a, button')) {
        cursor.classList.add('hover');
      } else {
        cursor.classList.remove('hover');
      }
    });
  }

  // ── Scroll reveal ─────────────────────────────────────────────────
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal:not(.visible)');
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 70);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
  }

  // ── Nav shrink on scroll ──────────────────────────────────────────
  function initNavScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── Floating rocket ───────────────────────────────────────────────
  function initRocketBtn() {
    const btn = document.getElementById('rocketBtn');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 450);
    }, { passive: true });
  }

});
