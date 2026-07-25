# Rīgas darbvirsma

Iekšējo tīmekļa lietotņu darbvirsma Rīgas valstspilsētas pašvaldībai. Lietotnes
sakārtotas vizuālās grupās pēc funkcijas. Būvēta uz **Sintakse** — Rīgas dizaina
sistēmas.

Statiska lapa: bez atkarībām, bez būvēšanas soļa. Atver `index.html` vai
publicē mapi jebkurā tīmekļa serverī.

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
launchpad.css       bento režģis un flīzes
brand/              Sintakse dizaina sistēma, pārņemta bez izmaiņām
docs/               dokumentācija (lv / en)
```

> `brand/` ir nokopēts no dizaina sistēmas komplekta. To nelabo turpat — kad
> sistēma tiek atjaunināta, failus pārkopē no jauna, bet pārrakstījumus liec
> `launchpad.css` failā.

## Pirms publicēšanas

Sešām sistēmām konfigurācijā vēl ir vietturis `url: '#'`. Aizvieto tos ar īstajām
adresēm — pilns saraksts ir izstrādes dokumentācijas pārbaudes sarakstā.
