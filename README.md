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
| **Izstrādei** | [Izstrādes dokumentācija](docs/lv/izstrade.md) | [Development guide](docs/en/development.md) |

Saskarne ir latviešu valodā. Dokumentācija ir abās valodās.

## Ātrais sākums

```bash
python3 -m http.server 8000   # → http://127.0.0.1:8000
```

Saturu maina vienā failā — [`config/apps.js`](config/apps.js). Lauku apraksts ir
izstrādes dokumentācijā.

## Uzbūve

```
index.html          lapas karkass
config/apps.js      saturs: grupas un lietotnes
app.js              attēlošana, filtrs, tēmas slēdzis
launchpad.css       bento režģis, flīzes, kājene
brand/              Sintakse dizaina sistēma + fonti
vendor/             daisyUI + Tailwind CSS, lokāli
docs/               dokumentācija (lv / en)
```

## Tehnoloģijas

Tailwind CSS 4 · daisyUI 5 · Sintakse dizaina sistēma · Font Awesome 7 Pro ·
Gilroy + Google Sans · vanilla JavaScript. Viss tiek pasniegts no šīs pašas
mapes — lapa neveic nevienu ārēju pieprasījumu.

> `brand/` ir nokopēts no dizaina sistēmas komplekta ar **vienu** apzinātu
> izmaiņu: fontu imports norāda uz lokālo kopiju, nevis Google Fonts. Pārkopējot
> sistēmu no jauna, šī rinda ir jāatjauno — sk. izstrādes dokumentāciju.

## Pirms publicēšanas

Sešām sistēmām konfigurācijā vēl ir vietturis `url: '#'`. Aizvieto tos ar īstajām
adresēm — pilns saraksts ir izstrādes dokumentācijas pārbaudes sarakstā.

---

Izveidots ar [Claude](https://claude.ai/code).
