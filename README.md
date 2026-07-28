# RVP CA darbvirsma

Iekšējo tīmekļa lietotņu darbvirsma **Rīgas valstspilsētas pašvaldības Centrālajai
administrācijai**. Lietotnes sakārtotas vizuālās grupās pēc funkcijas. Būvēta uz
**Sintakse** — Rīgas dizaina sistēmas.

Statiska lapa: bez atkarībām, bez būvēšanas soļa un **bez ārējiem
pieprasījumiem**. Atver `index.html` vai publicē mapi jebkurā tīmekļa serverī —
strādā arī slēgtā tīklā.

---

## Dokumentācija

| | Latviski | English |
|---|---|---|
| **Lietotājiem** | [Lietotāja rokasgrāmata](docs/lv/lietotaja-rokasgramata.md) | [User guide](docs/en/user-guide.md) |
| **Lietotnes pievienošana** | [Kā pievienot lietotni](docs/lv/pievienot-lietotni.md) | [Adding an app](docs/en/adding-an-app.md) |
| **Izstrādei** | [Izstrādes dokumentācija](docs/lv/izstrade.md) | [Development guide](docs/en/development.md) |

Vēl: [arhitektūras lēmumi](docs/adr/README.md) ·
[veiktspējas atskaites punkts](docs/perf-baseline.md)

Saskarne ir latviešu valodā. Dokumentācija ir abās valodās.

## Ātrais sākums

```bash
npm run serve             # → http://127.0.0.1:8000
```

Saturu maina vienā failā — [`config/apps.js`](config/apps.js). Ja neesi
izstrādātājs, sāc ar [Kā pievienot lietotni](docs/lv/pievienot-lietotni.md).

## Testi

Pati lapa ir bez atkarībām; `package.json` ir tikai testiem.

```bash
npm ci && npx playwright install chromium
npm test                  # Playwright: attēlošana, pieejamība, konfigurācija
npm run check:external    # neviena ārēja atsauce avota failos
```

## Uzbūve

```
index.html          lapas karkass
boot.js             fontu priekšielāde + tēma pirms pirmās zīmēšanas
config/apps.js      saturs: grupas un lietotnes
app.js              attēlošana, tēmas un skata slēdži, tastatūra
launchpad.css       bento režģis, flīzes, saraksta skats, kājene
brand/              Sintakse dizaina sistēma + fonti
vendor/             daisyUI + Tailwind CSS, lokāli
test/               Playwright testi
tools/              statiskās pārbaudes
deploy/             servera konfigurācijas paraugi (IIS / nginx / Apache)
docs/               dokumentācija (lv / en), ADR, veiktspēja
```

## Skati

| Skats | Kā nokļūt |
|---|---|
| Režģis | noklusējums |
| Saraksts | poga augšējā joslā |
| Sienas ekrāns | `index.html?mode=wallboard` |

## Tehnoloģijas

Tailwind CSS 4 · daisyUI 5 · Sintakse dizaina sistēma · Font Awesome 7 Pro ·
Gilroy + Google Sans · vanilla JavaScript. Viss tiek pasniegts no šīs pašas
mapes — lapa neveic nevienu ārēju pieprasījumu.

> `brand/` ir nokopēts no dizaina sistēmas komplekta ar **vienu** apzinātu
> izmaiņu — sk. [ADR 0001](docs/adr/0001-patched-brand-font-import.md).
> Visām projekta CSS klasēm ir priedēklis `lp-` — sk.
> [ADR 0002](docs/adr/0002-lp-class-namespace.md).

## Publicēšana

Kopē `index.html`, `boot.js`, `app.js`, `launchpad.css`, `config/`, `brand/`, `vendor/`
un izvēlēto konfigurāciju no [`deploy/`](deploy/README.md).
Nekas nav jābūvē.

> **Ja lapa uzzīmējas, bet lietotņu karšu nav:** serveris visdrīzāk atdod `.js`
> ar nepareizu MIME tipu. Sk. [`deploy/`](deploy/README.md).

## Pirms publicēšanas

Sešām sistēmām konfigurācijā vēl ir vietturis `url: '#'`. Aizvieto tos ar īstajām
adresēm — pilns saraksts ir izstrādes dokumentācijas pārbaudes sarakstā.

---

Izveidots ar [Claude](https://claude.ai/code).
