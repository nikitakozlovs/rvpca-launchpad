# ADR 0002 — Visām projekta CSS klasēm priedēklis `lp-`

**Statuss:** pieņemts · 2026-07-25
**Skar:** `launchpad.css`, `index.html`, `app.js`

## Konteksts

Darbvirsma ielādē daisyUI — komponentu bibliotēku, kas definē klases ar
vispārīgiem nosaukumiem: `.card`, `.badge`, `.footer`, `.filter`, `.status`,
`.menu`, `.drawer` un vēl simtiem citu.

Sākotnēji lapas pašas klases bija bez priedēkļa: `.tile`, `.group`, `.footer`,
`.filter`. Divas no tām sadūrās ar daisyUI komponentiem:

- `.footer` — daisyUI komponents pārņēma jaunās kājenes izkārtojumu; saturs
  saspiedās un pārbīdījās. Redzams uzreiz.
- `.filter` — sadūrās **klusi**. Nekas nesalūza pamanāmi, bet mūsu meklēšanas
  lauka konteiners mantoja svešas īpašības.

Klusā sadursme ir bīstamākā daļa: to nepamana ne izstrādātājs, ne tests, un tā
var parādīties vēlāk, kad daisyUI pievieno jaunu komponentu ar mūsu nosaukumu.

## Apsvērtie risinājumi

1. **Pārsaukt tikai divas sadūrušās klases.** Ātrākais, bet problēma atkārtosies
   nākamajā daisyUI atjauninājumā ar citu nosaukumu.
2. **Nelietot daisyUI.** Dizaina sistēma to nosaka; nav mūsu izvēle.
3. **Priedēklis visām projekta klasēm.** Vienreizējs darbs, pēc tam sadursme
   principā nav iespējama.

## Lēmums

Izvēlēts 3. variants. Visas šī projekta klases sākas ar `lp-`
(*launchpad*): `lp-tile`, `lp-group__head`, `lp-footer`, `lp-pill--test`.

Divi apzināti izņēmumi:

- `.sr-only` — sakrīt ar Tailwind paša utilītu, kurai ir tieši tāda pati nozīme.
- `.dark` — pieder dizaina sistēmai (`brand/colors_and_type.css`), nevis mums.

Elementu **ID** priedēkli nesaņem (`#board`, `#theme-toggle`). ID nav daļa no
stila kaskādes un ar stila lapu sadurties nevar.

## Sekas

- Jauna klase vienmēr sākas ar `lp-`. Pārbaude, vai nosaukums ir brīvs:

  ```bash
  grep -c '\.mana-klase' vendor/daisyui.css   # 0 = droši
  ```

- daisyUI atjauninājums vairs nevar klusi pārņemt mūsu izkārtojumu.
- Klašu nosaukumi ir garāki. Tā ir cena, un tā ir pieņemta.
- Meklēšana avotā kļūst precīza: `lp-` uzreiz atdala mūsu kodu no bibliotēkas.
