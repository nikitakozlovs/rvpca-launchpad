# ADR 0001 — `brand/colors_and_type.css` fontu imports norāda uz lokālo kopiju

**Statuss:** pieņemts · 2026-07-25
**Skar:** `brand/colors_and_type.css`, `brand/fonts/google-sans/`

## Konteksts

Mape `brand/` ir Sintakse dizaina sistēmas komplekts, pārkopēts kā ir. Pamata
noteikums ir vienkāršs: **komplektu nelabo, to pārkopē no jauna**, un visi
pārrakstījumi dzīvo `launchpad.css` failā, kas ielādējas pēc tā.

Komplekta `colors_and_type.css` 11. rindā ir:

```css
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:...');
```

Vienlaikus darbvirsmai ir prasība nesūtīt nevienu ārēju pieprasījumu: tā strādā
slēgtā pašvaldības tīklā, un lietotņu saraksta atvēršana nedrīkst nozīmēt
pieprasījumu uz Google serveriem.

Šīs divas lietas ir pretrunā. CSS `@import` nevar atcelt no cita faila — brīdī,
kad pārlūks izlasa rindu, pieprasījums jau ir ceļā.

## Apsvērtie risinājumi

1. **Atstāt importu.** Vienkāršākais, bet lapa vairs nav neatkarīga no interneta,
   un katrs atvērums nosūta datus trešajai pusei.
2. **Nelādēt `colors_and_type.css` vispār** un pārrakstīt markas pašu spēkiem.
   Tas nozīmētu atkārtot visu marku slāni un zaudēt saikni ar dizaina sistēmu.
3. **Labot vienu rindu komplektā.** Pārkāpj "nelabo komplektu" noteikumu, bet
   izmaiņa ir viena rinda, un to var atzīmēt.

## Lēmums

Izvēlēts 3. variants. Rinda aizvietota ar:

```css
@import url('fonts/google-sans/google-sans.css');
```

Vietā failā ir komentārs ar atzīmi `⚠ RVPCA LOKĀLĀ IZMAIŅA`, kurā saglabāts arī
oriģinālais imports.

Fonti ir `brand/fonts/google-sans/`, ģenerēti no Fontsource pakotnēm — tie paši
Google Fonts izlaidumi, tikai lokāli. Iekļauti `latin` un `latin-ext`
apakškopumi (latviešu diakritika ir `latin-ext`), tikai woff2, katram
`@font-face` saglabāts `unicode-range`.

## Sekas

- Darbvirsma nesūta nevienu ārēju pieprasījumu. To pārbauda gan
  `test/offline.spec.mjs` izpildes laikā, gan `tools/check-external-refs.mjs`
  statiski.
- **Pārkopējot dizaina sistēmu no jauna, šī rinda ir jāatjauno.** Citādi Google
  Fonts imports klusi atgriežas. Soļi ir aprakstīti
  [izstrādes dokumentācijā](../lv/izstrade.md#pārkopēšana-viena-rinda-kas-jāatjauno).
- Ja fonti tiek atjaunināti, `brand/fonts/google-sans/google-sans.css` ir
  jāģenerē no jauna kopā ar failiem.
- Noteikums "komplektu nelabo" paliek spēkā visam pārējam. Šis ir vienīgais
  izņēmums, un tas ir dokumentēts abās vietās.
