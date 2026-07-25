/* ============================================================
   RĪGAS DARBVIRSMA — ATTĒLOŠANA
   app.js

   Nolasa window.RVPCA_LAUNCHPAD un uzbūvē bento sienu. Bez
   ietvariem un bez būvēšanas soļa.

   Bojāts ieraksts konfigurācijā nedrīkst nogāzt visu lapu, tāpēc
   katra grupa un flīze tiek būvēta atsevišķi un ar atkāpšanās
   vērtībām.
   ============================================================ */

(function () {
  'use strict';

  /* Toņu saimes no dizaina sistēmas — pieres laukums + monogrammas
     tinte, pārņemti no `stack` vērtībām systems-data.js. Lieto
     lietotnēm, kurām nav zīmēta produkta marķējuma. */
  var FAMILIES = {
    'Blues':    { fill: '#254CD4', ink: '#AAD0FF' },
    'Greens':   { fill: '#0D382C', ink: '#E2FF86' },
    'Reds':     { fill: '#FF4833', ink: '#43010B' },
    'Alt Blue': { fill: '#000B40', ink: '#BEAFEC' },
    'Grays':    { fill: '#565947', ink: '#FFFFFF' }
  };

  var GROUP_SPAN = { narrow: 4, wide: 6, full: 12 };
  var TILE_SPAN  = { sm: 2, md: 3, lg: 6 };

  var board  = document.getElementById('board');
  var input  = document.getElementById('filter');
  var empty  = document.getElementById('empty');
  var status = document.getElementById('status');
  var topbar = document.getElementById('topbar');
  var toggle = document.getElementById('theme-toggle');

  /* ---------- palīgi ---------- */

  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function text(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  /* Meklēšana bez diakritikas: "sagade" atrod "Sagāde". */
  function fold(value) {
    return String(value)
      .toLowerCase()
      .normalize('NFD')
      /* eslint-disable-next-line no-misleading-character-class */
      .replace(/[\u0300-\u036f]/g, '');
  }

  /* Divburtu monogramma no nosaukuma, ja konfigurācijā nav dota. */
  function deriveMono(title) {
    var letters = Array.from(title).filter(function (ch) { return /\p{L}/u.test(ch); });
    if (!letters.length) return '??';
    return (letters[0] || '').toUpperCase() + (letters[1] || '').toLowerCase();
  }

  /* ---------- flīze ---------- */

  function buildTile(app) {
    var title = text(app && app.title) || text(app && app.id);
    if (!title) return null;                       /* nav ko rādīt */

    var desc        = text(app.desc);
    var url         = text(app.url);
    var inDev       = app.status === 'izstrade';
    var size        = TILE_SPAN[app.size] ? app.size : 'md';
    var launchable  = !inDev && url !== '';

    var tile = el('div', 'tile tile--' + size + (inDev ? ' tile--izstrade' : ''));
    tile.style.setProperty('--tile-span', TILE_SPAN[size]);

    /* Palaižama flīze ir īsta saite. Izstrādē esoša nav <a> vispār,
       lai nepaliktu tukšs klikšķis — bet paliek fokusējama. */
    var inner = el(launchable ? 'a' : 'div', 'tile__inner');
    if (launchable) {
      inner.href = url;
    } else {
      inner.setAttribute('role', 'link');
      inner.setAttribute('aria-disabled', 'true');
      inner.tabIndex = 0;
    }

    /* Marķējums: zīmēts produkta marķējums vai plakana monogramma. */
    var mark = text(inDev && app.markMuted ? app.markMuted : app.mark);
    if (mark) {
      var img = el('img', 'tile__mark');
      img.src = mark;
      img.alt = '';
      img.width = 48;
      img.height = 48;
      img.loading = 'lazy';
      inner.appendChild(img);
    } else {
      var family = FAMILIES[app.family];
      var mono = el('div', 'tile__mono');
      mono.setAttribute('aria-hidden', 'true');
      mono.textContent = text(app.mono) || deriveMono(title);
      if (family && !inDev) {
        mono.style.setProperty('--mono-fill', family.fill);
        mono.style.setProperty('--mono-ink', family.ink);
      }
      inner.appendChild(mono);
    }

    var body = el('div', 'tile__body');
    var heading = el('div', 'tile__title');
    heading.textContent = title;
    body.appendChild(heading);

    if (desc) {
      var lead = el('div', 'tile__desc');
      lead.textContent = desc;
      body.appendChild(lead);
    }
    inner.appendChild(body);

    if (inDev) {
      var pillId = 'status-' + (text(app.id) || fold(title).replace(/\W+/g, '-'));
      var foot = el('div', 'tile__foot');
      var pill = el('span', 'pill');
      pill.id = pillId;
      pill.textContent = 'Izstrādē';
      foot.appendChild(pill);
      inner.appendChild(foot);
      inner.setAttribute('aria-describedby', pillId);
    }

    tile.appendChild(inner);

    /* Filtram — sameklējamais teksts sagatavots vienreiz. */
    tile.dataset.haystack = fold(title + ' ' + desc);
    return tile;
  }

  /* ---------- grupa ---------- */

  function buildGroup(group) {
    if (!group || !Array.isArray(group.apps)) return null;

    var tiles = group.apps.map(buildTile).filter(Boolean);
    if (!tiles.length) return null;

    var span = GROUP_SPAN[group.span] || GROUP_SPAN.wide;
    var section = el('section', 'group');
    section.style.setProperty('--group-span', span);

    var head = el('div', 'group__head');
    /* Funkcionālās ikonas nāk no Font Awesome Pro Light — atslēgu
       glifi paliek tikai ornamentam, kā to nosaka zīmola vadlīnijas. */
    var icon = text(group.icon);
    if (icon) {
      var mark = el('i', 'fa-light ' + (icon.indexOf('fa-') === 0 ? icon : 'fa-' + icon) + ' group__icon');
      mark.setAttribute('aria-hidden', 'true');
      head.appendChild(mark);
    }

    var heading = el('h2', 'group__title');
    heading.textContent = text(group.title) || 'Bez nosaukuma';
    head.appendChild(heading);

    var count = el('span', 'group__count');
    count.textContent = String(tiles.length);
    head.appendChild(count);

    section.appendChild(head);

    var grid = el('div', 'group__grid');
    tiles.forEach(function (tile) { grid.appendChild(tile); });
    section.appendChild(grid);

    return section;
  }

  /* ---------- attēlošana ---------- */

  function render() {
    var config = window.RVPCA_LAUNCHPAD;
    if (!config || !Array.isArray(config.groups)) {
      empty.textContent = 'Konfigurācija nav ielādēta. Pārbaudi config/apps.js.';
      empty.hidden = false;
      return;
    }

    if (text(config.title)) {
      document.getElementById('page-title').textContent = config.title;
      document.title = config.title;
    }
    if (text(config.lead)) {
      document.getElementById('page-lead').textContent = config.lead;
    }

    config.groups.forEach(function (group) {
      var section = buildGroup(group);
      if (section) board.appendChild(section);
    });
  }

  /* ---------- filtrs ---------- */

  function applyFilter() {
    var query = fold(input.value.trim());
    var visible = 0;

    board.querySelectorAll('.group').forEach(function (group) {
      var shown = 0;

      group.querySelectorAll('.tile').forEach(function (tile) {
        var match = !query || tile.dataset.haystack.indexOf(query) !== -1;
        tile.hidden = !match;
        if (match) shown++;
      });

      group.hidden = shown === 0;
      group.querySelector('.group__count').textContent = String(shown);
      visible += shown;
    });

    empty.hidden = visible !== 0;
    status.textContent = query
      ? visible + ' no ' + board.querySelectorAll('.tile').length
      : '';
  }

  /* ---------- tēma ---------- */

  function setTheme(dark) {
    document.documentElement.dataset.theme = dark ? 'sintakse-dark' : 'sintakse';
    document.documentElement.classList.toggle('dark', dark);
    /* .dark pārslēdz semantiskās markas (colors_and_type.css),
       data-theme pārslēdz DaisyUI mainīgos (daisyui-theme.css) —
       abi ir vajadzīgi, tāpat kā krāsu variantiem. */
    document.body.classList.toggle('dark', dark);
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.querySelector('i').className = dark ? 'fa-light fa-sun-bright' : 'fa-light fa-moon';
    try { localStorage.setItem('rvpca-theme', dark ? 'dark' : 'light'); } catch (e) { /* privātais režīms */ }
  }

  /* ---------- notikumi ---------- */

  render();
  setTheme(document.documentElement.classList.contains('dark'));

  input.addEventListener('input', applyFilter);

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      input.value = '';
      applyFilter();
      input.blur();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === '/' && document.activeElement !== input) {
      event.preventDefault();
      input.focus();
      input.select();
    }
  });

  toggle.addEventListener('click', function () {
    setTheme(!document.documentElement.classList.contains('dark'));
  });

  /* Matētais stikls tikai tad, kad lapa ir aizritināta. */
  var onScroll = function () {
    topbar.classList.toggle('is-stuck', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
