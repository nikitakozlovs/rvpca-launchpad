# Rīgas darbvirsma — izstrādes dokumentācija

English version: [`docs/en/development.md`](../en/development.md)

---

## Kas tas ir

Statiska lapa bez atkarībām un **bez būvēšanas soļa**. Nav `npm install`, nav
`npm run build`. Trīs autordarba faili (`index.html`, `launchpad.css`, `app.js`),
viens konfigurācijas fails un `brand/` mape ar dizaina sistēmu.

## Kā palaist

Divi ceļi, abi der:

```bash
# 1. Statisks serveris (ieteicams — tuvāk publicētajai videi)
python3 -m http.server 8000
# → http://127.0.0.1:8000

# 2. Tieši no faila
xdg-open index.html
```

Otrais strādā tāpēc, ka konfigurācija tiek ielādēta ar `<script>` tagu, nevis
`fetch()`. Tas ir apzināti: `fetch('apps.json')` no `file://` protokola tiek
bloķēts, un tas piespiestu turēt serveri arī tur, kur tas nav vajadzīgs.

## Failu izkārtojums

```
index.html          lapas karkass, CDN tagi noteiktajā secībā
config/apps.js      SATURS — vienīgais fails, ko parasti maina
app.js              attēlošana, filtrs, tēmas slēdzis
launchpad.css       bento režģis un flīzes
brand/              dizaina sistēma, pārņemta bez izmaiņām
docs/               šī dokumentācija
```

## `config/apps.js`

Fails piešķir `window.RVPCA_LAUNCHPAD`. Konvencija pārņemta no pašas dizaina
sistēmas datu failiem (`assets/app-icons/systems-data.js` → `window.RIGA_SYSTEMS`).

### Saknes lauki

| Lauks | Tips | Apraksts |
|---|---|---|
| `title` | teksts | Lapas virsraksts; nonāk arī `<title>` tagā |
| `lead` | teksts | Viena rinda zem virsraksta |
| `groups` | masīvs | Grupas norādītajā secībā |

### Grupas lauki

| Lauks | Tips | Apraksts |
|---|---|---|
| `id` | teksts | Iekšējs identifikators |
| `title` | teksts | Grupas nosaukums. Ja tukšs → `Bez nosaukuma` |
| `icon` | teksts | Font Awesome ikona blakus nosaukumam, piem. `fa-users`. Neobligāta |
| `span` | `narrow` \| `wide` \| `full` | Cik platu grupa aizņem ārējo režģi |
| `apps` | masīvs | Lietotnes. Ja tukšs, grupa netiek zīmēta vispār |

### Lietotnes lauki

| Lauks | Tips | Apraksts |
|---|---|---|
| `id` | teksts | Iekšējs identifikators |
| `title` | teksts | **Obligāts.** Ja tukšs, tiek ņemts `id`; ja arī tā nav — flīze tiek izlaista |
| `desc` | teksts | Viena rinda. Neobligāta |
| `url` | teksts | Adrese. Ja tukša, flīze netiek padarīta par saiti |
| `size` | `sm` \| `md` \| `lg` | Flīzes platums. Noklusējums `md` |
| `status` | `pieejama` \| `izstrade` | Noklusējums `pieejama` |
| `mark` | ceļš | Zīmēts produkta marķējums |
| `markMuted` | ceļš | Vienkrāsainā versija, ko lieto `izstrade` stāvoklī |
| `mono` | divi burti | Plakanā monogramma, ja `mark` nav |
| `family` | toņu saime | Monogrammas krāsojums |

## Divi ikonu režīmi

Dizaina sistēmai ir divi monogrammu režīmi, un darbvirsma izmanto abus.

**1. Sakrautais — produktu marķējums.** Sešām nosauktajām sistēmām marķējumi jau
ir uzzīmēti un eksportēti. Norādi ceļu `mark` laukā:

```js
mark:      'brand/assets/app-icons/exports/sagade-colored.svg',
markMuted: 'brand/assets/app-icons/exports/sagade-mono.svg'
```

Eksporti ir pašpietiekami: 90×90 `viewBox`, trīs pārbīdīti kvadrāti, monogramma
jau pārvērsta vektoru ceļos — fonts nav vajadzīgs.

**2. Plakanais — visas pārējās lietotnes.** Nenorādi `mark`; norādi `mono` un
`family`:

```js
mono: 'Bu',
family: 'Blues'
```

Pieejamās saimes un to toņi (`fill` / `ink`):

| `family` | Laukums | Tinte |
|---|---|---|
| `Blues` | `#254CD4` | `#AAD0FF` |
| `Greens` | `#0D382C` | `#E2FF86` |
| `Reds` | `#FF4833` | `#43010B` |
| `Alt Blue` | `#000B40` | `#BEAFEC` |
| `Grays` | `#565947` | `#FFFFFF` |

Ja nav ne `mark`, ne `mono`, monogramma tiek atvasināta no nosaukuma pirmajiem
diviem burtiem un krāsota smilšu pelēkā. Tāpēc bojāts ieraksts nekad nenogāž
lapu — tas tikai izskatās neitrāls.

## Grupu ikonas

Grupu virsraksti lieto **Font Awesome Pro Light** — dizaina sistēmas funkcionālo
ikonu vārdnīcu. Pilnais Pro komplekts ir novietots lokāli mapē
`brand/fonts/fontawesome/`, bez Kit skripta un bez domēnu atļauju saraksta.

```js
{ id: 'cilveki', title: 'Cilvēki', icon: 'fa-users', span: 'wide', apps: [ … ] }
```

Priedēklis `fa-` nav obligāts (der gan `users`, gan `fa-users`). Light stils tiek
pielikts automātiski — `fa-light` vērtībā rakstīt nevajag.

Kā pārbaudīt, vai nosaukums eksistē:

```bash
grep -c '\.fa-users {' brand/fonts/fontawesome/css/fontawesome.css   # 1 = ir
```

Ņem vērā: atslēgu glifi mapē `brand/assets/` šeit **netiek** lietoti. Dizaina
sistēma tos atvēl tikai ornamentam, bet funkcionālās ikonas — Font Awesome.

## Izstrādes stāvoklis

```js
{ id: 'budzets', title: 'Budžets', url: '#', mono: 'Bu', family: 'Blues', status: 'izstrade' }
```

Ko `status: 'izstrade'` maina:

- Flīze tiek zīmēta kā `<div role="link" aria-disabled="true" tabindex="0">`, nevis
  `<a>`. **Nav `href`**, tāpēc nav arī tukša klikšķa — bet flīze paliek
  sasniedzama ar `Tab` un rāda fokusa gredzenu.
- Parādās nozīmīte `IZSTRĀDĒ`, un `aria-describedby` to sasaista ar flīzi, lai
  ekrānlasītājs to nolasa.
- Ja ir norādīts `markMuted`, tiek lietota tā vietā `mark`.
- Apmale kļūst pārtraukta, teksts klusināts.
- Filtrā šādas lietotnes atrodamas tāpat kā visas pārējās.

## Režģis

Ārējais režģis ir 12 kolonnas; grupas aizņem `narrow` 4, `wide` 6, `full` 12.
Iekšējais režģis vienmēr ir **6 kolonnas**, neatkarīgi no grupas platuma, tāpēc
flīžu izmēri ir paredzami: `sm` 2, `md` 3, `lg` 6.

| Platums | Ārējais režģis | Flīzes |
|---|---|---|
| ≥ 1200px | 12 kolonnas | `sm` 2, `md` 3, `lg` 6 |
| 768–1199px | 6 kolonnas, visas grupas pilnā platumā | tāpat |
| 560–767px | 6 kolonnas | `sm` 3, `md`/`lg` 6 |
| < 560px | 1 kolonna | viss vienā kolonnā |

Lai siena būtu sablīvēta, nevis robaina, izmēri grupā ir jāsummē līdz veselām
rindām (6, 12, …). Piemēram, `lg` + `lg`, vai `md` + `md` + `lg`, vai
`lg` + `sm` + `sm` + `sm`. Režģim ir ieslēgts `grid-auto-flow: dense`, kas
aizpilda caurumus, ja vēlāk sarakstā ir kaut kas mazāks.

Blīvums ir responsīvais slēdzis: virs 1024px lapa lieto dizaina sistēmas `.airy`
vērtības, zem tā — komfortablo noklusējumu. Tas ir viens mediju vaicājums, nevis
atsevišķs mobilais CSS.

## `brand/` ir pārņemts, nevis rakstīts

Viss mapē `brand/` ir nokopēts no dizaina sistēmas komplekta **bez izmaiņām**.

**Nelabo neko turpat.** Kad dizaina sistēma tiek atjaunināta, pārkopē failus
no jauna. Ja kaut kas ir jāpārraksta, dari to `launchpad.css` failā — tas
ielādējas pēc `brand/styles.css`.

Iekļauts: `styles.css`, `colors_and_type.css`, `daisyui-theme.css`, Gilroy,
Font Awesome, produktu marķējumu eksporti, rakstu flīzes, 14 atslēgu glifi.

Nav iekļauts: komplekta `uploads/`, `_ds_bundle.js`, `components/`, `ui_kits/`.
Dizaina sistēma pati norāda, ka tās JSX ir "cosmetic, not production-ready" un ka
produkcijas kods jāraksta pret markām.

## Zīmola noteikumi jaunām sastāvdaļām

Šie nāk no `brand/README.md` sadaļas *Visual foundations* un ir jāievēro visam,
kas tiek pielikts klāt:

- Asi rādiusi: `--r-2` (4px) noklusējums, `--r-3` (8px) lielākajiem paneļiem.
  Pilns noapaļojums (`--r-pill`) **tikai** statusa nozīmītēm un filtru čipiem.
- Kartes ir **ar apmali, nevis ar ēnu**. Ēnas tikai peldošai saskarnei — izvēlnēm,
  paziņojumiem, modālajiem logiem.
- 1px matlīnijas uz `var(--line)`.
- Plakani laukumi. **Nekādu gradientu uz hroma.**
- Viens akcents uz virsmas. Rudzupuķu zilais ir darbības krāsa; dakstiņu sarkanais
  paliek rezervēts iznīcinošām darbībām un kļūdām.
- Hover: apmale kļūst dziļāka uz `--line-strong` plus 2px pacēlums. **Nekad
  caurspīdība.** Ietin `@media (hover: hover)`, lai skārienekrānos flīzes
  nepaliek iestrēgušas.
- Fokusa gredzenu **nekad nenoņem**.
- Kustība atturīga: `--ease-out`, 220ms, tikai izgaišana un mazas nobīdes.
- Atslēgu glifi ir **tikai ornaments**, nekad funkcionāla ikona — tam ir
  Font Awesome.
- Saskarnes teksts latviski, ar pareizu diakritiku. Teikuma reģistrs, nevis
  Lielie Sākumburti. Bez izsaukuma zīmēm. Bez emocijzīmēm hromā.

## Tumšais režīms

Dizaina sistēmai ir **divi** slāņi, un abi ir jāpārslēdz vienlaikus:

```js
document.documentElement.classList.toggle('dark', dark);        // semantiskās markas
document.documentElement.dataset.theme = 'sintakse-dark';       // DaisyUI mainīgie
```

Tas pats princips attiecas uz krāsu variantiem: `.theme-red` iet kopā ar
`data-theme="sintakse-red"`.

## Pārbaude pirms publicēšanas

- [ ] Visi `url` lauki norāda uz īstām adresēm, nevis `#`
- [ ] Lapa atveras gan no servera, gan no `file://`
- [ ] Konsolē nav kļūdu
- [ ] Nav horizontālas ritināšanas nevienā platumā no 1440px līdz 360px
- [ ] Tumšais režīms pārkrāso visu; nekur nav iekodētu heksadecimālo vērtību
- [ ] `Tab` iet cauri visām flīzēm un fokusa gredzens ir redzams
- [ ] `IZSTRĀDĒ` flīzes neatveras ne ar klikšķi, ne ar `Enter`

## Zināmās atkarības no tīkla

Lapa ielādē trīs lietas no ārpuses:

| Resurss | Avots |
|---|---|
| daisyUI 5 | `cdn.jsdelivr.net` |
| Tailwind CSS 4 (pārlūka būvējums) | `cdn.jsdelivr.net` |
| Google Sans / Google Sans Code | `fonts.googleapis.com` |

Tā ir dizaina sistēmas noteiktā pieeja ("CDN, no build step"). Gilroy un
Font Awesome jau ir novietoti lokāli mapē `brand/`.

Ja darbvirsmai jāstrādā slēgtā tīklā vai bez interneta, šos trīs var novietot
lokāli blakus pārējiem `brand/` failiem un nomainīt ceļus `index.html` sākumā.
Pārējais kods nemainās.
