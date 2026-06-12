/* =========================================================
   QuietSkin — Case Study Page Interactions
   - scroll reveal
   - top progress bar
   - section index (active state + smooth scroll)
   - keyword marquee (auto loop)
   - problem accordion
   - color swatch click-to-copy (+ toast)
========================================================= */
(() => {
  const page = document.querySelector('.qs-page');
  if (!page) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Scroll reveal ---------- */
  const revealItems = page.querySelectorAll('.qs-reveal');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach((item, i) => {
      item.style.transitionDelay = `${Math.min(i % 4, 3) * 0.07}s`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-in'));
  }

  /* ---------- 2. Top progress bar ---------- */
  const progressBar = page.querySelector('[data-qs-progress]');
  const updateProgress = () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(scrollTop / max, 1) : 0;
    progressBar.style.width = `${(ratio * 100).toFixed(2)}%`;
  };

  /* ---------- 3. Section index ---------- */
  const sections = Array.from(page.querySelectorAll('[data-qs-section]'));
  const dots = Array.from(page.querySelectorAll('[data-qs-dot]'));

  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const id = dot.getAttribute('href');
      const target = id && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const idx = sections.indexOf(entry.target);
        dots.forEach((dot, i) => dot.classList.toggle('is-active', i === idx));
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0.01 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- 4. Keyword marquee ---------- */
  const track = page.querySelector('[data-qs-marquee]');
  if (track && !prefersReduced) {
    let offset = 0;
    let half = track.scrollWidth / 2;
    const speed = 0.4; // px per frame
    let paused = false;

    track.closest('.qs-marquee')?.addEventListener('mouseenter', () => { paused = true; });
    track.closest('.qs-marquee')?.addEventListener('mouseleave', () => { paused = false; });
    window.addEventListener('resize', () => { half = track.scrollWidth / 2; });

    const loop = () => {
      if (!paused) {
        offset -= speed;
        if (Math.abs(offset) >= half) offset = 0;
        track.style.transform = `translate3d(${offset}px,0,0)`;
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ---------- 5. Problem accordion ---------- */
  const accordion = page.querySelector('[data-qs-accordion]');
  if (accordion) {
    const items = Array.from(accordion.querySelectorAll('.qs-acc-item'));
    items.forEach((item) => {
      const head = item.querySelector('.qs-acc-head');
      head?.addEventListener('click', () => {
        const willOpen = !item.classList.contains('is-open');
        items.forEach((other) => {
          other.classList.remove('is-open');
          other.querySelector('.qs-acc-head')?.setAttribute('aria-expanded', 'false');
        });
        if (willOpen) {
          item.classList.add('is-open');
          head.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ---------- 6. Color swatch copy + toast ---------- */
  const toast = document.querySelector('[data-qs-toast]');
  let toastTimer = null;
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), 1600);
  };

  const palette = page.querySelector('[data-qs-palette]');
  if (palette) {
    palette.addEventListener('click', async (e) => {
      const swatch = e.target.closest('.qs-swatch');
      if (!swatch) return;
      const hex = swatch.dataset.hex || '';
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(hex);
        } else {
          const ta = document.createElement('textarea');
          ta.value = hex;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        showToast(`${hex} 복사됨`);
      } catch (err) {
        showToast(hex);
      }
    });
  }

  /* ---------- progress on scroll ---------- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateProgress(); ticking = false; });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
})();
