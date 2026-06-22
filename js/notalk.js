/* =========================================================
   NoTalk Case Study — interactions
========================================================= */
(() => {
  const page = document.querySelector(".ntk-page");
  if (!page) return;

  /* 커스텀 커서 비활성화 */
  document.body.classList.remove("has-custom-cursor");
  [".cursor-dot", ".cursor-ring"].forEach((sel) => {
    const el = document.querySelector(sel);
    if (el) el.style.display = "none";
  });

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── 마퀴 hover pause ── */
  const marqueeTrack = page.querySelector(".ntk-marquee-track");
  if (marqueeTrack) {
    marqueeTrack.parentElement.addEventListener("mouseenter", () => { marqueeTrack.style.animationPlayState = "paused"; });
    marqueeTrack.parentElement.addEventListener("mouseleave", () => { marqueeTrack.style.animationPlayState = "running"; });
  }

  /* ── 롤링 캐러셀 ── */
  const carousel = page.querySelector(".ntk-rolling-carousel");
  if (carousel) {
    const track = carousel.querySelector(".ntk-rolling-track");
    const SPEED = 0.5;
    let x = 0, rafId = null, paused = false;

    Array.from(track.querySelectorAll(".ntk-rolling-item")).forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    function tick() {
      if (!paused) {
        x -= SPEED;
        if (Math.abs(x) >= track.scrollWidth / 2) x = 0;
        track.style.transform = `translateX(${x}px)`;
      }
      rafId = requestAnimationFrame(tick);
    }

    carousel.addEventListener("mouseenter", () => { paused = true; });
    carousel.addEventListener("mouseleave", () => { paused = false; });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !rafId) rafId = requestAnimationFrame(tick);
        else if (!entry.isIntersecting && rafId) { cancelAnimationFrame(rafId); rafId = null; }
      });
    }, { threshold: 0.1 });
    obs.observe(carousel);
  }

  /* ── Section index 활성 ── */
  const sections = document.querySelectorAll("[data-section]");
  const navLinks = document.querySelectorAll(".ntk-index a");

  if ("IntersectionObserver" in window && navLinks.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const idx = Array.from(sections).indexOf(entry.target);
        navLinks.forEach((link, i) => link.classList.toggle("is-active", i === idx));
      });
    }, { rootMargin: "-42% 0px -48% 0px", threshold: 0.01 });
    sections.forEach((s) => io.observe(s));
  }

  /* ── 모션 감소 → 전부 즉시 표시 ── */
  if (prefersReduced) {
    page.querySelectorAll(".ntk-reveal").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  /* ── GSAP 미로드 → fallback ── */
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    page.querySelectorAll(".ntk-reveal").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ── 공통 reveal (특수 처리 요소 제외) ── */
  gsap.utils.toArray(
    ".ntk-reveal:not(.ntk-goal-main):not(.ntk-goal-sub):not(.ntk-rs-item):not(.ntk-prob-card):not(.ntk-screen)"
  ).forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 36 },
      {
        opacity: 1, y: 0, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" }
      }
    );
  });

  /* ── 문제 카드 스태거 ── */
  gsap.fromTo(".ntk-prob-card",
    { opacity: 0, y: 48, scale: 0.97 },
    {
      opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: ".ntk-problem-cards", start: "top 84%" }
    }
  );

  /* ── Goal 카드 ── */
  gsap.fromTo(".ntk-goal-main",
    { opacity: 0, x: -36 },
    {
      opacity: 1, x: 0, duration: 0.85, ease: "power3.out",
      scrollTrigger: { trigger: ".ntk-goal-layout", start: "top 84%" }
    }
  );
  gsap.fromTo(".ntk-goal-sub",
    { opacity: 0, x: 36 },
    {
      opacity: 1, x: 0, stagger: 0.1, duration: 0.75, ease: "power3.out",
      scrollTrigger: { trigger: ".ntk-goal-layout", start: "top 84%" }
    }
  );

  /* ── 앱 스크린 — rise 클래스 CSS transform과 충돌 않도록 opacity만 fade ── */
  gsap.fromTo(".ntk-screen",
    { opacity: 0 },
    {
      opacity: 1, stagger: 0.1, duration: 0.9, ease: "power2.out",
      scrollTrigger: { trigger: ".ntk-screens", start: "top 86%" }
    }
  );

  /* ── 결과 요약 카드 ── */
  gsap.fromTo(".ntk-rs-item",
    { opacity: 0, y: 32 },
    {
      opacity: 1, y: 0, stagger: 0.1, duration: 0.75, ease: "power3.out",
      scrollTrigger: { trigger: ".ntk-result-summary", start: "top 86%" }
    }
  );

  /* ── 뱃지 ── */
  gsap.from(".ntk-badge-item", {
    opacity: 0, scale: 0.65, stagger: 0.04, duration: 0.45, ease: "back.out(1.5)",
    scrollTrigger: { trigger: ".ntk-badge-grid", start: "top 87%" }
  });

  /* ── 히어로 캐릭터 ── */
  gsap.fromTo(".ntk-hc",
    { opacity: 0, scale: 0.5 },
    { opacity: 0.22, scale: 1, stagger: 0.12, duration: 1.2, ease: "back.out(1.4)", delay: 0.4 }
  );

})();
