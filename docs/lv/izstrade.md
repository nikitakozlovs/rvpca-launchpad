# RVP CA darbvirsma — izstrādes dokumentācija

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
index.html          lapas karkass
config/apps.js      SATURS — vienīgais fails, ko parasti maina
app.js              attēlošana, tēmas slēdzis
launchpad.css       bento režģis, flīzes, kājene
brand/              dizaina sistēma, pārņemta (viena labota rinda, sk. zemāk)
vendor/             daisyUI + Tailwind, lokāli
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

Viss mapē `brand/` ir nokopēts no dizaina sistēmas komplekta praktiski bez
izmaiņām — ar tieši vienu apzinātu, atzīmētu izņēmumu, kas aprakstīts zemāk.

**Nelabo neko turpat.** Kad dizaina sistēma tiek atjaunināta, pārkopē failus
no jauna. Ja kaut kas ir jāpārraksta, dari to `launchpad.css` failā — tas
ielādējas pēc `brand/styles.css`.

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

Iekļauts: `styles.css`, `colors_and_type.css`, `daisyui-theme.css`, Gilroy,
Font Awesome, produktu marķējumu eksporti, rakstu flīzes, 14 atslēgu glifi.
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

- [ ] Visi `url` lauki norāda uz īstām adresēm, nevis `#`
- [ ] Lapa atveras gan no servera, gan no `file://`
- [ ] Konsolē nav kļūdu
- [ ] **Nav ārējo pieprasījumu** — palaid sargu no augšas; rezultātam jābūt nullei
- [ ] Nav horizontālas ritināšanas nevienā platumā no 1440px līdz 360px
- [ ] Tumšais režīms pārkrāso visu; nekur nav iekodētu heksadecimālo vērtību
- [ ] `Tab` iet cauri visām flīzēm un fokusa gredzens ir redzams
- [ ] `IZSTRĀDĒ` flīzes neatveras ne ar klikšķi, ne ar `Enter`

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
