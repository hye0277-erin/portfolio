/* =========================================================
  HYE02 PORTFOLIO SCRIPT
  - GSAP / Draggable / Lenis 사용
  - 직접 수정해야 할 부분은 TODO 주석을 확인하세요.
========================================================= */

window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, Draggable);

  /* =======================================================
    SMOOTH SCROLL
    - Lenis가 불러와지지 않으면 기본 스크롤로 동작합니다.
  ======================================================= */
  if (window.Lenis) {
    const lenis = new Lenis({
      duration: 1.18,
      smoothWheel: true,
      wheelMultiplier: 0.86,
      touchMultiplier: 1.4
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* =======================================================
    INTRO TEXT ANIMATION
  ======================================================= */
  gsap.set(".js-title-line", { yPercent: 115, rotate: 2, opacity: 0 });
  gsap.set(".js-reveal-text", { y: 24, opacity: 0 });
  gsap.set(".intro-panel, .intro-control", { y: 24, opacity: 0 });

  const introTl = gsap.timeline({ defaults: { ease: "power4.out" } });
  introTl
    .to(".js-title-line", {
      yPercent: 0,
      rotate: 0,
      opacity: 1,
      duration: 1.15,
      stagger: 0.08
    })
    .to(".js-reveal-text", {
      y: 0,
      opacity: 1,
      duration: 0.75,
      stagger: 0.08
    }, "-=0.65")
    .to(".intro-panel, .intro-control", {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.08
    }, "-=0.35");

  /* =======================================================
    3D ROTUNDA
    - 카드 추가/삭제 시 HTML의 .rotunda-card만 수정하면 됩니다.
    - radius 값은 원형 깊이감입니다. 숫자가 클수록 카드 간격이 넓어집니다.
  ======================================================= */
  const stage = document.querySelector("[data-rotunda-stage]");
  const cards = gsap.utils.toArray(".rotunda-card");
  const total = cards.length;
  const angle = 360 / total;
  const currentEl = document.querySelector("[data-current]");
  const totalEl = document.querySelector("[data-total]");
  const activeTitle = document.querySelector("[data-active-title]");
  const activeType = document.querySelector("[data-active-type]");
  const activeLink = document.querySelector("[data-active-link]");
  const prevBtn = document.querySelector("[data-prev]");
  const nextBtn = document.querySelector("[data-next]");

  let current = 0;
  let wheelLocked = false;
  let radius = getRadius();

  if (totalEl) totalEl.textContent = String(total).padStart(2, "0");

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
        xPercent: -50,
        yPercent: -50,
        rotationY: i * angle,
        z: radius,
        transformOrigin: `50% 50% -${radius}px`,
        opacity: 1
      });
    });

    gsap.set(stage, { rotationY: -current * angle });
    updateActiveState(false);
  }

  function normalizeIndex(index) {
    return (index + total) % total;
  }

  function shortestDistance(i, active) {
    let diff = i - active;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  }

  function updateActiveState(animate = true) {
    const activeCard = cards[current];

    if (currentEl) currentEl.textContent = String(current + 1).padStart(2, "0");
    if (activeCard) {
      activeTitle.textContent = activeCard.dataset.title || "Project";
      activeType.textContent = activeCard.dataset.type || "Portfolio Work";
      activeLink.setAttribute("href", activeCard.dataset.link || "#works");
    }

    cards.forEach((card, i) => {
      const diff = Math.abs(shortestDistance(i, current));
      const opacity = diff === 0 ? 1 : diff === 1 ? 0.58 : 0.24;
      const blur = diff === 0 ? 0 : diff === 1 ? 0.6 : 1.8;
      const scale = diff === 0 ? 1 : diff === 1 ? 0.92 : 0.84;

      gsap.to(card, {
        opacity,
        scale,
        filter: `blur(${blur}px)`,
        duration: animate ? 0.55 : 0,
        ease: "power3.out"
      });
    });
  }

  function goTo(index) {
    current = normalizeIndex(index);

    gsap.to(stage, {
      rotationY: -current * angle,
      duration: 1.05,
      ease: "power4.inOut",
      overwrite: true
    });

    updateActiveState(true);
  }

  layoutCards();

  prevBtn?.addEventListener("click", () => goTo(current - 1));
  nextBtn?.addEventListener("click", () => goTo(current + 1));

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
  });

  /*
    휠 조작
    - 인트로 영역 위에서만 카드가 회전합니다.
    - 너무 민감하지 않도록 wheelLocked를 사용합니다.
  */
  const intro = document.querySelector("#intro");
  intro?.addEventListener("wheel", (e) => {
    const isIntroVisible = window.scrollY < intro.offsetHeight * 0.72;
    if (!isIntroVisible) return;

    if (Math.abs(e.deltaY) < 18 || wheelLocked) return;

    wheelLocked = true;
    if (e.deltaY > 0) goTo(current + 1);
    else goTo(current - 1);

    setTimeout(() => {
      wheelLocked = false;
    }, 850);
  }, { passive: true });

  /*
    드래그 조작
    - 숨겨진 proxy를 드래그해서 방향만 감지합니다.
    - 모바일 터치에서도 작동합니다.
  */
  const dragProxy = document.createElement("div");
  let dragStartX = 0;

  Draggable.create(dragProxy, {
    type: "x",
    trigger: ".rotunda-wrap",
    inertia: false,
    onPress() {
      dragStartX = this.x;
    },
    onRelease() {
      const diff = this.x - dragStartX;
      if (Math.abs(diff) > 26) {
        if (diff < 0) goTo(current + 1);
        else goTo(current - 1);
      }
      gsap.set(this.target, { x: 0 });
    }
  });

  window.addEventListener("resize", gsap.utils.debounce(() => {
    layoutCards();
    ScrollTrigger.refresh();
  }, 180));

  /* =======================================================
    SECTION REVEAL ANIMATION
  ======================================================= */
  gsap.utils.toArray(".reveal-up").forEach((el) => {
    gsap.fromTo(el,
      { y: 54, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 82%"
        }
      }
    );
  });

  /* =======================================================
    HEADER SCROLL STATE
  ======================================================= */
  const header = document.querySelector("[data-header]");
  ScrollTrigger.create({
    start: 20,
    end: 99999,
    onUpdate: (self) => {
      header?.classList.toggle("is-scrolled", self.scroll() > 40);
    }
  });
});
