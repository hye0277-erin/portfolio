document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Reveal on scroll ---------- */
  const targets = document.querySelectorAll(".fade-up, .bd-reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });
    targets.forEach((t) => observer.observe(t));
  } else {
    targets.forEach((t) => t.classList.add("is-visible"));
  }

  /* ---------- Section index active state ---------- */
  const indexLinks = Array.from(document.querySelectorAll(".bd-section-index a"));
  const sections = indexLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length) {
    let activeId = null;
    function syncActive() {
      // 뷰포트 중앙선이 어느 섹션 영역에 걸쳐 있는지 판정
      const line = window.innerHeight * 0.4;
      let current = sections[0];
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= line) current = sec;
      }
      if (current && current.id !== activeId) {
        activeId = current.id;
        indexLinks.forEach((l) =>
          l.classList.toggle("is-active", l.getAttribute("href") === `#${activeId}`)
        );
      }
    }
    let navTick = false;
    window.addEventListener("scroll", () => {
      if (navTick) return;
      navTick = true;
      requestAnimationFrame(() => { syncActive(); navTick = false; });
    }, { passive: true });
    window.addEventListener("resize", syncActive, { passive: true });
    syncActive();
  }

  /* ---------- Hero parallax + atmosphere scroll ---------- */
  const stage = document.querySelector("[data-hero-stage]");
  const depthLayers = stage ? Array.from(stage.querySelectorAll("[data-depth]")) : [];
  const atmos = document.querySelector("[data-atmos]");
  let pointerX = 0, pointerY = 0;

  if (!reduceMotion && stage) {
    window.addEventListener("pointermove", (e) => {
      pointerX = (e.clientX / window.innerWidth - 0.5);
      pointerY = (e.clientY / window.innerHeight - 0.5);
    }, { passive: true });
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      if (atmos && !reduceMotion) {
        atmos.style.setProperty("--atmos-y", `${y * 0.08}px`);
      }
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  function loopParallax() {
    if (!reduceMotion && depthLayers.length) {
      const scroll = window.scrollY || 0;
      depthLayers.forEach((layer) => {
        const d = parseFloat(layer.dataset.depth) || 0.05;
        const tx = pointerX * d * 60;
        const ty = pointerY * d * 40 + scroll * d * 0.4;
        layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    }
    requestAnimationFrame(loopParallax);
  }
  if (!reduceMotion) requestAnimationFrame(loopParallax);

  /* ---------- Floating sword tilt ---------- */
  const swordImg = document.querySelector(".bd-sword-card img");
  if (swordImg && !reduceMotion) {
    const card = swordImg.closest(".bd-sword-card");
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -10;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 14;
      swordImg.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      swordImg.style.transform = "";
    });
  }

  /* ---------- Ember particles ---------- */
  const canvas = document.querySelector("[data-embers]");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, embers = [];
    const COLORS = ["#e6b450", "#f3d489", "#c97a2c", "#b6332f"];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.min(70, Math.floor(w / 24));
      embers = Array.from({ length: count }, makeEmber);
    }
    function rand(min, max) { return min + Math.random() * (max - min); }
    function makeEmber(reset) {
      return {
        x: rand(0, w),
        y: reset ? h + rand(0, 60) : rand(0, h),
        r: rand(0.6, 2.4),
        sp: rand(0.2, 0.9),
        drift: rand(-0.4, 0.4),
        a: rand(0.2, 0.8),
        tw: rand(0.005, 0.02),
        ph: rand(0, Math.PI * 2),
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const e of embers) {
        e.y -= e.sp;
        e.x += e.drift + Math.sin(e.ph) * 0.3;
        e.ph += e.tw;
        if (e.y < -10) Object.assign(e, makeEmber(true));
        const flick = 0.6 + Math.sin(e.ph * 3) * 0.4;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = e.c;
        ctx.globalAlpha = e.a * flick;
        ctx.shadowBlur = 8;
        ctx.shadowColor = e.c;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      requestAnimationFrame(draw);
    }
    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(draw);
  }

  /* ---------- Scroll to top ---------- */
  const topBtn = document.querySelector("[data-top-btn]");
  if (topBtn) {
    let topTick = false;
    function syncTop() {
      topBtn.classList.toggle("is-visible", (window.scrollY || 0) > 500);
    }
    window.addEventListener("scroll", () => {
      if (topTick) return;
      topTick = true;
      requestAnimationFrame(() => { syncTop(); topTick = false; });
    }, { passive: true });
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
    syncTop();
  }
});
