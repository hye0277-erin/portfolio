/* =========================================================
   PetCare+ Case Study - interactions
========================================================= */
(() => {
  const page = document.querySelector(".petcase-page");
  if (!page) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Phone slideshow */
  const slideshow = page.querySelector("[data-slideshow]");
  if (slideshow) {
    const slides = Array.from(slideshow.querySelectorAll("img"));
    if (slides.length > 1) {
      let current = 0;
      setInterval(() => {
        slides[current].classList.remove("is-active");
        current = (current + 1) % slides.length;
        slides[current].classList.add("is-active");
      }, 2600);
    }
  }

  /* Rolling carousel - auto scroll */
  const carousel = page.querySelector(".pcp-rolling-carousel");
  if (carousel) {
    const track = carousel.querySelector(".pcp-rolling-track");
    const SPEED = 0.6; /* px per frame */
    let x = 0;
    let rafId = null;
    let paused = false;

    function getTrackWidth() {
      return track.scrollWidth;
    }

    /* clone items for seamless loop */
    const origItems = Array.from(track.querySelectorAll(".pcp-rolling-item"));
    origItems.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    function tick() {
      if (!paused) {
        x -= SPEED;
        const half = getTrackWidth() / 2;
        if (Math.abs(x) >= half) x = 0;
        track.style.transform = `translateX(${x}px)`;
      }
      rafId = requestAnimationFrame(tick);
    }

    /* pause on hover */
    carousel.addEventListener("mouseenter", () => { paused = true; });
    carousel.addEventListener("mouseleave", () => { paused = false; });

    /* drag */
    let isDragging = false;
    let dragStartX = 0;
    let dragStartOffset = 0;

    carousel.addEventListener("mousedown", (e) => {
      isDragging = true;
      paused = true;
      dragStartX = e.clientX;
      dragStartOffset = x;
      carousel.classList.add("is-dragging");
    });
    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const delta = e.clientX - dragStartX;
      x = dragStartOffset + delta;
      const half = getTrackWidth() / 2;
      if (x > 0) x = x - half;
      if (x < -half) x = x + half;
      track.style.transform = `translateX(${x}px)`;
    });
    window.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      paused = false;
      carousel.classList.remove("is-dragging");
    });
    carousel.addEventListener("touchstart", (e) => {
      paused = true;
      dragStartX = e.touches[0].clientX;
      dragStartOffset = x;
    }, { passive: true });
    carousel.addEventListener("touchmove", (e) => {
      const delta = e.touches[0].clientX - dragStartX;
      x = dragStartOffset + delta;
      const half = getTrackWidth() / 2;
      if (x > 0) x = x - half;
      if (x < -half) x = x + half;
      track.style.transform = `translateX(${x}px)`;
    }, { passive: true });
    carousel.addEventListener("touchend", () => { paused = false; });

    /* start when in view */
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !rafId) rafId = requestAnimationFrame(tick);
        else if (!entry.isIntersecting && rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    }, { threshold: 0.2 });
    obs.observe(carousel);
  }

  const sections = page.querySelectorAll("[data-section]");
  const navLinks = page.querySelectorAll(".pcp-fixed-index a");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeIndex = Array.from(sections).indexOf(entry.target);
        navLinks.forEach((link, index) => {
          link.classList.toggle("is-active", index === activeIndex);
        });
      });
    }, { rootMargin: "-42% 0px -48% 0px", threshold: 0.01 });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || prefersReduced) {
    page.querySelectorAll(".pcp-reveal").forEach((item) => item.classList.add("is-visible"));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

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

  gsap.utils.toArray(".pcp-title, .pcp-section-title").forEach((title) => {
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

  gsap.utils.toArray(".pcp-insight-row").forEach((row) => {
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

  gsap.utils.toArray(".pcp-result-card").forEach((card, index) => {
    gsap.from(card, {
      y: 80 + (index * 20),
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".pcp-result-grid",
        start: "top 85%"
      }
    });
  });

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
