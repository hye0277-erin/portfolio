document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Reveal on scroll ---------- */
  const targets = document.querySelectorAll(".wp-reveal");
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
  const indexLinks = Array.from(document.querySelectorAll(".wp-index a"));
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
    let tick = false;
    window.addEventListener("scroll", () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => { syncActive(); tick = false; });
    }, { passive: true });
    window.addEventListener("resize", syncActive, { passive: true });
    syncActive();
  }

  /* ---------- Scroll to top ---------- */
  const topBtn = document.querySelector("[data-top-btn]");
  if (topBtn) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let topTick = false;
    function syncTop() {
      topBtn.classList.toggle("is-visible", (window.scrollY || 0) > 500);
    }
    window.addEventListener("scroll", () => {
      if (topTick) return;
      topTick = true;
      requestAnimationFrame(() => { syncTop(); topTick = false; });
    }, { passive: true });
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
    syncTop();
  }
});
