document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile menu toggle ---------- */
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const header = document.querySelector("[data-header]");
  if (menuToggle && header) {
    menuToggle.addEventListener("click", () => {
      const open = header.classList.toggle("is-menu-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const targets = document.querySelectorAll(".ct-reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    targets.forEach((t) => observer.observe(t));
  } else {
    targets.forEach((t) => t.classList.add("is-visible"));
  }

  /* ---------- Section index active state ---------- */
  const indexLinks = Array.from(document.querySelectorAll(".ct-index a"));
  const sections = indexLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length) {
    let activeId = null;
    function syncActive() {
      const line = window.innerHeight * 0.4;
      let current = sections[0];
      for (const sec of sections) {
        if (sec.getBoundingClientRect().top <= line) current = sec;
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

  /* ---------- Scroll progress bar ---------- */
  const progress = document.querySelector("[data-progress]");
  if (progress) {
    let progTick = false;
    function syncProgress() {
      const h = document.documentElement;
      const scrolled = h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1);
      progress.style.setProperty("--scroll", `${Math.min(scrolled, 1) * 100}%`);
    }
    window.addEventListener("scroll", () => {
      if (progTick) return;
      progTick = true;
      requestAnimationFrame(() => { syncProgress(); progTick = false; });
    }, { passive: true });
    syncProgress();
  }

  /* ---------- Scroll to top ---------- */
  const topBtn = document.querySelector("[data-top-btn]");
  if (topBtn) {
    let topTick = false;
    const sync = () => topBtn.classList.toggle("is-visible", (window.scrollY || 0) > 500);
    window.addEventListener("scroll", () => {
      if (topTick) return;
      topTick = true;
      requestAnimationFrame(() => { sync(); topTick = false; });
    }, { passive: true });
    topBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
    );
    sync();
  }
});
