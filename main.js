/* ─────────────────────────────────────────
   BERESHIT — main.js
   ───────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((r) => r.json())
    .then((data) => {
      buildPage(data);
      initCanvas();
      initTypewriter();
      initCursor();
      initScrollReveal();
      initNavScroll();
      initRocketBtn();
    })
    .catch((err) => {
      console.error("Error loading data.json:", err);
      initCanvas();
      initTypewriter();
      initCursor();
      initScrollReveal();
      initNavScroll();
      initRocketBtn();
    });

  // ── Build page from JSON ────────────────────────────────────────
  function buildPage(data) {
    const { brand, contact, services, why } = data;

    if (postImg) postImg.src = brand.post_image;
    if (histImg) histImg.src = brand.historia_image;

    // Services grid
    const grid = document.getElementById("services-grid");
    if (grid) {
      grid.innerHTML = services
        .map(
          (s) => `
        <div class="service-card${s.status === "coming" ? " card-coming" : ""} reveal">
          <span class="service-icon">${s.icon}</span>
          <span class="service-tag ${s.status === "active" ? "tag-active" : "tag-soon"}">${s.status_label}</span>
          <h3>${s.title}</h3>
          <p>${s.desc}</p>
          <ul class="service-list">
            ${s.items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      `,
        )
        .join("");
    }

    // Why items
    const whyList = document.getElementById("why-items");
    if (whyList) {
      whyList.innerHTML = why
        .map(
          (w) => `
        <div class="why-item reveal">
          <div class="why-num">${w.num}</div>
          <div><h4>${w.title}</h4><p>${w.desc}</p></div>
        </div>
      `,
        )
        .join("");
    }

  }

  // ── Canvas Particles ────────────────────────────────────────────
  function initCanvas() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Mouse tracking for interactive particles
    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    canvas.closest("section").addEventListener(
      "mousemove",
      (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      },
      { passive: true },
    );

    // Create particles
    const COUNT = 80;
    const particles = Array.from({ length: COUNT }, () => makeParticle());

    function makeParticle(reset = false) {
      return {
        x: reset ? Math.random() * canvas.width : Math.random() * canvas.width,
        y: reset
          ? Math.random() * canvas.height
          : Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      };
    }

    // Draw subtle grid lines
    function drawGrid() {
      ctx.strokeStyle = "rgba(255,106,0,0.035)";
      ctx.lineWidth = 1;
      const gSize = 60;
      for (let x = 0; x < canvas.width; x += gSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Draw radial glow
    function drawGlow() {
      const grad = ctx.createRadialGradient(
        canvas.width * 0.38,
        canvas.height * 0.42,
        0,
        canvas.width * 0.38,
        canvas.height * 0.42,
        canvas.width * 0.55,
      );
      grad.addColorStop(0, "rgba(255,106,0,0.07)");
      grad.addColorStop(0.5, "rgba(255,106,0,0.03)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    let raf;
    function draw(ts) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      drawGlow();

      particles.forEach((p) => {
        p.pulse += 0.018;
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

        // Gentle mouse attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.vx += (dx / dist) * 0.012;
          p.vy += (dy / dist) * 0.012;
        }

        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0.9) {
          p.vx *= 0.9;
          p.vy *= 0.9;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,106,0,${a})`;
        ctx.fill();

        // Connect nearby particles
        particles.forEach((q) => {
          const ex = p.x - q.x,
            ey = p.y - q.y;
          const d = Math.sqrt(ex * ex + ey * ey);
          if (d < 100 && d > 0) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(255,106,0,${0.06 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      raf = requestAnimationFrame(draw);
    }

    draw(0);
    // Pause when tab hidden
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else draw(0);
    });
  }

  // ── Typewriter ──────────────────────────────────────────────────
  function initTypewriter() {
    const el = document.getElementById("tw-word");
    if (!el) return;
    const words = ["Diseño Gráfico", "Mantenimiento de PC", "Páginas Web"];
    let wi = 0,
      ci = 0,
      deleting = false;

    function tick() {
      const word = words[wi];
      if (!deleting) {
        el.textContent = word.slice(0, ++ci);
        if (ci === word.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
        setTimeout(tick, 75);
      } else {
        el.textContent = word.slice(0, --ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 38);
      }
    }
    setTimeout(tick, 1400);
  }

  // ── Custom cursor ───────────────────────────────────────────────
  function initCursor() {
    const cursor = document.getElementById("cursor");
    if (!cursor) return;
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    });
    document.addEventListener("mouseover", (e) => {
      cursor.classList.toggle("hover", !!e.target.closest("a, button"));
    });
  }

  // ── Scroll reveal ───────────────────────────────────────────────
  function initScrollReveal() {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 70);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(".reveal:not(.visible)")
      .forEach((el) => io.observe(el));
  }

  // ── Nav shrink ──────────────────────────────────────────────────
  function initNavScroll() {
    const nav = document.querySelector("nav");
    if (!nav) return;
    window.addEventListener(
      "scroll",
      () => nav.classList.toggle("scrolled", scrollY > 60),
      { passive: true },
    );
  }

  // ── Floating rocket ─────────────────────────────────────────────
  function initRocketBtn() {
    const btn = document.getElementById("rocketBtn");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      () => btn.classList.toggle("visible", scrollY > 450),
      { passive: true },
    );
  }
});
