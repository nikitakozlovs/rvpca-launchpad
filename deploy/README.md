# deploy/

Servera konfigurācijas paraugi. Izvēlies vienu, pārējos ignorē — tie nav daļa
no lapas un netiek pasniegti.

| Fails | Serverim |
|---|---|
| `web.config` | IIS |
| `nginx.conf.example` | nginx |
| `.htaccess` | Apache |

## Kāpēc tie vispār vajadzīgi

Darbvirsma ir statiski faili, tāpēc "publicēšana" nozīmē tos nokopēt. Tomēr
viena servera iestatījumu kombinācija lapu salauž klusi:

**Ja `.js` faili tiek atdoti ar nepareizu MIME tipu** (`text/plain`,
`application/octet-stream`) **un serveris sūta `X-Content-Type-Options:
nosniff`, pārlūks atsakās izpildīt skriptus.** Lapa uzzīmējas — josla, kājene,
krāsas, fonti — bet lietotņu kartes nekad neparādās.

Tieši tāpēc lapā ir rezerves paziņojums: ja skripti neizpildās, lietotājs
redz paskaidrojumu, nevis tukšumu.

## Kā pārbaudīt pēc publicēšanas

```bash
curl -sI https://darbvirsma.riga.lv/app.js         | grep -i 'content-type\|HTTP'
curl -sI https://darbvirsma.riga.lv/config/apps.js | grep -i 'content-type\|HTTP'
```

Abiem jāatbild `200` un `content-type: text/javascript`. Ja tur ir
`text/plain` vai `application/octet-stream` — tā ir problēma.

## Ko kopēt

Visu repozitorija saturu, izņemot izstrādes daļu:

```
index.html  boot.js  app.js  launchpad.css  config/  brand/  vendor/
```

Nav jākopē: `test/`, `tools/`, `docs/`, `deploy/`, `node_modules/`,
`package.json`, `playwright.config.mjs`, `.github/`.

Nekas nav jābūvē — mape ar failiem ir gatavā lapa.
