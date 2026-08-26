/* Contox Cuiabá V, comportamentos da página. Sem dependências. */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header fixo ---------- */
  var hd = document.getElementById('hd');
  var onScroll = function () {
    hd.classList.toggle('is-stuck', window.scrollY > 24);
    if (sticky) sticky.hidden = window.scrollY < 420;
  };

  /* ---------- menu mobile ---------- */
  var burger = document.getElementById('burger');
  burger.addEventListener('click', function () {
    var open = document.body.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  document.querySelectorAll('#nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      document.body.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- contagem regressiva ---------- */
  // 27/11/2026, 08:00 no horário de Mato Grosso (UTC-4)
  var target = new Date('2026-11-27T08:00:00-04:00').getTime();
  var cells = {};
  ['d', 'h', 'm', 's'].forEach(function (k) {
    cells[k] = document.querySelector('[data-cd="' + k + '"]');
  });
  var pad = function (n) { return n < 10 ? '0' + n : String(n); };
  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      cells.d.textContent = '00'; cells.h.textContent = '00';
      cells.m.textContent = '00'; cells.s.textContent = '00';
      return;
    }
    var s = Math.floor(diff / 1000);
    cells.d.textContent = pad(Math.floor(s / 86400));
    cells.h.textContent = pad(Math.floor(s / 3600) % 24);
    cells.m.textContent = pad(Math.floor(s / 60) % 60);
    cells.s.textContent = pad(s % 60);
  }
  tick(); setInterval(tick, 1000);

  /* ---------- marcas ---------- */
  // 40 marcas expositoras e patrocinadoras do Contox Goiânia 2026,
  // na mesma ordem em que aparecem no site oficial da edição.
  var marcas = [
    'Rennova', 'Icone', 'Rennovari Business', 'PHD do Brasil', 'Anna Pegova',
    'Mesoestetic', 'AGR Medical', 'Captix', 'Instituto Kenedy', 'Harmoniza Pharma',
    'Hiperdental', 'La Pharma', 'DMC', 'Coren-GO', 'Pharmaesthetics',
    'CIOG', 'Instituto Kichese', 'FACOP', 'Biodermis', 'CTA Primed',
    'Biometil', 'Biometik', 'Chris Medic Training', 'HTM', 'Instituto IESE',
    'Holtec Pharma', 'Casa Lar', 'Virtulle', 'Cintas Vitória', 'Café Caramello',
    'Tinex', 'Moncoc', 'Victa', 'TB', 'MS Business Eventos',
    'Hoftek Brasil', 'Bless Brasil', 'GranFarma', 'Welty', 'Global Boost'
  ];
  var src = function (i) {
    return 'assets/marcas/marca-' + (i + 1 < 10 ? '0' : '') + (i + 1) + '.webp';
  };

  // Duas faixas: a de cima nomeia as marcas, a de baixo é decorativa
  // e roda no sentido contrário, deslocada meia lista.
  function faixa(ordem, comAlt) {
    var html = '';
    for (var copy = 0; copy < 2; copy++) {
      for (var i = 0; i < ordem.length; i++) {
        var j = ordem[i];
        html += '<img src="' + src(j) + '" width="168" height="64" loading="lazy" ' +
          (comAlt && copy === 0
            ? 'alt="Logotipo ' + marcas[j] + ', marca presente no Contox Goiânia 2026">'
            : 'alt="" aria-hidden="true">');
      }
    }
    return html;
  }
  var indices = marcas.map(function (_, i) { return i; });
  var metade = Math.ceil(marcas.length / 2);
  var t1 = document.getElementById('marqTrack');
  var t2 = document.getElementById('marqTrack2');
  if (t1) t1.innerHTML = faixa(indices, true);
  if (t2) t2.innerHTML = faixa(indices.slice(metade).concat(indices.slice(0, metade)), false);

  var grid = document.getElementById('gridMarcas');
  var toggle = document.getElementById('toggleMarcas');
  if (grid && toggle) {
    var built = false;
    toggle.addEventListener('click', function () {
      if (!built) {
        grid.innerHTML = marcas.map(function (nome, i) {
          return '<img src="' + src(i) + '" width="158" height="76" loading="lazy" alt="Logotipo ' + nome + '">';
        }).join('');
        built = true;
      }
      var open = grid.hidden;
      grid.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('span').textContent = open ? 'Ocultar as marcas' : 'Confira todas as marcas';
    });
  }

  /* ---------- reveal ---------- */
  var sticky = document.getElementById('stickyCta');
  if (!reduce && 'IntersectionObserver' in window) {
    var alvos = document.querySelectorAll('.sec > .wrap, .ficha__list, .bleed, .cta-final .wrap');
    alvos.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    alvos.forEach(function (el) { io.observe(el); });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
