// common.js
(() => {
  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const sections = Array.from(document.querySelectorAll(".section[id]"));
  const links = Array.from(document.querySelectorAll("[data-section-link]"));
  const progressBar = document.querySelector(".page-progress__bar");

  const setVh = () => {
    root.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
  };

  const getTarget = (selector) => {
    if (!selector || selector === "#") return null;
    return document.querySelector(selector);
  };

  const setActive = (id) => {
    links.forEach((link) => {
      const target = link.getAttribute("data-section-link");
      link.classList.toggle("is-active", target === `#${id}`);
    });
  };

  const updateProgress = () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    progressBar.style.width = `${percent}%`;
  };

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetSelector = link.getAttribute("data-section-link");
      const target = getTarget(targetSelector);
      if (!target) return;

      event.preventDefault();

      if (window.gsap && window.ScrollToPlugin) {
        gsap.to(window, {
          duration: 1.05,
          scrollTo: {
            y: target,
            offsetY: header ? header.offsetHeight + 8 : 0,
            autoKill: true
          },
          ease: "power3.inOut"
        });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, {
    threshold: 0.45
  });

  sections.forEach((section) => io.observe(section));

  const handleHeaderScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 60);
  };

  setVh();
  updateProgress();
  handleHeaderScroll();

  window.addEventListener("resize", setVh, { passive: true });
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
})();
