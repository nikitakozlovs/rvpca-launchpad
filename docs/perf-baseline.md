# Veiktspējas atskaites punkts · Performance baseline

Šis ir mērījumu ieraksts, nevis rokasgrāmata — tāpēc viens fails abām valodām.
Tabulas ir skaitļi; teksts ir īss.

*A measurement record rather than a guide, so it is not split by language.*

---

## Kā mērīts · How it was measured

```bash
npm run serve                       # → http://127.0.0.1:8000
npx lighthouse http://127.0.0.1:8000/index.html \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless=new"
```

Lighthouse noklusējuma iestatījumi: mobilā ierīce, simulēts lēns 4G, 4× CPU
bremzēšana. Skaitļi lokālā tīklā ir daudz labāki — jēga ir salīdzināt ar šo
punktu, nevis ar pārlūku uz izstrādātāja datora.

| Datums | Versija |
|---|---|
| 2026-07-25 | pirmais mērījums pēc lietotņu kartes pārbūves |

## Rezultāti · Scores

| Kategorija | Vērtējums |
|---|---|
| Performance | **56** |
| Accessibility | **100** |
| Best practices | **100** |
| SEO | **100** |

| Metrika | Vērtība |
|---|---|
| First Contentful Paint | 9,8 s |
| Largest Contentful Paint | 12,5 s |
| Speed Index | 9,8 s |
| Time to Interactive | 12,7 s |
| Total Blocking Time | 50 ms |
| Cumulative Layout Shift | **0** |
| Kopējais svars | 2 134 KiB |

## Ko šie skaitļi nozīmē

Pieejamība, labā prakse un SEO ir 100. Izkārtojums nekustas (CLS 0), un lapa
neaizņem procesoru (TBT 50 ms). Vienīgā problēma ir **lejupielādes svars**.

Lielākie resursi:

| Fails | Izmērs |
|---|---|
| `vendor/daisyui.css` | 1 069 KiB |
| `brand/fonts/fontawesome/webfonts/fa-light-300.woff2` | 369 KiB |
| `vendor/tailwindcss-browser.js` | 276 KiB |
| `brand/fonts/fontawesome/css/fontawesome.css` | 200 KiB |

Lighthouse novērtējums: **1 188 KiB neizmantota CSS** — aptuveni 6,3 sekundes no
9,8 sekunžu FCP. Lapa izmanto dažus daisyUI komponentus un ap 15 Font Awesome
ikonu; abi komplekti tiek piegādāti pilnībā.

## Kāpēc tas tā ir atstāts

Dizaina sistēma nosaka "Tailwind CSS + DaisyUI (CDN, no build step)", un
darbvirsma šo prasību pilda: nav būvēšanas soļa, nav atkarību, fails atveras
tieši no diska. Svars ir šīs izvēles cena.

Trīs risinājumi, no lētākā uz dārgāko:

1. **Apgriezt Font Awesome** līdz tām ikonām, kas tiešām tiek lietotas
   (~15 no 4887). Ietaupa ~500 KiB. Neskar būvēšanas soļa neesamību — apgriezto
   komplektu var sagatavot vienreiz un iekļaut `brand/` mapē.
2. **Apgriezt daisyUI** līdz izmantotajiem komponentiem. Ietaupa ~1 000 KiB.
   Tas pats princips.
3. **Iepriekš sabūvēt Tailwind CSS.** Lielākais ieguvums, bet atsakās no
   "bez būvēšanas soļa" īpašības, ko nosaka dizaina sistēma. Šī ir arhitektūras
   izvēle, nevis uzlabojums — to izlemj pasūtītājs.

Iekšējam rīkam pašvaldības tīklā 2 MB var būt pilnīgi pieņemami: lapu atver
reizi dienā, un tālāk tā nāk no keša. Skaitlis te ir tāpēc, lai izvēle būtu
apzināta, nevis nejauša.

## Kad pārmērīt

- Pēc `vendor/` atjaunināšanas
- Pēc jaunu fontu vai ikonu komplektu pievienošanas
- Pirms publicēšanas ražošanas vidē

Ja Performance nokrītas zem 50 vai kopējais svars pārsniedz 2 500 KiB, tas ir
regress — meklē, kas tika pievienots.
