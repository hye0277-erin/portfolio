/* =========================================================
   PetCare+ Case Study - High-end Interactions (GSAP + ScrollTrigger)
========================================================= */
(() => {
  const page = document.querySelector('.petcase-page');
  if (!page) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. 우측 섹션 인덱스 활성화 (IntersectionObserver) ---------- */
  const sections = page.querySelectorAll('[data-section]');
  const navLinks = page.querySelectorAll('.pcp-fixed-index a');

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeIndex = Array.from(sections).indexOf(entry.target);
        navLinks.forEach((link, index) => {
          link.classList.toggle('is-active', index === activeIndex);
        });
      });
    }, { rootMargin: '-42% 0px -48% 0px', threshold: 0.01 });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // GSAP이 로드되지 않았거나 모션 최소화가 켜져 있으면 종료
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || prefersReduced) {
    // GSAP이 없을 때만 기본 페이드인 효과 주기 위해 fallback 클래스 추가
    const reveals = page.querySelectorAll('.pcp-reveal');
    reveals.forEach(r => r.classList.add('is-visible'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // 2. 히어로 폰 목업 입체 스크롤 모션 (3D Parallax & Scale)
  const phone = document.querySelector(".pcp-phone");
  if (phone) {
    gsap.fromTo(phone, 
      { rotationY: -16, rotationX: 8, y: 10, scale: 0.96 },
      {
        rotationY: 8,
        rotationX: -4,
        y: -30,
        scale: 1.04,
        ease: "none",
        scrollTrigger: {
          trigger: ".pcp-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      }
    );
  }

  // 3. 텍스트 마스크 및 순차 업 (Reveal Up) 애니메이션
  const titles = gsap.utils.toArray(".pcp-title, .pcp-section-title");
  titles.forEach(title => {
    gsap.fromTo(title,
      { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", y: 30 },
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        y: 0,
        duration: 1.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: title,
          start: "top 88%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // 4. Goal 카드 스태깅 모션 (Card Stagger)
  const goalCards = gsap.utils.toArray(".pcp-goal-card");
  if (goalCards.length > 0) {
    gsap.from(goalCards, {
      y: 60,
      opacity: 0,
      scale: 0.96,
      stagger: 0.12,
      duration: 0.95,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".pcp-goal-grid",
        start: "top 82%",
        toggleActions: "play none none none"
      }
    });
  }

  // 5. Insight 행 부드러운 순차 등장
  const insightRows = gsap.utils.toArray(".pcp-insight-row");
  insightRows.forEach((row, i) => {
    gsap.from(row, {
      opacity: 0,
      y: 40,
      duration: 0.95,
      ease: "power2.out",
      scrollTrigger: {
        trigger: row,
        start: "top 88%",
        toggleActions: "play none none none"
      }
    });
  });

  // 6. Background 및 System 페이지의 리스트 스태거링
  const problemItems = gsap.utils.toArray(".pcp-problem-item");
  if (problemItems.length > 0) {
    gsap.from(problemItems, {
      opacity: 0,
      y: 26,
      stagger: 0.12,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".pcp-problem-list",
        start: "top 85%"
      }
    });
  }

  const devItems = gsap.utils.toArray(".pcp-dev-item");
  if (devItems.length > 0) {
    gsap.from(devItems, {
      opacity: 0,
      x: 20,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".pcp-dev-list",
        start: "top 85%"
      }
    });
  }

  // 7. 결과(Result) 카드 패럴랙스 슬라이드 업
  const resultCards = gsap.utils.toArray(".pcp-result-card");
  resultCards.forEach((card, i) => {
    gsap.from(card, {
      y: 80 + (i * 20),
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".pcp-result-grid",
        start: "top 85%"
      }
    });
  });

  // 8. 리뷰 영역 스크롤 반응 스케일
  const review = document.querySelector(".pcp-review");
  if (review) {
    gsap.fromTo(review,
      { scale: 0.95 },
      {
        scale: 1,
        duration: 1,
        ease: "power1.out",
        scrollTrigger: {
          trigger: review,
          start: "top 95%",
          end: "bottom center",
          scrub: 0.5
        }
      }
    );
  }
})();
