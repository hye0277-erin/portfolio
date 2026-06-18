/* =========================================================
   NoTalk Case Study — interactions
========================================================= */
(() => {
  const page = document.querySelector(".ntk-page");
  if (!page) return;

  /* 커스텀 커서 완전 비활성화 */
  document.body.classList.remove("has-custom-cursor");
  [".cursor-dot", ".cursor-ring"].forEach((sel) => {
    const el = document.querySelector(sel);
    if (el) el.style.display = "none";
  });

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 캐릭터 선택 인터랙션 ---- */
  const charGrid = page.querySelector("[data-char-grid]");
  if (charGrid) {
    charGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".ntk-char-btn");
      if (!btn) return;
      charGrid.querySelectorAll(".ntk-char-btn").forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
    });
  }

  /* ---- 카테고리 마퀴 (JS 없이 CSS animation, 그냥 hover pause만) ---- */
  const catTrack = page.querySelector(".ntk-cat-track");
  if (catTrack) {
    catTrack.parentElement.addEventListener("mouseenter", () => {
      catTrack.style.animationPlayState = "paused";
    });
    catTrack.parentElement.addEventListener("mouseleave", () => {
      catTrack.style.animationPlayState = "running";
    });
  }

  /* ---- 롤링 캐러셀 (드래그 지원) ---- */
  const carousel = page.querySelector(".ntk-rolling-carousel");
  if (carousel) {
    const track = carousel.querySelector(".ntk-rolling-track");
    const SPEED = 0.55;
    let x = 0;
    let rafId = null;
    let paused = false;

    /* 클론으로 무한 루프 */
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

    /* 호버 일시정지 */
    carousel.addEventListener("mouseenter", () => { paused = true; });
    carousel.addEventListener("mouseleave", () => { paused = false; });

    /* 뷰포트 진입 시 시작 */
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !rafId) rafId = requestAnimationFrame(tick);
        else if (!entry.isIntersecting && rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    }, { threshold: 0.2 });
    obs.observe(carousel);
  }

  /* ---- Section index 활성 추적 ---- */
  const sections = page.querySelectorAll("[data-section]");
  const navLinks = page.querySelectorAll(".ntk-index a");

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

  /* ---- Reveal fallback ---- */
  if (prefersReduced) {
    page.querySelectorAll(".ntk-reveal").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  /* ---- GSAP 애니메이션 ---- */
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    page.querySelectorAll(".ntk-reveal").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* 공통 reveal — goal-card는 스태거로 처리하므로 제외 */
  gsap.utils.toArray(".ntk-reveal:not(.ntk-goal-card)").forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 36 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" }
      }
    );
  });

  /* Goal 카드 스태거 */
  gsap.fromTo(".ntk-goal-card",
    { opacity: 0, y: 40, scale: 0.96 },
    {
      opacity: 1, y: 0, scale: 1,
      stagger: 0.1, duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: ".ntk-goal-grid", start: "top 82%", toggleActions: "play none none none" }
    }
  );

  /* 뱃지 스태거 */
  gsap.from(".ntk-badge-item", {
    opacity: 0, scale: 0.7, stagger: 0.04, duration: 0.55,
    ease: "back.out(1.4)",
    scrollTrigger: { trigger: ".ntk-badge-track", start: "top 85%" }
  });

  /* 캐릭터 버튼 스태거 */
  gsap.from(".ntk-char-btn", {
    opacity: 0, scale: 0.6, stagger: 0.035, duration: 0.5,
    ease: "back.out(1.6)",
    scrollTrigger: { trigger: ".ntk-char-grid", start: "top 85%" }
  });

  /* 앱 화면 순차 */
  gsap.from(".ntk-screen", {
    opacity: 0, y: 60, stagger: 0.1, duration: 0.85,
    ease: "power3.out",
    scrollTrigger: { trigger: ".ntk-screens", start: "top 82%" }
  });

  /* 히어로 배경 캐릭터 fade in */
  gsap.fromTo(".ntk-hc",
    { opacity: 0, scale: 0.6 },
    { opacity: 0.28, scale: 1, stagger: 0.15, duration: 1.2, ease: "back.out(1.4)", delay: 0.3 }
  );
})();
