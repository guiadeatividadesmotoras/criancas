/* ════════════════════════════════════════════
   GUIA DE ATIVIDADES v2 — SCRIPTS
   ════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── 1. SCROLL REVEAL ───────────────────── */
  var revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback: show all
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }


  /* ─── 2. SMOOTH SCROLL ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 16;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });


  /* ─── 3. SOCIAL PROOF TOAST ──────────────── */
  var names = [
    'Ana P.', 'Mariana L.', 'Fernanda R.', 'Juliana S.', 'Patrícia M.',
    'Cristina A.', 'Débora F.', 'Larissa K.', 'Renata V.', 'Camila B.',
    'Luciana T.', 'Aline P.', 'Bruna N.', 'Tatiane O.', 'Vanessa Q.'
  ];
  var cities = [
    'São Paulo', 'Rio de Janeiro', 'Curitiba', 'Belo Horizonte',
    'Brasília', 'Salvador', 'Fortaleza', 'Porto Alegre', 'Recife',
    'Goiânia', 'Florianópolis', 'Manaus', 'Campo Grande', 'Vitória'
  ];

  var toastContainer = document.getElementById('sp-toast');
  var toastTimer = null;
  var toastEl = null;

  function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function showToast() {
    if (toastEl) {
      toastEl.classList.remove('show');
      setTimeout(buildToast, 400);
    } else {
      buildToast();
    }
  }

  function buildToast() {
    var name = rand(names);
    var city = rand(cities);
    var mins = Math.floor(Math.random() * 9) + 1;

    toastEl = document.createElement('div');
    toastEl.className = 'sp-toast-inner';
    toastEl.innerHTML =
      '<strong style="color:#1a1f2e">✅ ' + name + '</strong> de ' + city + '<br/>' +
      'acabou de garantir o Guia<br/>' +
      '<span style="color:#9ca3af">há ' + mins + ' minuto' + (mins > 1 ? 's' : '') + '</span>';

    toastContainer.innerHTML = '';
    toastContainer.appendChild(toastEl);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toastEl.classList.add('show');
      });
    });

    // Auto-hide after 4.5s
    setTimeout(function () {
      if (toastEl) toastEl.classList.remove('show');
    }, 4500);
  }

  // First toast after 7s, then random 20-38s
  setTimeout(function () {
    showToast();
    function scheduleNext() {
      var delay = Math.floor(Math.random() * 18000) + 20000;
      toastTimer = setTimeout(function () {
        showToast();
        scheduleNext();
      }, delay);
    }
    scheduleNext();
  }, 7000);


  /* ─── 4. CTA CLICK TRACKING ─────────────── */
  document.querySelectorAll('.btn-primary').forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Extend here with GTM / pixel / analytics events
      console.log('[Guia] CTA clicado:', this.id || 'btn-unknown');
    });
  });


  /* ─── 5. STICKY "SAIBA MAIS" HINT ───────── */
  // After 8 seconds on page show a subtle sticky bar if still on hero
  setTimeout(function () {
    var hero = document.getElementById('hero');
    var heroBounds = hero ? hero.getBoundingClientRect() : null;
    if (heroBounds && heroBounds.bottom > 0) {
      // user still hasn't scrolled past hero — nothing to do (page is already readable)
    }
  }, 8000);

})();


/* ─── 6. FAQ ACCORDION ───────────────────── */
(function initFAQ() {
  var items = document.querySelectorAll('.faq-item');

  items.forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var ans = item.querySelector('.faq-a');
    if (!btn || !ans) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      // Close all
      items.forEach(function (i) {
        i.classList.remove('is-open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        var a = i.querySelector('.faq-a');
        if (a) a.classList.remove('open');
      });

      // Open clicked (if it was closed)
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        ans.classList.add('open');
      }
    });
  });
})();


/* ─── 7. COUNTER ANIMATION ───────────────── */
(function initCounters() {
  var nums = document.querySelectorAll('.sp-num');
  if (!('IntersectionObserver' in window)) return;

  var counterObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      counterObs.unobserve(el);

      var suffix = el.querySelector('span');
      var suffixText = suffix ? suffix.textContent : '';
      var rawText = el.textContent.replace(suffixText, '').replace(/[^0-9.,]/g, '');
      var target = parseFloat(rawText.replace(',', '.'));
      if (isNaN(target)) return;

      var isDecimal = rawText.indexOf(',') !== -1 || rawText.indexOf('.') !== -1;
      var duration = 1400;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        var val = target * ease;
        var display = isDecimal ? val.toFixed(1).replace('.', ',') : Math.round(val).toLocaleString('pt-BR');
        el.childNodes[0].textContent = display;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  nums.forEach(function (n) { counterObs.observe(n); });
})();
