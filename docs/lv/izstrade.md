# RVP CA darbvirsma — izstrādes dokumentācija

English version: [`docs/en/development.md`](../en/development.md)

---

## Kas tas ir

Statiska lapa **bez izpildlaika atkarībām un bez būvēšanas soļa**. Četri
autordarba faili (`index.html`, `boot.js`, `launchpad.css`, `app.js`), viens
konfigurācijas fails, dizaina sistēma mapē `brand/` un divas trešo pušu
bibliotēkas mapē `vendor/`.

`package.json` repozitorijā ir, bet **tikai testiem**. Publicēšanai neko nevajag
būvēt: mape ar failiem ir gatavā lapa.

## Kā palaist

Divi ceļi, abi der:

```bash
# 1. Statisks serveris (ieteicams — tuvāk publicētajai videi)
npm run serve            # jeb: python3 -m http.server 8000 --bind 127.0.0.1
# → http://127.0.0.1:8000

# 2. Tieši no faila
xdg-open index.html
```

Otrais strādā tāpēc, ka konfigurācija tiek ielādēta ar `<script>` tagu, nevis
`fetch()`. Tas ir apzināti: `fetch('apps.json')` no `file://` protokola tiek
bloķēts, un tas piespiestu turēt serveri arī tur, kur tas nav vajadzīgs.

## Failu izkārtojums

```
index.html          lapas karkass
boot.js             fontu priekšielāde + tēma pirms pirmās zīmēšanas
config/apps.js      SATURS — vienīgais fails, ko parasti maina
app.js              attēlošana, tēmas un skata slēdži, tastatūra
launchpad.css       bento režģis, flīzes, saraksta skats, kājene
brand/              dizaina sistēma, pārņemta (viena labota rinda — ADR 0001)
vendor/             daisyUI + Tailwind, lokāli
test/               Playwright testi
tools/              statiskās pārbaudes
docs/adr/           arhitektūras lēmumi
docs/perf-baseline.md   veiktspējas atskaites punkts
docs/               šī dokumentācija
```

## `config/apps.js`

Fails piešķir `window.RVPCA_LAUNCHPAD`. Konvencija pārņemta no pašas dizaina
sistēmas datu failiem (`assets/app-icons/systems-data.js` → `window.RIGA_SYSTEMS`).

### Saknes lauki

| Lauks | Tips | Apraksts |
|---|---|---|
| `title` | teksts | Nonāk `<title>` tagā un vizuāli slēptajā `<h1>` |
| `groups` | masīvs | Grupas norādītajā secībā |

### Grupas lauki

| Lauks | Tips | Apraksts |
|---|---|---|
| `id` | teksts | Iekšējs identifikators; vienlaikus enkurs (`#iepirkumi`) |
| `title` | teksts | Grupas nosaukums. Ja tukšs → `Bez nosaukuma` |
| `icon` | teksts | Font Awesome ikona blakus nosaukumam, piem. `fa-users`. Neobligāta |
| `span` | `narrow` \| `wide` \| `full` | Cik platu grupa aizņem ārējo režģi |
| `order` | skaitlis | Grupu kārtība. Bez tā paliek konfigurācijas secība |
| `apps` | masīvs | Lietotnes. Ja tukšs, grupa netiek zīmēta vispār |

### Lietotnes lauki

| Lauks | Tips | Apraksts |
|---|---|---|
| `id` | teksts | Iekšējs identifikators |
| `title` | teksts | **Obligāts.** Ja tukšs, tiek ņemts `id`; ja arī tā nav — flīze tiek izlaista |
| `desc` | teksts | Viena rinda. Neobligāta |
| `url` | teksts | Adrese. Ja tukša, flīze netiek padarīta par saiti |
| `size` | `sm` \| `md` \| `lg` | Flīzes platums. Noklusējums `md` |
| `order` | skaitlis | Kārtība grupā. Bez tā paliek konfigurācijas secība |
| `status` | `pieejama` \| `izstrade` | Noklusējums `pieejama` |
| `env` | `test` \| `demo` | Vides nozīmīte. Ražošanas vide netiek atzīmēta |
| `added` | `YYYY-MM-DD` | 30 dienas rāda nozīmīti "Jauns", tad tā pazūd pati |
| `owner` | teksts | Atbildīgā nodaļa vai cilvēks |
| `contact` | e-pasts | Kļūst par `mailto:` saiti flīzē |
| `accessUrl` | adrese | Saite "Piekļuve" piekļuves pieprasīšanai |
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

## Skati un režīmi

**Režģis** (noklusējums) — bento siena.
**Saraksts** — blīvas rindas, pogas augšējā joslā. Izvēle tiek atcerēta
`localStorage` atslēgā `rvpca-view`. Blīvumu dod dizaina sistēmas `.dense`
vērtības, nevis atsevišķs izmēru komplekts.

**Sienas ekrāns** — `index.html?mode=wallboard`. Lielāks mērogs, bez pogām,
kājenes un sekundārajām saitēm. Vārdzīme paliek un tiek palielināta: kopš lapas
galva ir noņemta, tā ir vienīgais, kas nosauc ekrānu. Domāts televizoram
gaitenī; kioska režīmā adrese ar parametru ir viss, kas jāiestata.

### Saglabātais stāvoklis

`localStorage` tiek turētas tikai divas atslēgas, un abas ir tikai izskata
izvēles — nekādu lietotņu datu, nekādu personas datu:

| Atslēga | Vērtības |
|---|---|
| `rvpca-theme` | `light` \| `dark` |
| `rvpca-view` | `grid` \| `list` |

Tēma tiek atjaunota `index.html` sākumā, pirms pirmās zīmēšanas, lai tumšā
režīma lietotājam neuzplaiksnī gaišā lapa. Privātajā režīmā, kur `localStorage`
met kļūdu, abi slēdži strādā — tikai izvēle netiek atcerēta.

Lapai nav atsevišķas galvas ar lielu virsrakstu. Augšējā josla jau nosauc
darbvirsmu, tāpēc atkārtojums tikai aizņēma vietu. `<h1>` dokumentā ir, bet
`sr-only` — bez tā grupu `<h2>` paliktu bez virslīmeņa un ekrānlasītāja
lietotājs zaudētu orientieri. Virsrakstu hierarhiju pārbauda tests.

## Tastatūra

`Tab` iet cauri **visām** flīzēm parastajā secībā. Bultiņas ir papildinājums:
pa kreisi un pa labi pēc secības, augšup un lejup ģeometriski, `Home` un `End`
uz malām.

Apzināta atkāpe: bieži lietotais paņēmiens ir *roving tabindex*, kur režģī ir
tikai viena tabulējama flīze un pārējās sasniedz tikai ar bultiņām. Tas ir
pareizi saliktam vadīklu blokam, bet šī lapa ir dokuments ar saitēm, un tāda
izvēle atņemtu `Tab` pieeju astoņām no deviņām lietotnēm ikvienam, kas šo
paņēmienu nezina. Tāpēc bultiņas te tikai pievieno, neko neatņemot.

## Pieejamība

`npm test` ietver axe-core pārbaudi trijos stāvokļos (gaišais, tumšais,
saraksta skats), pieejamības koka pārbaudi un kontrasta mērījumus.

**Automātiskā pārbaude atrod aptuveni trešdaļu problēmu.** Tā neaizstāj
pārbaudi ar īstu ekrānlasītāju (NVDA, VoiceOver) — īpaši izstrādē esošo flīžu
gadījumā, kur `role="link"` un `aria-disabled` kombinācija dažādos lasītājos
skan atšķirīgi. Pirms publicēšanas ražošanas vidē to vajadzētu izdarīt cilvēkam.

Kas jau ir ievērots:

- Flīzes nosaukums ir saites pieejamais nosaukums; apraksts un nozīmītes
  piesaistītas caur `aria-describedby`
- Izstrādē esošā flīze nolasās kā `link [disabled]`
- Fokusa gredzens tiek zīmēts ap visu karti, nevis ap tekstu
- Tēmas un skata maiņa tiek paziņota `aria-live` apgabalā
- `prefers-contrast: more` pastiprina matlīnijas un noņem klusinātos toņus
- `prefers-reduced-motion: reduce` noņem pacēlumus un pārejas

Etiķetēs nosaukums vienmēr stāv aiz kola un paliek nominatīvā — latviešu
locījumu no patvaļīga nosaukuma ģenerēt nevar, un "Atvērt Sagāde jaunā cilnē"
būtu gramatiski nepareizi.

## Publicēšana

Darbvirsma ir statiski faili, tāpēc publicēšana nozīmē tos nokopēt. Nekas nav
jābūvē.

Kopē: `index.html`, `boot.js`, `app.js`, `launchpad.css`, `config/`, `brand/`, `vendor/`.
Nekopē: `test/`, `tools/`, `docs/`, `deploy/`, `node_modules/`, `package.json`,
`playwright.config.mjs`, `.github/`.

### Viens iestatījums, kas lapu salauž klusi

Ja serveris `.js` failus atdod ar nepareizu MIME tipu (`text/plain`,
`application/octet-stream`) **un** sūta `X-Content-Type-Options: nosniff`,
pārlūks **atsakās izpildīt skriptus**. Lapa uzzīmējas — josla, kājene, krāsas,
fonti — bet lietotņu kartes neparādās nekad. Serveris atbild 200, tāpēc tīkla
kļūdu nav; klusē arī konsole, ja tajā neieskatās.

Tas pats notiek, ja `app.js` vienkārši nav nokopēts.

Tieši šo gadījumu sedz rezerves paziņojums lapā: `app.js` pirmajā rindā uzliek
`<body>` klasi `lp-ready`, un CSS tikai tad paslēpj `.lp-boot` bloku. Ja skripti
neizpildās, lietotājs redz paskaidrojumu, nevis tukšumu.

### Pārbaude pēc publicēšanas

```bash
curl -sI https://darbvirsma.riga.lv/app.js         | grep -i 'HTTP\|content-type'
curl -sI https://darbvirsma.riga.lv/config/apps.js | grep -i 'HTTP\|content-type'
```

Abiem jāatbild `200` un `content-type: text/javascript`.

Gatavas servera konfigurācijas — IIS, nginx, Apache — ir mapē
[`deploy/`](../../deploy/README.md).

## Drošība

Darbvirsma ir statiska lapa bez servera puses, bez autentifikācijas un bez
lietotāju datiem. Uzbrukuma virsma ir maza, bet ne tukša.

### Konfigurācija ir nedroša ievade

`config/apps.js` rediģē cilvēks, un [Kā pievienot lietotni](pievienot-lietotni.md)
aicina to darīt arī tiem, kas nav izstrādātāji. Tāpēc kods to **neuzskata par
uzticamu**:

| Lauks | Pārbaude |
|---|---|
| `url`, `accessUrl` | Tikai `http`, `https`, `mailto`, `tel`. Relatīvie ceļi un fragmenti iet cauri |
| `contact` | Par saiti kļūst tikai tad, ja tā tiešām ir e-pasta adrese |
| `mark`, `markMuted` | Tikai ceļi no šīs pašas mapes — nekādu shēmu, nekādu `//` |
| `icon` | Tikai `[a-z0-9-]`, priedēklis `fa-` uzlikts pašu spēkiem |

Bez šīm pārbaudēm ikviens, kas drīkst papildināt lietotņu sarakstu, varētu
ielikt `javascript:` adresi un izpildīt kodu **katra darbinieka pārlūkā**.
Sarakstā ir saites uz iekšējām sistēmām, tāpēc tāda adrese derētu arī
pieteikšanās datu izkrāpšanai.

Viss teksts DOM nonāk caur `textContent`. Failā nav ne `innerHTML`, ne `eval`,
ne `document.write`.

### Drošības galvenes

`deploy/` konfigurācijas uzstāda:

| Galvene | Vērtība | Kāpēc |
|---|---|---|
| `Content-Security-Policy` | sk. zemāk | Otrā aizsardzības līnija pret XSS |
| `X-Frame-Options` | `DENY` | Darbvirsmu nevar ielikt rāmī un uzlikt virsū citu saskarni |
| `X-Content-Type-Options` | `nosniff` | Sk. "Publicēšana" |
| `Referrer-Policy` | `no-referrer` | Iekšējo sistēmu adreses nenoplūst uz ārpusi |
| `Strict-Transport-Security` | 1 gads | |
| `Permissions-Policy` | viss izslēgts | Lapai nevajag ne kameru, ne atrašanās vietu |

Politika:

```
default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; font-src 'self'; connect-src 'none';
base-uri 'none'; form-action 'none'; frame-ancestors 'none'; object-src 'none'
```

**`script-src` ir bez `'unsafe-inline'`, un tā tam jāpaliek.** Tieši tāpēc
`boot.js` ir atsevišķs fails, nevis `<script>` bloks `index.html` iekšpusē.
Tests pārbauda, ka lapā nav neviena inline skripta.

`style-src` patur `'unsafe-inline'`, jo Tailwind pārlūka būvējums stilus
pievieno izpildes laikā. Lapa izskatās tāpat arī bez tā — viss vajadzīgais ir
`launchpad.css` — bet jebkura vēlāk pievienota Tailwind utilītklase klusi
nenostrādātu. Ja Tailwind utilītas netiek lietotas, `'unsafe-inline'` var
noņemt. Izkārtojums no tā necieš: `style.setProperty` ir CSSOM, ko CSP neierobežo.

### Kas tiek pārbaudīts automātiski

`test/security.spec.mjs` — katrs tests atbilst uzbrukumam, kas pirms labojuma
tiešām izpildījās:

- `javascript:`, `data:` un ar tabulāciju noslēptas adreses netiek izpildītas
- `mark` nevar ievilkt ārēju resursu
- `icon` nevar pievienot svešas klases
- `target="_blank"` vienmēr ar `rel="noopener"`
- lapā nav inline skriptu
- lapa strādā ar to pašu stingro CSP, kas ir `deploy/` konfigurācijās

### Kas paliek ārpus koda

- **Piekļuves kontrole.** Darbvirsma nevienu neautentificē. Ja saraksts nav
  domāts visiem, to ierobežo serveris vai tīkls.
- **Repozitorija piekļuve.** Kas drīkst rediģēt `config/apps.js`, tas nosaka
  saites uz iekšējām sistēmām. Adrešu pārbaudes neļauj izpildīt kodu, bet
  neliedz norādīt uz nepareizu vietni — piekļuves tiesības ir īstā robeža.
- **`vendor/` izcelsme.** daisyUI un Tailwind ir nokopēti no npm. Versijas ir
  pierakstītas `vendor/README.md`, bet kontrolsummas nav — atjauninot der
  pārliecināties, ka avots ir npm, nevis nejauša kopija.
- **E-pasta adreses konfigurācijā** ir īstas nodaļu adreses. Tas ir apzināti,
  bet ņem vērā, ja repozitorijs kādreiz kļūst publisks.

## Testi

```bash
npm ci                    # tikai testiem; pati lapa ir bez atkarībām
npx playwright install chromium
npm test                  # visi testi
npm run check:external    # ātrā statiskā pārbaude
npm run perf              # Lighthouse (vajag palaistu `npm run serve`)
```

| Fails | Ko pārbauda |
|---|---|
| `test/offline.spec.mjs` | Nulle ārējo pieprasījumu, fonti, `file://` |
| `test/render.spec.mjs` | Grupas, flīzes, nozīmītes, skati, responsivitāte |
| `test/a11y.spec.mjs` | axe-core, pieejamības koks, kontrasts, tastatūra |
| `test/config.spec.mjs` | Bojāta konfigurācija nenogāž lapu |
| `test/security.spec.mjs` | Adrešu pārbaudes, CSP, ārējo saišu higiēna |

Veiktspējas atskaites punkts: [`docs/perf-baseline.md`](../perf-baseline.md).
Arhitektūras lēmumi: [`docs/adr/`](../adr/README.md).

## `brand/` ir pārņemts, nevis rakstīts

Viss mapē `brand/` ir nokopēts no dizaina sistēmas komplekta praktiski bez
izmaiņām — ar tieši vienu apzinātu, atzīmētu izņēmumu, kas aprakstīts zemāk.

**Nelabo neko turpat.** Kad dizaina sistēma tiek atjaunināta, pārkopē failus
no jauna. Ja kaut kas ir jāpārraksta, dari to `launchpad.css` failā — tas
ielādējas pēdējais, pēc visiem marku failiem.

### Pārkopēšana: viena rinda, kas jāatjauno

No komplekta ir tieši **viena** lokāla atkāpe, un pēc katras pārkopēšanas tā ir
jāatjauno — citādi darbvirsma klusi atsāk pieprasīt Google Fonts.

Failā `brand/colors_and_type.css` komplekta 11. rinda ir:

```css
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Google+Sans+Code:wght@400;500&display=swap');
```

Aizvieto to ar:

```css
@import url('fonts/google-sans/google-sans.css');
```

Atkāpe failā ir atzīmēta ar komentāru `⚠ RVPCA LOKĀLĀ IZMAIŅA`. Lai pārliecinātos,
ka nekas cits nav aizgājis pa savu ceļu, salīdzini pārkopēto koku ar komplektu —
šim vienam gabalam jābūt vienīgajai atšķirībai.

Pēc tam pārbaudi ar ārējo pieprasījumu sargu, kas aprakstīts sadaļā
[Nekādu ārējo pieprasījumu](#nekādu-ārējo-pieprasījumu).

Iekļauts: `colors_and_type.css`, `daisyui-theme.css`, Gilroy, Font Awesome,
produktu marķējumu eksporti, rakstu flīzes, 14 atslēgu glifi, unDraw
ilustrācijas. `styles.css` mapē ir, bet netiek ielādēts — sk. ADR 0003.
Mūsu pievienots, nevis no komplekta: `brand/fonts/google-sans/` (sk. zemāk).

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

Lielāko daļu pārbauda testi:

```bash
npm test && npm run check:external
```

Kas jāpārbauda cilvēkam:

- [ ] Visi `url` lauki norāda uz īstām adresēm, nevis `#`
- [ ] Katrai lietotnei ir `owner` un `contact`
- [ ] Lapa atveras gan no servera, gan no `file://`
- [ ] Abi skati un `?mode=wallboard` izskatās pareizi
- [ ] Teksti ir latviski, ar pareizu diakritiku, teikuma reģistrā
- [ ] **Pārbaude ar īstu ekrānlasītāju** (NVDA vai VoiceOver) — to automātika
      neaizstāj
- [ ] Veiktspēja pārmērīta, ja mainīts `vendor/` vai fonti

## Nekādu ārējo pieprasījumu

Lapa neielādē **neko** no interneta. Viss ir novietots lokāli, tāpēc darbvirsma
strādā slēgtā tīklā, bez interneta, un nenoplūdina pieprasījumu datus trešajām
pusēm.

| Resurss | Kur atrodas | Versija |
|---|---|---|
| daisyUI | `vendor/daisyui.css` | 5.7.4 |
| Tailwind CSS (pārlūka būvējums) | `vendor/tailwindcss-browser.js` | 4.3.3 |
| Google Sans / Google Sans Code | `brand/fonts/google-sans/` | caur Fontsource 5.3.0 |
| Gilroy | `brand/fonts/Gilroy-SemiBold.woff` | no komplekta |
| Font Awesome 7 Pro | `brand/fonts/fontawesome/` | no komplekta |

Dizaina sistēma nosaka "Tailwind CSS + DaisyUI (CDN, no build step)". Tie paši
faili, pasniegti lokāli, saglabā gan tehnoloģiju kopumu, gan īpašību "bez
būvēšanas soļa" — mainās tikai izcelsme.

Piegādāti tikai `latin` un `latin-ext` apakškopumi, tikai woff2. `latin-ext` nes
latviešu diakritiku (ā ē ī ū č ģ ķ ļ ņ š ž — visas U+0100–02BA diapazonā), un
katrs `@font-face` deklarē savu `unicode-range`, tāpēc pārlūks lejupielādē tikai
to apakškopumu, kas konkrētajai rakstzīmei vajadzīgs.

Kā atjaunināt daisyUI un Tailwind — sk. `vendor/README.md`.

**Regresijas sargs.** Nejauša CDN atsauce izstrādē paliek nepamanīta (resurss taču
ielādējas), tāpēc to nevis apskata, bet pārbauda: nobloķē visus nelokālos
pieprasījumus un pārliecinās, ka lapa nemainās.

```js
await ctx.route('**/*', route =>
  route.request().url().startsWith('http://127.0.0.1:8899/')
    ? route.continue()
    : route.abort());   // jebkurš ārējs pieprasījums tagad salauž lapu redzami
```

## CSS klašu telpa

Visām šī projekta klasēm ir priedēklis **`lp-`** (`lp-tile`, `lp-group__head`,
`lp-footer`). Tas nav kosmētikas dēļ: daisyUI piegādā komponentus ar nosaukumiem
`.footer`, `.filter`, `.card`, `.badge`, `.status` un daudz citu, un klase bez
priedēkļa klusi manto attiecīgā komponenta izkārtojumu. Gan `.footer`, gan
`.filter` sadūrās, pirms priedēklis tika ieviests.

Divi apzināti izņēmumi:

- `.sr-only` — sakrīt ar Tailwind paša utilītu, kurai ir tāda pati nozīme.
- `.dark` — pieder dizaina sistēmai (`brand/colors_and_type.css`).

Pievienojot klasi, liec priedēkli. Kā pārbaudīt, vai nosaukums ir brīvs:

```bash
grep -c '\.mana-klase' vendor/daisyui.css   # 0 = droši
```

Elementu **ID** priedēkli nesaņem — tie nav daļa no CSS kaskādes un ar stila lapu
sadurties nevar.
