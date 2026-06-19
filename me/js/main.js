// main.js
(() => {
  /* ── 진행바 ── */
  const progressBar = document.querySelector(".progress-bar span");
  const updateProgress = () => {
    if (!progressBar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = max > 0 ? (window.scrollY / max * 100) + "%" : "0%";
  };

  /* ── 헤더 스크롤 ── */
  const header = document.getElementById("header");
  const updateHeader = () => {
    header?.classList.toggle("scrolled", window.scrollY > 60);
  };

  const topButton = document.querySelector(".top-button");
  const updateTopButton = () => {
    topButton?.classList.toggle("is-visible", window.scrollY > 500);
  };

  /* ── 헤더 nav active ── */
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".header__nav a"));
  const setActiveNav = () => {
    let current = "";
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  };

  /* ── 앵커 스무스 스크롤 ── */
  const anchors = Array.from(document.querySelectorAll("a[href^='#'], button[data-section-link]"));
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 20;
    if (window.gsap && window.ScrollToPlugin) {
      gsap.to(window, { scrollTo: { y: top }, duration: 1.0, ease: "power3.inOut" });
    } else {
      window.scrollTo({ top, behavior: "smooth" });
    }
  };
  anchors.forEach(a => {
    const href = a.getAttribute("href") || a.dataset.sectionLink;
    if (!href || !href.startsWith("#")) return;
    a.addEventListener("click", e => {
      e.preventDefault();
      closeMobileMenu();
      scrollTo(href);
    });
  });

  /* ── 모바일 메뉴 ── */
  const menuBtn = document.querySelector(".header__menu");
  const mobileMenu = document.getElementById("mobileMenu");
  let menuOpen = false;
  const openMobileMenu = () => {
    menuOpen = true;
    mobileMenu?.classList.add("open");
    mobileMenu?.removeAttribute("aria-hidden");
    menuBtn?.setAttribute("aria-expanded", "true");
    const spans = menuBtn?.querySelectorAll("span");
    if (spans) {
      spans[0].style.transform = "rotate(45deg) translate(4px, 4px)";
      spans[1].style.transform = "rotate(-45deg) translate(4px, -4px)";
    }
  };
  const closeMobileMenu = () => {
    menuOpen = false;
    mobileMenu?.classList.remove("open");
    mobileMenu?.setAttribute("aria-hidden", "true");
    menuBtn?.setAttribute("aria-expanded", "false");
    const spans = menuBtn?.querySelectorAll("span");
    if (spans) {
      spans[0].style.transform = "";
      spans[1].style.transform = "";
    }
  };
  menuBtn?.addEventListener("click", () => menuOpen ? closeMobileMenu() : openMobileMenu());
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMobileMenu(); });

  /* ── Reveal 애니메이션 ── */
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));

  /* ── GSAP 애니메이션 ── */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    /* 히어로 배경 Ken Burns — 확대 + 좌→우 이동 */
    gsap.fromTo(".s-intro__bg img",
      { scale: 1.12, x: -20 },
      { scale: 1.02, x: 0, duration: 3.2, ease: "power2.out" }
    );

    /* 히어로 배경 스크롤 패럴랙스 */
    gsap.to(".s-intro__bg img", {
      yPercent: 22,
      ease: "none",
      scrollTrigger: {
        trigger: ".s-intro",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    /* 히어로 타이틀 라인 등장 (Web, Designer) */
    const lines = document.querySelectorAll(".s-intro__title .line:not(#introName)");
    gsap.to(lines, {
      y: 0, opacity: 1,
      duration: 1.0,
      stagger: 0.12,
      ease: "power4.out",
      delay: 0.2
    });

    /* 김혜영 — 한 글자씩 등장 */
    gsap.fromTo("#introName", { opacity: 0 }, { opacity: 1, duration: 0.01, delay: 0.44 });
    gsap.fromTo("#introName .char",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.13, ease: "power4.out", delay: 0.44 }
    );

    /* 히어로 서브 + 스탯 */
    gsap.to(".s-intro__sub", {
      opacity: 1, y: 0,
      duration: 0.9, ease: "power3.out", delay: 0.65
    });
    gsap.to(".s-intro__stats", {
      opacity: 1, y: 0,
      duration: 0.9, ease: "power3.out", delay: 0.85
    });


    /* About 사진 */
    gsap.to(".s-about__photo-wrap", {
      x: 0, opacity: 1,
      duration: 1.1, ease: "power4.out",
      scrollTrigger: { trigger: ".s-about", start: "top 78%", once: true }
    });
    gsap.to(".s-about__photo-tag", {
      opacity: 1, y: 0,
      duration: 0.7, ease: "power3.out", delay: 0.4,
      scrollTrigger: { trigger: ".s-about", start: "top 78%", once: true }
    });
    gsap.to(".s-about__text-col", {
      x: 0, opacity: 1,
      duration: 1.1, ease: "power4.out", delay: 0.15,
      scrollTrigger: { trigger: ".s-about", start: "top 78%", once: true }
    });

    /* Strength head */
    gsap.to(".s-strength__head", {
      y: 0, opacity: 1,
      duration: 0.85, ease: "power3.out",
      scrollTrigger: { trigger: ".s-strength", start: "top 80%", once: true }
    });
    /* Strength 아이템 stagger */
    gsap.to(".str-item", {
      y: 0, opacity: 1,
      stagger: 0.07,
      duration: 0.7, ease: "power3.out",
      scrollTrigger: { trigger: ".s-strength__grid", start: "top 82%", once: true }
    });

    /* Experience — 헤더 */
    gsap.to(".s-exp__head", {
      y: 0, opacity: 1,
      duration: 0.85, ease: "power3.out",
      scrollTrigger: { trigger: ".s-exp__head", start: "top 82%", once: true }
    });
    /* Experience — 행 하나씩 순차 등장 */
    gsap.utils.toArray(".exp-row").forEach((row, i) => {
      gsap.to(row, {
        y: 0, opacity: 1,
        duration: 0.75,
        ease: "power3.out",
        delay: i * 0.12,
        scrollTrigger: { trigger: row, start: "top 86%", once: true }
      });
    });

    /* Skills */
    gsap.to(".s-skills__head", {
      y: 0, opacity: 1,
      duration: 0.85, ease: "power3.out",
      scrollTrigger: { trigger: ".s-skills", start: "top 78%", once: true }
    });
    gsap.to(".sk-group", {
      y: 0, opacity: 1,
      stagger: 0.1,
      duration: 0.7, ease: "power3.out",
      scrollTrigger: { trigger: ".s-skills__board", start: "top 82%", once: true }
    });
    gsap.to(".s-skills__note", {
      y: 0, opacity: 1,
      duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: ".s-skills__note", start: "top 86%", once: true }
    });

    /* Projects */
    gsap.to(".s-projects__head", {
      y: 0, opacity: 1,
      duration: 0.85, ease: "power3.out",
      scrollTrigger: { trigger: ".s-projects", start: "top 80%", once: true }
    });
    gsap.to(".pj-card", {
      y: 0, opacity: 1,
      stagger: 0.12,
      duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: ".s-projects__track", start: "top 84%", once: true }
    });

    /* Credentials */
    gsap.to(".s-cred__head", {
      y: 0, opacity: 1,
      duration: 0.85, ease: "power3.out",
      scrollTrigger: { trigger: ".s-cred", start: "top 80%", once: true }
    });
    gsap.to(".s-cred__cols > div", {
      y: 0, opacity: 1,
      stagger: 0.15,
      duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: ".s-cred__cols", start: "top 84%", once: true }
    });

    /* Contact */
    gsap.to(".s-contact__text", {
      y: 0, opacity: 1,
      duration: 1.0, ease: "power4.out",
      scrollTrigger: { trigger: ".s-contact", start: "top 72%", once: true }
    });
    gsap.to(".s-contact__links", {
      y: 0, opacity: 1,
      duration: 0.85, ease: "power3.out", delay: 0.2,
      scrollTrigger: { trigger: ".s-contact", start: "top 72%", once: true }
    });

    /* 진행바 GSAP */
    gsap.to(".progress-bar span", {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.2
      }
    });
  } else if (reduceMotion) {
    /* reduced motion: 즉시 보이게 */
    document.querySelectorAll(".s-intro__title .line, .s-intro__sub, .s-intro__stats").forEach(el => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  /* ── 스크롤 이벤트 묶음 ── */
  window.addEventListener("scroll", () => {
    updateProgress();
    updateHeader();
    updateTopButton();
    setActiveNav();
  }, { passive: true });

  /* 초기 실행 */
  updateProgress();
  updateHeader();
  updateTopButton();
  setActiveNav();
})();
