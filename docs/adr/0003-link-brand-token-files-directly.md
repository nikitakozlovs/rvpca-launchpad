# ADR 0003 — `index.html` ielādē marku failus tieši, nevis caur `brand/styles.css`

**Statuss:** pieņemts · 2026-07-25
**Skar:** `index.html`
**Saistīts ar:** [ADR 0001](0001-patched-brand-font-import.md)

## Konteksts

Dizaina sistēma piedāvā `brand/styles.css` kā kanonisko ieejas punktu. Tā saturs
ir divas rindas:

```css
@import url('colors_and_type.css');
@import url('daisyui-theme.css');
```

Sākotnēji `index.html` ielādēja tieši šo failu, kā komplekts to iesaka.

Testējot atklājās, ka katrā lapas ielādē serveris saņem divus 404:

```
GET /colors_and_type.css   404
GET /daisyui-theme.css     404
```

Pareizie ceļi (`/brand/colors_and_type.css`) tika pieprasīti arī — tātad lapa
strādāja, un kļūda bija klusa. Cēlonis: Tailwind pārlūka būvējums pats apstaigā
lapas stila lapas un mēģina izšķirt `@import` adreses **pret dokumenta sakni**,
nevis pret to failu, kurā imports atrodas.

Klusums te ir galvenā problēma. Neviens to nepamanītu, un serveris žurnālā
krātu kļūdas par lapu, kas "strādā".

## Kāpēc to nepamanīja testi

`test/offline.spec.mjs` klausījās `requestfailed` notikumu. **404 nav neizdevies
pieprasījums** — tā ir pilnīgi veiksmīga HTTP saruna ar atbildes kodu 404.
Notikums nekad neiedegās.

## Apsvērtie risinājumi

1. **Atstāt kā ir.** Lapa strādā, bet katra ielāde met divas kļūdas serverī un
   divus lieku tīkla ciklus.
2. **Pārrakstīt `brand/styles.css`** ar pilniem ceļiem. Pārkāptu "komplektu
   nelabo" noteikumu vēl vienā vietā, un ADR 0001 izņēmumam vajadzētu palikt
   vienīgajam.
3. **Ielādēt abus marku failus tieši `index.html`.**

## Lēmums

Izvēlēts 3. variants:

```html
<link rel="stylesheet" href="brand/colors_and_type.css">
<link rel="stylesheet" href="brand/daisyui-theme.css">
```

`brand/styles.css` paliek mapē kā komplekta daļa, bet netiek ielādēts.

Papildus tika nostiprināts tests: `test/offline.spec.mjs` tagad klausās arī
atbilžu statusu, nevis tikai neizdevušos pieprasījumus.

```js
page.on('response', r => {
  if (r.status() >= 400) failed.push(`${r.url()} — HTTP ${r.status()}`);
});
```

## Sekas

- Nulle 404 kļūdu. Ielāde ir arī nedaudz ātrāka: `@import` rada ūdenskritumu —
  pārlūks vispirms ielādē `styles.css`, izlasa to, un tikai tad sāk lādēt abus
  īstos failus. Tiešās saites sākas paralēli.
- Ielādes secība, ko nosaka dizaina sistēma, paliek tā pati: daisyUI → Tailwind
  → markas → ikonas → lapas CSS.
- Ja komplekts pievieno `styles.css` failam trešo importu, tas **netiks
  pamanīts automātiski**. Pārkopējot dizaina sistēmu, jāieskatās `styles.css` un
  jāpārliecinās, ka `index.html` ielādē visu, kas tur ir.
- Testi tagad noķer jebkuru 4xx/5xx atbildi, ne tikai neizdevušos pieprasījumu.
