/* ============================================================
   RVP CA DARBVIRSMA — ATTĒLOŠANA
   app.js

   Nolasa window.RVPCA_LAUNCHPAD un uzbūvē bento sienu. Bez
   ietvariem un bez būvēšanas soļa.

   Bojāts ieraksts konfigurācijā nedrīkst nogāzt visu lapu, tāpēc
   katra grupa un flīze tiek būvēta atsevišķi un ar atkāpšanās
   vērtībām.
   ============================================================ */

(function () {
  'use strict';

  /* Pirmā darbība: atzīmē, ka skripts tiešām ir izpildījies. Uz šīs klases
     karājas rezerves paziņojums index.html — ja skripti neielādējas (404 vai
     nepareizs MIME tips ar nosniff), lapa citādi paliktu tukša bez neviena
     paskaidrojuma. Sk. docs/lv/izstrade.md → "Publicēšana". */
  document.body.classList.add('lp-ready');

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

  /* Vides, kas nav ražošanas vide, tiek atzīmētas. `prod` neko
     nezīmē — tā ir noklusējuma, klusā vide. */
  var ENVIRONMENTS = {
    test: { label: 'Testa vide', cls: 'lp-pill--test' },
    demo: { label: 'Demo', cls: 'lp-pill--demo' }
  };

  /* Cik ilgi lietotne skaitās jauna. Konfigurācijā ir datums, nevis
     karodziņš — tā atzīme noveco pati un nepaliek mūžīgi. */
  var NEW_FOR_DAYS = 30;

  var board    = document.getElementById('board');
  var empty    = document.getElementById('empty');
  var topbar   = document.getElementById('topbar');
  var toggle   = document.getElementById('theme-toggle');
  var viewBtn  = document.getElementById('view-toggle');
  var announce = document.getElementById('announce');

  /* ---------- palīgi ---------- */

  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function text(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  /* Diakritikas noņemšana — vajadzīga identifikatoru atvasināšanai. */
  function fold(value) {
    return String(value)
      .toLowerCase()
      .normalize('NFD')
      /* eslint-disable-next-line no-misleading-character-class */
      .replace(/[̀-ͯ]/g, '');
  }

  function slug(value) {
    return fold(value).replace(/\W+/g, '-').replace(/^-|-$/g, '');
  }

  /* Divburtu monogramma no nosaukuma, ja konfigurācijā nav dota. */
  function deriveMono(title) {
    var letters = Array.from(title).filter(function (ch) { return /\p{L}/u.test(ch); });
    if (!letters.length) return '??';
    return (letters[0] || '').toUpperCase() + (letters[1] || '').toLowerCase();
  }

  /* `added: 'YYYY-MM-DD'` → vai lietotne vēl skaitās jauna. */
  function isNew(added) {
    var when = Date.parse(text(added));
    if (isNaN(when)) return false;
    var days = (Date.now() - when) / 86400000;
    return days >= 0 && days <= NEW_FOR_DAYS;
  }

  /* Stabila kārtošana pēc `order`; bez tā paliek konfigurācijas secība. */
  function ordered(list) {
    return list
      .map(function (item, i) { return { item: item, i: i }; })
      .sort(function (a, b) {
        var ao = a.item && typeof a.item.order === 'number' ? a.item.order : Infinity;
        var bo = b.item && typeof b.item.order === 'number' ? b.item.order : Infinity;
        return ao === bo ? a.i - b.i : ao - bo;
      })
      .map(function (entry) { return entry.item; });
  }

  function icon(name) {
    var i = el('i', 'fa-light ' + name);
    i.setAttribute('aria-hidden', 'true');
    return i;
  }

  function pill(label, className, id) {
    var node = el('span', 'lp-pill' + (className ? ' ' + className : ''));
    node.textContent = label;
    if (id) node.id = id;
    return node;
  }

  function buildMono(app, title, inDev) {
    var family = FAMILIES[app.family];
    var mono = el('div', 'lp-tile__mono');
    mono.setAttribute('aria-hidden', 'true');
    mono.textContent = text(app.mono) || deriveMono(title);
    if (family && !inDev) {
      mono.style.setProperty('--mono-fill', family.fill);
      mono.style.setProperty('--mono-ink', family.ink);
    }
    return mono;
  }

  /* ---------- flīze ---------- */

  /* Kartes struktūra: ārējais <div> nav saite, bet nosaukums ir, un
     tā ::after pārklāj visu karti. Tas ļauj kartē būt arī citām
     saitēm (kontakts, piekļuve, jauna cilne) — <a> iekš <a> ir
     nederīgs HTML, tāpēc visa karte par saiti vairs nav. */
  function buildTile(app) {
    var title = text(app && app.title) || text(app && app.id);
    if (!title) return null;                       /* nav ko rādīt */

    var id         = text(app.id) || slug(title);
    var desc       = text(app.desc);
    var url        = text(app.url);
    var inDev      = app.status === 'izstrade';
    var size       = TILE_SPAN[app.size] ? app.size : 'md';
    var launchable = !inDev && url !== '';
    var env        = ENVIRONMENTS[app.env];
    var fresh      = !inDev && isNew(app.added);

    var tile = el('div', 'lp-tile lp-tile--' + size + (inDev ? ' lp-tile--izstrade' : ''));
    tile.style.setProperty('--tile-span', TILE_SPAN[size]);

    var card = el('div', 'lp-tile__inner');

    /* Marķējums: zīmēts produkta marķējums vai plakana monogramma. */
    var mark = text(inDev && app.markMuted ? app.markMuted : app.mark);
    if (mark) {
      var img = el('img', 'lp-tile__mark');
      img.src = mark;
      img.alt = '';
      img.width = 48;
      img.height = 48;
      img.loading = 'lazy';
      /* Trūkstošs marķējums nedrīkst atstāt salauztu attēla ikonu. */
      img.addEventListener('error', function () {
        img.replaceWith(buildMono(app, title, inDev));
      });
      card.appendChild(img);
    } else {
      card.appendChild(buildMono(app, title, inDev));
    }

    var body = el('div', 'lp-tile__body');
    var heading = el('h3', 'lp-tile__title');

    /* Pieejamā lietotne: nosaukums ir saite, kas pārklāj karti.
       Izstrādē esošā: nav saites vispār, tātad nav tukša klikšķa —
       bet paliek fokusējama un nolasāma. */
    var name;
    if (launchable) {
      name = el('a', 'lp-tile__link');
      name.href = url;
    } else {
      name = el('span', 'lp-tile__link lp-tile__link--off');
      name.setAttribute('role', 'link');
      name.setAttribute('aria-disabled', 'true');
      name.tabIndex = 0;
    }
    name.id = 'app-' + id;
    name.textContent = title;
    heading.appendChild(name);
    body.appendChild(heading);

    var describedBy = [];

    if (desc) {
      var lead = el('p', 'lp-tile__desc');
      lead.id = 'desc-' + id;
      lead.textContent = desc;
      body.appendChild(lead);
      describedBy.push(lead.id);
    }
    card.appendChild(body);

    /* Kājene tiek uzzīmēta vienmēr, arī tukša: tā visām rindas
       flīzēm ir vienāds iekšējais augstums un blakus kartes vairs
       nestiepjas ar tukšumu apakšā. */
    var foot = el('div', 'lp-tile__foot');
    var badges = el('div', 'lp-tile__badges');

    if (inDev) {
      var devPill = pill('Izstrādē', 'lp-pill--izstrade', 'status-' + id);
      badges.appendChild(devPill);
      describedBy.push(devPill.id);
    }
    if (env) {
      var envPill = pill(env.label, env.cls, 'env-' + id);
      badges.appendChild(envPill);
      describedBy.push(envPill.id);
    }
    if (fresh) {
      var newPill = pill('Jauns', 'lp-pill--new', 'new-' + id);
      badges.appendChild(newPill);
      describedBy.push(newPill.id);
    }
    foot.appendChild(badges);

    /* Sekundārās saites. Tās stāv virs nosaukuma pārklājuma, tāpēc
       ir noklikšķināmas atsevišķi.

       Etiķetēs nosaukums vienmēr stāv aiz kola un paliek nominatīvā:
       latviešu locījumu no patvaļīga nosaukuma ģenerēt nevar, un
       "Atvērt Sagāde jaunā cilnē" būtu gramatiski nepareizi. */
    var links = el('div', 'lp-tile__links');

    if (launchable) {
      var newTab = el('a', 'lp-tile__action lp-tile__action--tab');
      newTab.href = url;
      newTab.target = '_blank';
      newTab.rel = 'noopener noreferrer';
      newTab.setAttribute('aria-label', 'Atvērt jaunā cilnē: ' + title);
      newTab.appendChild(icon('fa-arrow-up-right-from-square'));
      links.appendChild(newTab);
    }

    var accessUrl = text(app.accessUrl);
    if (accessUrl) {
      var access = el('a', 'lp-tile__action');
      access.href = accessUrl;
      access.setAttribute('aria-label', 'Pieprasīt piekļuvi: ' + title);
      access.appendChild(icon('fa-key'));
      access.appendChild(document.createTextNode('Piekļuve'));
      links.appendChild(access);
    }

    var owner = text(app.owner);
    var contact = text(app.contact);
    if (owner || contact) {
      var who = owner || contact;
      var node;
      if (contact) {
        node = el('a', 'lp-tile__action');
        node.href = (contact.indexOf('@') !== -1 ? 'mailto:' : '') + contact;
        node.setAttribute('aria-label', 'Atbildīgais: ' + who + ' (' + title + ')');
      } else {
        node = el('span', 'lp-tile__action lp-tile__action--static');
      }
      node.appendChild(icon('fa-user'));
      node.appendChild(document.createTextNode(who));
      links.appendChild(node);
    }

    if (links.childNodes.length) foot.appendChild(links);
    card.appendChild(foot);

    if (describedBy.length) name.setAttribute('aria-describedby', describedBy.join(' '));

    tile.appendChild(card);
    return tile;
  }

  /* ---------- grupa ---------- */

  function buildGroup(group) {
    if (!group || !Array.isArray(group.apps)) return null;

    var tiles = ordered(group.apps).map(buildTile).filter(Boolean);
    if (!tiles.length) return null;

    var span = GROUP_SPAN[group.span] || GROUP_SPAN.wide;
    var section = el('section', 'lp-group');
    section.style.setProperty('--group-span', span);

    var id = text(group.id) || slug(text(group.title) || 'grupa');
    section.id = id;

    var head = el('div', 'lp-group__head');
    /* Funkcionālās ikonas nāk no Font Awesome Pro Light — atslēgu
       glifi paliek tikai ornamentam, kā to nosaka zīmola vadlīnijas. */
    var iconName = text(group.icon);
    if (iconName) {
      var glyph = icon(iconName.indexOf('fa-') === 0 ? iconName : 'fa-' + iconName);
      glyph.classList.add('lp-group__icon');
      head.appendChild(glyph);
    }

    var heading = el('h2', 'lp-group__title');
    heading.id = 'group-' + id;
    /* Enkurs uz grupu — lai konkrētu sadaļu var iesūtīt kolēģim. */
    var anchor = el('a', 'lp-group__anchor');
    anchor.href = '#' + id;
    anchor.textContent = text(group.title) || 'Bez nosaukuma';
    heading.appendChild(anchor);
    head.appendChild(heading);

    var count = el('span', 'lp-group__count');
    count.textContent = String(tiles.length);
    count.setAttribute('aria-label', tiles.length + ' lietotnes');
    head.appendChild(count);

    section.appendChild(head);

    var grid = el('div', 'lp-group__grid');
    grid.setAttribute('aria-labelledby', heading.id);
    tiles.forEach(function (tile) { grid.appendChild(tile); });
    section.appendChild(grid);

    return section;
  }

  /* ---------- tukšie stāvokļi ---------- */

  function showEmpty(message, hint) {
    empty.textContent = '';

    var art = el('img', 'lp-empty__art');
    art.src = 'brand/assets/illustrations/searching.svg';
    art.alt = '';
    empty.appendChild(art);

    var head = el('p', 'lp-empty__title');
    head.textContent = message;
    empty.appendChild(head);

    if (hint) {
      var sub = el('p', 'lp-empty__hint');
      sub.textContent = hint;
      empty.appendChild(sub);
    }
    empty.hidden = false;
  }

  /* ---------- attēlošana ---------- */

  function render() {
    var config = window.RVPCA_LAUNCHPAD;
    if (!config || !Array.isArray(config.groups)) {
      showEmpty('Konfigurācija nav ielādēta.',
                'config/apps.js netika izpildīts. Pārbaudi, vai fails ir '
                + 'publicēts un vai serveris to atdod ar statusu 200.');
      return;
    }

    if (text(config.title)) {
      /* Virsraksts ir dokumentā, bet vizuāli slēpts — sk. index.html. */
      document.getElementById('page-title').textContent = config.title;
      document.title = config.title;
    }

    var drawn = 0;
    ordered(config.groups).forEach(function (group) {
      var section = buildGroup(group);
      if (section) { board.appendChild(section); drawn++; }
    });

    if (!drawn) {
      showEmpty('Nav nevienas lietotnes.',
                'Pievieno pirmo config/apps.js failā, lai sāktu.');
    }
  }

  /* Paziņo ekrānlasītājam par stāvokļa maiņu, kas citādi ir tikai vizuāla. */
  function say(message) {
    if (!announce) return;
    announce.textContent = '';
    /* Tukšums un tad teksts — citādi atkārtots paziņojums netiek nolasīts. */
    window.setTimeout(function () { announce.textContent = message; }, 50);
  }

  /* ---------- tēma ---------- */

  function setTheme(dark, announceChange) {
    document.documentElement.dataset.theme = dark ? 'sintakse-dark' : 'sintakse';
    document.documentElement.classList.toggle('dark', dark);
    /* .dark pārslēdz semantiskās markas (colors_and_type.css),
       data-theme pārslēdz DaisyUI mainīgos (daisyui-theme.css) —
       abi ir vajadzīgi, tāpat kā krāsu variantiem. */
    document.body.classList.toggle('dark', dark);
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.querySelector('i').className = dark ? 'fa-light fa-sun-bright' : 'fa-light fa-moon';
    try { localStorage.setItem('rvpca-theme', dark ? 'dark' : 'light'); } catch (e) { /* privātais režīms */ }
    if (announceChange) say(dark ? 'Tumšais režīms ieslēgts.' : 'Gaišais režīms ieslēgts.');
  }

  /* ---------- skats ---------- */

  function setView(list, announceChange) {
    document.body.classList.toggle('lp-view-list', list);
    viewBtn.setAttribute('aria-pressed', String(list));
    viewBtn.querySelector('i').className = list ? 'fa-light fa-grid-2' : 'fa-light fa-list';
    viewBtn.querySelector('span').textContent = list ? 'Rādīt režģi' : 'Rādīt sarakstu';
    try { localStorage.setItem('rvpca-view', list ? 'list' : 'grid'); } catch (e) { /* privātais režīms */ }
    if (announceChange) say(list ? 'Saraksta skats.' : 'Režģa skats.');
  }

  /* ---------- tastatūra ---------- */

  /* Bultiņas pārvieto fokusu pa režģi. Visas flīzes paliek arī
     parastajā Tab secībā — šī ir papildu iespēja, nevis aizvietotājs.
     Sk. docs/lv/izstrade.md → "Tastatūra". */
  function focusables() {
    return Array.prototype.slice.call(board.querySelectorAll('.lp-tile__link'));
  }

  function onArrow(event) {
    var keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (keys.indexOf(event.key) === -1) return;

    var items = focusables();
    var at = items.indexOf(document.activeElement);
    if (at === -1) return;                     /* fokuss nav flīzē */
    event.preventDefault();

    if (event.key === 'Home') { items[0].focus(); return; }
    if (event.key === 'End')  { items[items.length - 1].focus(); return; }
    if (event.key === 'ArrowRight') { items[Math.min(at + 1, items.length - 1)].focus(); return; }
    if (event.key === 'ArrowLeft')  { items[Math.max(at - 1, 0)].focus(); return; }

    /* Augšup/lejup — ģeometriski, nevis pēc secības, lai bento
       režģī kustība atbilstu tam, ko lietotājs redz. */
    var now = document.activeElement.getBoundingClientRect();
    var down = event.key === 'ArrowDown';
    var best = null, bestScore = Infinity;

    items.forEach(function (item) {
      if (item === document.activeElement) return;
      var box = item.getBoundingClientRect();
      var dy = box.top - now.top;
      if (down ? dy <= 4 : dy >= -4) return;
      var score = Math.abs(dy) * 2 + Math.abs(box.left - now.left);
      if (score < bestScore) { bestScore = score; best = item; }
    });
    if (best) best.focus();
  }

  /* ---------- notikumi ---------- */

  render();
  setTheme(document.documentElement.classList.contains('dark'), false);

  var savedView = 'grid';
  try { savedView = localStorage.getItem('rvpca-view') || 'grid'; } catch (e) { /* privātais režīms */ }
  setView(savedView === 'list', false);

  toggle.addEventListener('click', function () {
    setTheme(!document.documentElement.classList.contains('dark'), true);
  });

  viewBtn.addEventListener('click', function () {
    setView(!document.body.classList.contains('lp-view-list'), true);
  });

  board.addEventListener('keydown', onArrow);

  /* Matētais stikls tikai tad, kad lapa ir aizritināta. */
  var onScroll = function () {
    topbar.classList.toggle('lp-is-stuck', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Sienas ekrāna režīms: index.html?mode=wallboard — lielāks mērogs,
     bez hroma. Domāts televizoram gaitenī, nevis darbagaldam. */
  if (/[?&]mode=wallboard\b/.test(window.location.search)) {
    document.body.classList.add('lp-wallboard');
  }
})();
