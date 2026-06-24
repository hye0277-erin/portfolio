(() => {
  /* 헤더 스크롤 */
  const header = document.getElementById("header");
  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 40);

  /* nav active */
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".hd__nav a"));
  const setActive = () => {
    let cur = "";
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
  };

  /* 앵커 스크롤 */
  document.querySelectorAll("a[href^='#']").forEach(a => {
    a.addEventListener("click", e => {
      const el = document.querySelector(a.getAttribute("href"));
      if (!el) return;
      e.preventDefault();
      closeMobile();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* 모바일 메뉴 */
  const menuBtn = document.querySelector(".hd__menu");
  const mobileNav = document.getElementById("mobileMenu");
  let open = false;
  const openMobile = () => {
    open = true; mobileNav?.classList.add("open"); mobileNav?.removeAttribute("aria-hidden");
    menuBtn?.setAttribute("aria-expanded", "true");
    const s = menuBtn?.querySelectorAll("span");
    if (s) { s[0].style.transform = "rotate(45deg) translate(4px,4px)"; s[1].style.transform = "rotate(-45deg) translate(4px,-4px)"; }
  };
  const closeMobile = () => {
    open = false; mobileNav?.classList.remove("open"); mobileNav?.setAttribute("aria-hidden","true");
    menuBtn?.setAttribute("aria-expanded","false");
    const s = menuBtn?.querySelectorAll("span");
    if (s) { s[0].style.transform = ""; s[1].style.transform = ""; }
  };
  menuBtn?.addEventListener("click", () => open ? closeMobile() : openMobile());
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMobile(); });

  /* Reveal (IntersectionObserver) */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealObs.unobserve(entry.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll("[data-reveal]").forEach(el => revealObs.observe(el));

  /* GSAP */
  const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!noMotion && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    /* 인트로 */
    gsap.fromTo("#introName .char",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: .6, stagger: .05, ease: "power4.out", delay: .1 }
    );
    gsap.fromTo(".s-intro__sub",
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: .5, ease: "power3.out", delay: .9 }
    );
    gsap.fromTo(".s-intro__float",
      { opacity: 0, scale: .8 },
      { opacity: 1, scale: 1, duration: .6, stagger: .12, ease: "back.out(1.4)", delay: 1.0 }
    );

    /* 진행바 */
    gsap.to(".progress-bar span", {
      width: "100%", ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: .2 }
    });
  } else {
    document.querySelectorAll("#introName .char, .s-intro__sub, .s-intro__float").forEach(el => {
      el.style.opacity = "1"; el.style.transform = "none";
    });
  }

  /* Work preview */
  const previewImg = document.querySelector(".work-preview__img");
  const workRows   = document.querySelectorAll(".work-list .work-row");
  if (previewImg && workRows.length) {
    let timer;
    workRows.forEach(row => {
      row.addEventListener("mouseenter", () => {
        const src = row.dataset.img;
        if (!src || previewImg.src.endsWith(src)) return;
        clearTimeout(timer);
        previewImg.classList.add("is-switching");
        timer = setTimeout(() => {
          previewImg.src = src;
          previewImg.classList.remove("is-switching");
        }, 180);
      });
    });
  }

  window.addEventListener("scroll", () => { updateHeader(); setActive(); }, { passive: true });
  updateHeader(); setActive();
})();
