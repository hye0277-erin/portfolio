(() => {
  const page = document.querySelector('.qs-page');
  if (!page) return;


  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 스크롤 reveal ── */
  if (!reduced && 'IntersectionObserver' in window) {
    const items = page.querySelectorAll('.qs-reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-on');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    items.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 0.07}s`;
      io.observe(el);
    });
  } else {
    page.querySelectorAll('.qs-reveal').forEach(el => el.classList.add('is-on'));
  }

  /* ── 루틴 진행 바 ── */
  const routine = page.querySelector('[data-qs-routine]');
  if (routine && !reduced && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      routine.style.setProperty('--rp', '1');
    }, { threshold: 0.3 }).observe(routine);
  } else if (routine) {
    routine.style.setProperty('--rp', '1');
  }

  /* ── 닷 네비 활성화 ── */
  const dots = Array.from(page.querySelectorAll('.qs-dot-nav a'));
  const sections = Array.from(page.querySelectorAll('[data-section]'));

  if ('IntersectionObserver' in window && dots.length) {
    const activate = (id) => {
      dots.forEach(d => {
        d.classList.toggle('is-active', d.getAttribute('href') === `#${id}`);
      });
    };

    const sio = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) activate(e.target.id); });
    }, { threshold: 0.01, rootMargin: '-44% 0px -50% 0px' });

    sections.forEach(s => sio.observe(s));

    dots.forEach(dot => {
      dot.addEventListener('click', (ev) => {
        const target = document.querySelector(dot.getAttribute('href'));
        if (!target) return;
        ev.preventDefault();
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }
})();
