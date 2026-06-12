/* =========================================================
  HYE02 PORTFOLIO SCRIPT
  - GSAP / ScrollTrigger / Draggable / Lenis
  - 인트로: 3D 로툰다 (3초 간격 자동 회전, 스크롤 가로채지 않음)
  - 그 외: 커스텀 커서 · 마그네틱 · 인덱스 호버 프리뷰 · 스크롤 진행바
========================================================= */

/* =========================================================
  PROCESS 타임라인 활성화 (GSAP과 독립 실행)
  - GSAP/CDN 로드 실패와 무관하게 항상 동작하도록 별도 리스너로 분리
  - 화면에 들어오면 anim-ready로 잠시 숨겼다가 is-active로 순차 등장
========================================================= */
window.addEventListener("DOMContentLoaded", () => {
  const timeline = document.querySelector("[data-process]");
  if (!timeline) return;
  const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduce || !("IntersectionObserver" in window)) {
    timeline.classList.add("is-active"); // 모션 최소화: 바로 표시
    return;
  }

  // 등장 애니메이션을 위해 잠시 숨김
  timeline.classList.add("anim-ready");

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        timeline.classList.add("is-active");
        obs.disconnect();
      }
    });
  }, { threshold: 0.2 });
  io.observe(timeline);
});

/* =========================================================
  PROJECT INDEX 미리보기 (GSAP과 독립 실행)
  - 이름 위에 마우스를 올리면 커서를 따라오는 미리보기가 나타남
  - GSAP/CDN 로드 실패와 무관하게 항상 동작하도록 순수 JS로 분리
========================================================= */
window.addEventListener("DOMContentLoaded", () => {
  const indexWrap = document.querySelector("[data-index]");
  const preview = document.querySelector("[data-index-preview]");
  const previewImg = document.querySelector("[data-index-preview-img]");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!indexWrap || !preview || !previewImg || !finePointer) return;

  const rows = indexWrap.querySelectorAll(".index-row");
  let rafId = null;
  let tx = 0, ty = 0, cx = 0, cy = 0; // target / current 좌표

  const follow = () => {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    preview.style.transform = `translate(${cx}px, ${cy}px)`;
    if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
      rafId = requestAnimationFrame(follow);
    } else {
      rafId = null;
    }
  };

  indexWrap.addEventListener("pointermove", (e) => {
    const r = indexWrap.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
    if (rafId === null) { cx = tx; cy = ty; follow(); }
  });

  rows.forEach((row) => {
    row.addEventListener("pointerenter", () => {
      const src = row.dataset.img;
      if (src) { previewImg.src = src; preview.classList.remove("is-empty"); }
      else { previewImg.removeAttribute("src"); preview.classList.add("is-empty"); }
      preview.classList.add("is-visible");
      indexWrap.classList.add("is-hovering");
      rows.forEach((r) => r.classList.toggle("is-dimmed", r !== row));
    });
    row.addEventListener("pointerleave", () => {
      preview.classList.remove("is-visible");
      indexWrap.classList.remove("is-hovering");
      rows.forEach((r) => r.classList.remove("is-dimmed"));
    });
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  gsap.registerPlugin(ScrollTrigger, Draggable);
  const pad = (n) => String(n).padStart(2, "0");

  /* =======================================================
    SMOOTH SCROLL (Lenis) + 앵커 이동
  ======================================================= */
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.5 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { offset: -10 });
    else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      // 외부 URL 등으로 href가 바뀐 경우(예: 회전 갤러리의 Live Site 버튼)는 가로채지 않고 그대로 이동
      if (!id || !id.startsWith("#") || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
    });
  });

  /* =======================================================
    SCROLL PROGRESS BAR
  ======================================================= */
  const progressEl = document.querySelector("[data-progress]");
  if (progressEl) {
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: (self) => { progressEl.style.transform = `scaleX(${self.progress})`; }
    });
  }

  /* =======================================================
    HEADER SCROLL STATE
  ======================================================= */
  const header = document.querySelector("[data-header]");
  ScrollTrigger.create({
    start: 30, end: "max",
    onUpdate: (self) => header?.classList.toggle("is-scrolled", self.scroll() > 50)
  });

  const scrollTopBtn = document.querySelector("[data-scroll-top]");
  if (scrollTopBtn) {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => scrollTopBtn.classList.toggle("is-visible", self.scroll() > 500)
    });

    scrollTopBtn.addEventListener("click", () => {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* =======================================================
    INTRO 텍스트 애니메이션
  ======================================================= */
  if (!reduceMotion) {
    gsap.set(".js-title-line", { yPercent: 115, rotate: 2, opacity: 0 });
    gsap.set(".js-reveal-text", { y: 24, opacity: 0 });
    gsap.set(".intro-panel, .intro-control", { y: 24, opacity: 0 });

    gsap.timeline({ defaults: { ease: "power4.out" } })
      .to(".js-title-line", { yPercent: 0, rotate: 0, opacity: 1, duration: 1.15, stagger: 0.08 })
      .to(".js-reveal-text", { y: 0, opacity: 1, duration: 0.75, stagger: 0.08 }, "-=0.65")
      .to(".intro-panel, .intro-control", { y: 0, opacity: 1, duration: 0.7 }, "-=0.4");
  }

  /* =======================================================
    3D ROTUNDA (자동 회전)
    - 3초마다 다음 카드로 자동 회전합니다.
    - 휠로 스크롤을 가로채지 않으므로 페이지는 정상 스크롤됩니다.
    - 드래그 / 좌우 화살표 / 버튼으로 직접 조작할 수 있습니다.
  ======================================================= */
  (function rotunda() {
    const stage = document.querySelector("[data-rotunda-stage]");
    if (!stage) return;
    const cards = gsap.utils.toArray(".rotunda-card");
    const total = cards.length;
    if (!total) return;

    const angle = 360 / total;
    const currentEl = document.querySelector("[data-current]");
    const totalEl = document.querySelector("[data-total]");
    const activeTitle = document.querySelector("[data-active-title]");
    const activeType = document.querySelector("[data-active-type]");
    const activeLink = document.querySelector("[data-active-link]");
    const prevBtn = document.querySelector("[data-prev]");
    const nextBtn = document.querySelector("[data-next]");

    let current = 0;
    let radius = getRadius();
    if (totalEl) totalEl.textContent = pad(total);

    function getRadius() {
      if (window.innerWidth <= 560) return 430;
      if (window.innerWidth <= 860) return 520;
      if (window.innerWidth <= 1200) return 620;
      return 760;
    }

    function layoutCards() {
      radius = getRadius();
      cards.forEach((card, i) => {
        gsap.set(card, {
          xPercent: -50, yPercent: -50,
          rotationY: i * angle, z: radius,
          transformOrigin: `50% 50% -${radius}px`
        });
      });
      gsap.set(stage, { rotationY: -current * angle });
      updateActive(false);
    }

    const norm = (i) => (i + total) % total;
    function dist(i, active) {
      let d = i - active;
      if (d > total / 2) d -= total;
      if (d < -total / 2) d += total;
      return d;
    }

    function updateActive(animate = true) {
      const activeCard = cards[current];
      if (currentEl) currentEl.textContent = pad(current + 1);
      if (activeCard && activeTitle) {
        activeTitle.textContent = activeCard.dataset.title || "Project";
        activeType.textContent = activeCard.dataset.type || "Portfolio Work";
        activeLink.setAttribute("href", activeCard.dataset.link || "#works");
      }
      cards.forEach((card, i) => {
        const d = Math.abs(dist(i, current));
        const opacity = d === 0 ? 1 : d === 1 ? 0.58 : 0.24;
        const blur = d === 0 ? 0 : d === 1 ? 0.6 : 1.8;
        const scale = d === 0 ? 1 : d === 1 ? 0.92 : 0.84;
        gsap.to(card, { opacity, scale, filter: `blur(${blur}px)`, duration: animate ? 0.55 : 0, ease: "power3.out" });
      });
    }

    function goTo(index) {
      current = norm(index);
      gsap.to(stage, { rotationY: -current * angle, duration: 1.05, ease: "power4.inOut", overwrite: true });
      updateActive(true);
    }

    layoutCards();

    /* ---- 자동 회전 (3초 간격) ---- */
    let auto = null;
    function startAuto() {
      if (reduceMotion) return;
      stopAuto();
      auto = gsap.delayedCall(2, () => { goTo(current + 1); startAuto(); });
    }
    function stopAuto() { if (auto) { auto.kill(); auto = null; } }

    // 직접 조작 시: 이동 후 자동 회전 타이머 리셋
    function manual(index) { goTo(index); startAuto(); }

    prevBtn?.addEventListener("click", () => manual(current - 1));
    nextBtn?.addEventListener("click", () => manual(current + 1));
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") manual(current - 1);
      if (e.key === "ArrowRight") manual(current + 1);
    });

    // 드래그 (proxy로 방향만 감지)
    const proxy = document.createElement("div");
    let startX = 0;
    Draggable.create(proxy, {
      type: "x", trigger: ".rotunda-wrap", inertia: false,
      onPress() { startX = this.x; stopAuto(); },
      onRelease() {
        const diff = this.x - startX;
        if (Math.abs(diff) > 26) { diff < 0 ? goTo(current + 1) : goTo(current - 1); }
        gsap.set(this.target, { x: 0 });
        startAuto();
      }
    });

    // 화면에 보일 때만 자동 회전 (성능)
    ScrollTrigger.create({
      trigger: "#intro", start: "top bottom", end: "bottom top",
      onToggle: (self) => (self.isActive ? startAuto() : stopAuto())
    });
    document.addEventListener("visibilitychange", () => (document.hidden ? stopAuto() : startAuto()));

    startAuto();
    window.addEventListener("resize", gsap.utils.debounce(layoutCards, 180));
  })();

  /* =======================================================
    SECTION REVEAL
  ======================================================= */
  if (reduceMotion) {
    gsap.set(".reveal-up", { opacity: 1 });
  } else {
    gsap.utils.toArray(".reveal-up").forEach((el) => {
      gsap.fromTo(el,
        { y: 52, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.95, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%" } });
    });
  }


  /* =======================================================
    CUSTOM CURSOR (데스크톱 정밀 포인터에서만)
  ======================================================= */
  if (finePointer && !reduceMotion) {
    document.body.classList.add("has-custom-cursor");
    const dot = document.querySelector("[data-cursor-dot]");
    const ring = document.querySelector("[data-cursor-ring]");
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" });

    window.addEventListener("pointermove", (e) => {
      dotX(e.clientX); dotY(e.clientY);
      ringX(e.clientX); ringY(e.clientY);
    });

    const hoverTargets = 'a, button, [data-magnetic], .index-row, .rotunda-card, input, textarea';
    document.querySelectorAll(hoverTargets).forEach((el) => {
      el.addEventListener("pointerenter", () => ring.classList.add("is-active"));
      el.addEventListener("pointerleave", () => ring.classList.remove("is-active"));
    });
    window.addEventListener("pointerdown", () => ring.classList.add("is-down"));
    window.addEventListener("pointerup", () => ring.classList.remove("is-down"));
  }

  /* =======================================================
    MAGNETIC BUTTONS
  ======================================================= */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = 0.32;
      const moveX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const moveY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        moveX((e.clientX - (r.left + r.width / 2)) * strength);
        moveY((e.clientY - (r.top + r.height / 2)) * strength);
      });
      el.addEventListener("pointerleave", () => { moveX(0); moveY(0); });
    });
  }

  /* =======================================================
    RESIZE
  ======================================================= */
  window.addEventListener("resize", gsap.utils.debounce(() => ScrollTrigger.refresh(), 200));
});
