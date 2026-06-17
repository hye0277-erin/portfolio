// gsap-animations.js
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  gsap.defaults({ ease: "power3.out", duration: 0.85 });

  // ── 헤더 스크롤 감지 ──
  ScrollTrigger.create({
    start: "top -60px",
    onEnter: () => document.querySelector("[data-header]")?.classList.add("is-scrolled"),
    onLeaveBack: () => document.querySelector("[data-header]")?.classList.remove("is-scrolled")
  });

  // ── 히어로 h1 텍스트 라인 분리 애니메이션 ──
  const heroH1 = document.querySelector(".hero__copy h1");
  if (heroH1) {
    const lines = Array.from(heroH1.querySelectorAll("br")).reduce((acc, br) => {
      acc.push(br); return acc;
    }, []);

    gsap.from(heroH1, {
      y: 40,
      opacity: 0,
      duration: 1.1,
      ease: "power4.out",
      delay: 0.15
    });
  }

  // ── Eyebrow + lead 순차 등장 ──
  const heroCopy = document.querySelector(".hero__copy");
  if (heroCopy) {
    const seq = [
      heroCopy.querySelector(".eyebrow"),
      heroCopy.querySelector("h1"),
      heroCopy.querySelector(".lead"),
      heroCopy.querySelector(".hero__actions")
    ].filter(Boolean);

    gsap.from(seq, {
      y: 36,
      opacity: 0,
      stagger: 0.12,
      duration: 1.0,
      ease: "power3.out",
      delay: 0.1
    });
  }

  // ── 히어로 비주얼 ──
  gsap.from(".hero__visual", {
    x: 30,
    opacity: 0,
    scale: 0.96,
    duration: 1.2,
    ease: "power4.out",
    delay: 0.3
  });

  // ── 히어로 서머리 ──
  const summaryCards = gsap.utils.toArray(".hero__summary article");
  gsap.from(summaryCards, {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.75,
    ease: "power3.out",
    delay: 0.55
  });

  // ── 스크롤 fade-up ──
  gsap.utils.toArray('[data-animate="fade-up"]').forEach((item) => {
    gsap.from(item, {
      y: 48,
      opacity: 0,
      scrollTrigger: {
        trigger: item,
        start: "top 84%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // ── 스크롤 scale-in ──
  gsap.utils.toArray('[data-animate="scale-in"]').forEach((item) => {
    gsap.from(item, {
      y: 44,
      scale: 0.95,
      opacity: 0,
      duration: 1.0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 84%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // ── stagger 그룹 ──
  gsap.utils.toArray('[data-animate="stagger"]').forEach((group) => {
    const children = Array.from(group.children);
    gsap.from(children, {
      y: 40,
      opacity: 0,
      stagger: { amount: 0.55, ease: "power1.in" },
      duration: 0.75,
      ease: "power3.out",
      scrollTrigger: {
        trigger: group,
        start: "top 82%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // ── 패럴랙스 ──
  gsap.utils.toArray("[data-parallax]").forEach((item) => {
    const amount = Number(item.dataset.parallax || 30);
    gsap.to(item, {
      y: amount * -1,
      ease: "none",
      scrollTrigger: {
        trigger: item.closest(".section") || item,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.4
      }
    });
  });

  // ── 타임라인 라인 드로 ──
  const timelineLine = document.querySelector(".timeline::before");
  const timelineEl = document.querySelector(".timeline");
  if (timelineEl) {
    gsap.from(timelineEl, {
      "--line-height": "0%",
      ease: "none",
      scrollTrigger: {
        trigger: timelineEl,
        start: "top 70%",
        end: "bottom 60%",
        scrub: 1
      }
    });
  }

  // ── 타임라인 아이템 ──
  gsap.utils.toArray(".timeline-item").forEach((item, i) => {
    gsap.from(item, {
      x: -30,
      opacity: 0,
      duration: 0.7,
      delay: i * 0.05,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 86%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // ── 섹션 페이드 ──
  gsap.utils.toArray(".section").forEach((section) => {
    gsap.fromTo(section,
      { opacity: 0.6 },
      {
        opacity: 1,
        duration: 0.7,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 30%",
          scrub: true
        }
      }
    );
  });

  // ── 스크롤 진행바 ──
  gsap.to(".page-progress__bar", {
    width: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.15
    }
  });

  // ── 숫자 카운트업 ──
  const countEls = document.querySelectorAll("[data-countup]");
  countEls.forEach((el) => {
    const target = parseInt(el.dataset.countup, 10);
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.4,
      ease: "power2.out",
      snap: { val: 1 },
      scrollTrigger: {
        trigger: el,
        start: "top 84%",
        once: true
      },
      onUpdate: () => {
        el.textContent = obj.val + (el.dataset.suffix || "");
      }
    });
  });

  // ── 배경 오브 마우스 시차 ──
  const orbs = document.querySelectorAll(".bg-orb");
  if (orbs.length > 0) {
    document.addEventListener("mousemove", (e) => {
      const xRatio = (e.clientX / window.innerWidth - 0.5) * 2;
      const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;

      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 12;
        gsap.to(orb, {
          x: xRatio * factor,
          y: yRatio * factor,
          duration: 1.8,
          ease: "power2.out"
        });
      });
    }, { passive: true });
  }

  // ── 스킬 태그 물결 ──
  document.querySelectorAll(".tag-list").forEach((list) => {
    const tags = Array.from(list.querySelectorAll("span"));
    gsap.from(tags, {
      y: 14,
      opacity: 0,
      scale: 0.9,
      stagger: 0.07,
      duration: 0.5,
      ease: "back.out(1.4)",
      scrollTrigger: {
        trigger: list,
        start: "top 86%",
        toggleActions: "play none none reverse"
      }
    });
  });
})();
