(function () {
  'use strict';

  /* ── pcp-reveal 스크롤 등장 애니메이션 ──
     Single-column editorial layout: this is the only interactive
     behavior needed now that the fixed section index and the
     sticky-phone / scroll-spy layout have been removed. */
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

  var reaction = document.querySelector('[data-pcs-reaction]');
  if (reaction) {
    var title = reaction.querySelector('[data-reaction-title]');
    var copy = reaction.querySelector('[data-reaction-copy]');
    var card = reaction.querySelector('.pcs-reaction-card');
    var buttons = reaction.querySelectorAll('.pcs-reaction-btn');

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (item) { item.classList.remove('is-active'); });
        button.classList.add('is-active');

        if (title) title.textContent = button.getAttribute('data-title') || '';
        if (copy) copy.textContent = button.getAttribute('data-copy') || '';

        if (card) {
          card.classList.remove('is-changing');
          void card.offsetWidth;
          card.classList.add('is-changing');
        }
      });
    });
  }

  var flowSteps = document.querySelectorAll('#pcs-flow .pcs-step[data-flow-image]');
  var flowScreen = document.querySelector('[data-flow-screen]');
  var flowPhone = document.querySelector('.pcs-flow-phone');
  var flowLive = document.querySelector('.pcs-flow-copy-live');
  var flowStep = flowLive ? flowLive.querySelector('[data-flow-step]') : null;
  var flowTitle = flowLive ? flowLive.querySelector('[data-flow-title]') : null;
  var flowCopy = flowLive ? flowLive.querySelector('[data-flow-copy]') : null;
  var flowTags = flowLive ? flowLive.querySelector('[data-flow-tags]') : null;
  var flowQuote = flowLive ? flowLive.querySelector('[data-flow-quote]') : null;
  var flowSection = document.getElementById('pcs-flow');
  var flowStage = document.querySelector('.pcs-flow-stage');
  var activeFlowImage = flowScreen ? flowScreen.getAttribute('src') : '';
  var activeFlowIndex = -1;

  function renderFlowStep(step) {
    var nextImage = step.getAttribute('data-flow-image') || '';
    if (nextImage && nextImage !== activeFlowImage) {
      activeFlowImage = nextImage;
      flowScreen.setAttribute('src', nextImage);
      flowScreen.setAttribute('alt', (step.getAttribute('data-flow-title') || 'Service Flow') + ' screen preview');
    }

    if (flowStep) flowStep.textContent = step.getAttribute('data-flow-step') || '';
    if (flowTitle) flowTitle.textContent = step.getAttribute('data-flow-title') || '';
    if (flowCopy) flowCopy.textContent = step.getAttribute('data-flow-copy') || '';
    if (flowTags) {
      var tagSource = step.querySelector('.pcs-step-tags');
      flowTags.innerHTML = tagSource ? tagSource.innerHTML : '';
    }
    if (flowQuote) {
      var quoteSource = step.querySelector('.pcs-step-quote');
      flowQuote.textContent = quoteSource ? quoteSource.textContent : '';
    }
  }

  function setFlowStep(step, index) {
    if (!step || !flowScreen) return;
    if (typeof index === 'number' && index === activeFlowIndex) return;
    if (typeof index === 'number') activeFlowIndex = index;

    if (flowPhone) flowPhone.classList.add('is-changing');
    if (flowLive) flowLive.classList.add('is-changing');
    renderFlowStep(step);
    window.setTimeout(function () {
      if (flowPhone) flowPhone.classList.remove('is-changing');
      if (flowLive) flowLive.classList.remove('is-changing');
    }, 180);
    flowSteps.forEach(function (item) { item.classList.toggle('is-active', item === step); });
  }

  var flowStartCache = null;
  function getFlowStart() {
    // flowStage is `position: sticky`, so its own getBoundingClientRect().top
    // is ~0 whenever it's stuck — recomputing "start" from it on every
    // scroll tick would always yield roughly the current scrollY, making
    // `offset` stay near 0 forever. Instead, measure the scroll offset of
    // the *section* (which is not sticky and keeps its real document
    // position) once, and cache it; recompute on resize only.
    if (flowStartCache === null && flowSection) {
      flowStartCache = flowSection.getBoundingClientRect().top + window.pageYOffset;
    }
    return flowStartCache || 0;
  }

  function updateFlowByScroll() {
    if (!flowSection || !flowStage || !flowSteps.length) return;

    var flowStart = getFlowStart();
    var stepHeight = Math.max(1, window.innerHeight * 0.92);
    var offset = Math.max(0, window.pageYOffset - flowStart);
    var index = Math.min(flowSteps.length - 1, Math.floor(offset / stepHeight));
    setFlowStep(flowSteps[index], index);
  }

  var flowTicking = false;
  function requestFlowUpdate() {
    if (flowTicking) return;
    flowTicking = true;
    window.requestAnimationFrame(function () {
      flowTicking = false;
      updateFlowByScroll();
    });
  }

  if (flowSteps.length) {
    renderFlowStep(flowSteps[0]);
    updateFlowByScroll();
    window.addEventListener('scroll', requestFlowUpdate, { passive: true });
    window.addEventListener('resize', function () {
      flowStartCache = null;
      requestFlowUpdate();
    });
  }

})();
