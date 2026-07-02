(function () {
  'use strict';

  /* ── pcp-reveal 애니메이션 ── */
  var reveals = document.querySelectorAll('.pcp-reveal');
  if ('IntersectionObserver' in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          revObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { revObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ── 우측 고정 인덱스 active ── */
  var indexLinks = document.querySelectorAll('.pcp-fixed-index a');
  var sections   = document.querySelectorAll('[data-section]');

  if ('IntersectionObserver' in window && indexLinks.length) {
    var secMap = {};
    sections.forEach(function (s) { secMap[s.id] = s; });

    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var link = document.querySelector('.pcp-fixed-index a[href="#' + e.target.id + '"]');
        if (!link) return;
        if (e.isIntersecting) link.classList.add('is-active');
        else link.classList.remove('is-active');
      });
    }, { threshold: 0.4 });
    sections.forEach(function (s) { secObs.observe(s); });
  }

  /* ── sticky 폰 교체 (Flow 섹션) ── */
  var phoneImg   = document.getElementById('pcs-phone-img');
  var phoneCap   = document.getElementById('pcs-phone-caption');
  var dots       = document.querySelectorAll('.pcs-dot');
  var steps      = document.querySelectorAll('.pcs-step[data-screen]');
  var imgBase    = './images/petcare/';
  var currentSrc = phoneImg ? phoneImg.src : '';
  var swapTimer  = null;

  function swapPhone(file, label) {
    if (!phoneImg) return;
    var newSrc = new URL(imgBase + file, location.href).href;
    if (newSrc === currentSrc) return;

    clearTimeout(swapTimer);
    phoneImg.classList.add('fading');
    swapTimer = setTimeout(function () {
      var tmp = new Image();
      tmp.onload = function () {
        phoneImg.src = newSrc;
        currentSrc = newSrc;
        phoneImg.classList.remove('fading');
        if (phoneCap && label) phoneCap.textContent = label;
      };
      tmp.onerror = function () { phoneImg.classList.remove('fading'); };
      tmp.src = newSrc;
    }, 220);
  }

  function setActiveDot(index) {
    dots.forEach(function (d, i) {
      d.classList.toggle('is-active', i === index);
      d.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  }

  /* 스크롤 IntersectionObserver — 가장 많이 보이는 step 추적 */
  if ('IntersectionObserver' in window && steps.length && phoneImg) {
    var ratios   = {};
    var activeIdx = 0;

    var stepObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        ratios[e.target.id] = { ratio: e.intersectionRatio, el: e.target };
      });

      var best = null, bestR = 0;
      Object.keys(ratios).forEach(function (k) {
        if (ratios[k].ratio > bestR) { bestR = ratios[k].ratio; best = ratios[k].el; }
      });

      if (best && bestR > 0.05) {
        var file  = best.getAttribute('data-screen');
        var label = best.getAttribute('data-label');
        swapPhone(file, label);

        /* 어떤 step인지 인덱스 */
        var idx = Array.prototype.indexOf.call(steps, best);
        if (idx !== activeIdx) {
          activeIdx = idx;
          setActiveDot(idx);
          /* 비활성 단계 dim 처리 */
          steps.forEach(function (s, i) { s.classList.toggle('is-dim', i !== idx); });
        }
      }
    }, { threshold: [0, 0.05, 0.15, 0.35, 0.5, 0.75] });

    steps.forEach(function (s) { stepObs.observe(s); });

    /* 도트 클릭 → 해당 step으로 스크롤 */
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        if (steps[i]) {
          steps[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    /* 이미지 preload */
    window.addEventListener('load', function () {
      steps.forEach(function (s) {
        var f = s.getAttribute('data-screen');
        if (f) { var img = new Image(); img.src = imgBase + f; }
      });
    });
  }

})();
