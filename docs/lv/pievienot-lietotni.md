# Kā pievienot lietotni darbvirsmai

Šī lapa ir domāta tam, kurš nav izstrādātājs. Nav jāzina programmēšana — jāprot
nokopēt astoņas rindas un nomainīt tekstu starp pēdiņām.

English: [`docs/en/adding-an-app.md`](../en/adding-an-app.md)

Ja kaut kas neizdodas, raksti izstrādes komandai — labāk pajautāt nekā minēt.

---

## Kur atrodas saraksts

Viss darbvirsmas saturs ir vienā failā:

```
config/apps.js
```

Nekas cits nav jāaiztiek. Ne `app.js`, ne `launchpad.css`, ne mape `brand/`.

## Kas jāzina pirms sākuma

Vajag trīs lietas:

1. **Lietotnes nosaukumu** — kā tas parādīsies flīzē.
2. **Adresi** — pilnu, ar `https://`.
3. **Atbildīgo** — nodaļu vai cilvēku un e-pastu, kam rakstīt par piekļuvi.

## Solis pa solim

### 1. Atrodi vietu

Atver `config/apps.js`. Fails sastāv no grupām — piemēram *Iepirkumi un
finanses*, *Cilvēki*, *Pārvaldība un rīki*. Katrā grupā ir lietotņu saraksts.

Izlem, kurā grupā lietotne iederas, un atrodi tajā pēdējo ierakstu. Tas beidzas
ar rindiņu, kurā ir `}` un aiz tās nekas.

### 2. Pieliec komatu

Ja pēdējais ieraksts beidzas ar `}`, pieliec aiz tā komatu: `},`

Tas ir biežākais klupšanas akmens. Starp ierakstiem vajag komatu; aiz pēdējā —
nevajag.

### 3. Iekopē jaunu ierakstu

```js
        {
          id: 'majaslapa',
          title: 'Mājaslapa',
          desc: 'Ko šī sistēma dara — viena rinda',
          url: 'https://majaslapa.riga.lv',
          owner: 'Komunikācijas pārvalde',
          contact: 'komunikacija@riga.lv',
          mono: 'Ma',
          family: 'Blues',
          size: 'md'
        }
```

Nomaini tekstu starp pēdiņām. `id` ir īss iekšējais nosaukums bez atstarpēm un
bez garumzīmēm.

`mono` ir divi burti, kas parādīsies krāsainajā kvadrātā. `family` nosaka krāsu.

### 4. Saglabā un pārbaudi

Saglabā failu un pārlādē lapu pārlūkā. Jaunā flīze ir klāt.

Ja lapa paliek tukša vai flīze neparādās, visdrīzāk trūkst komata vai pēdiņas.
Sk. sadaļu *Ja kaut kas nestrādā*.

---

## Krāsu saimes

`family` vērtība nosaka kvadrāta krāsu. Pieejamas piecas:

| Vērtība | Krāsa |
|---|---|
| `'Blues'` | rudzupuķu zils |
| `'Greens'` | priežu zaļš |
| `'Reds'` | dakstiņu sarkans |
| `'Alt Blue'` | Jāņu nakts zils |
| `'Grays'` | pelēks |

Sešām nosauktajām sistēmām — Sagāde, Starts, Kontrole, Pulss, Izaugsme,
Sintakse — ir savi zīmētie marķējumi, un tām `mono` un `family` nav vajadzīgs.

## Flīzes izmērs

| `size` | Cik plata |
|---|---|
| `'sm'` | trešdaļa |
| `'md'` | puse |
| `'lg'` | pilns platums |

Lai siena izskatītos kārtīga, izmēriem grupā vajadzētu salikties veselās rindās:
`lg` + `lg`, vai `md` + `md`, vai `lg` + `sm` + `sm` + `sm`.

## Papildu iespējas

Šīs rindas ir neobligātas — pieliec, ja vajag.

**Lietotne vēl top.** Flīze būs redzama, bet neatvērsies, un tai būs pelēka
nozīmīte *IZSTRĀDĒ*:

```js
          status: 'izstrade',
```

**Testa vide.** Flīze dabū zilu nozīmīti *TESTA VIDE*, lai neviens to nesajauc
ar īsto:

```js
          env: 'test',
```

**Jauna lietotne.** Ieraksti datumu — 30 dienas flīzei būs zaļa nozīmīte
*JAUNS*, pēc tam tā pazūd pati. Neko nevajag atcerēties noņemt:

```js
          added: '2026-08-01',
```

**Piekļuve jāpieprasa atsevišķi.** Flīzē parādīsies saite *Piekļuve*:

```js
          accessUrl: 'https://intranet.riga.lv/piekluve/majaslapa',
```

**Kārtība grupā.** Mazāks skaitlis — augstāk:

```js
          order: 1,
```

## Kā mainīt esošu lietotni

Atrodi tās ierakstu un nomaini tekstu starp pēdiņām. Nekas cits nav jādara.

## Kā noņemt lietotni

Izdzēs visu ierakstu no `{` līdz `}` ieskaitot. Pārbaudi, ka komati starp
atlikušajiem ierakstiem ir vietā un aiz pēdējā komata nav.

Ja lietotne tikai uz laiku nestrādā, labāk pieliec `status: 'izstrade',` —
tā cilvēki redz, ka tā eksistē.

---

## Ja kaut kas nestrādā

**Lapa ir pilnīgi tukša vai raksta "Konfigurācija nav ielādēta".**
Failā ir sintakses kļūda. Deviņos gadījumos no desmit tas ir viens no trim:

- trūkst komata starp diviem ierakstiem;
- ir komats aiz pēdējā ieraksta;
- pēdiņas nav aizvērtas, vai lietotas dažādas (`'` un `"` sajauktas).

Atsauc pēdējo izmaiņu un mēģini vēlreiz mazākos soļos.

**Flīze ir, bet neatveras.** Pārbaudi `url` — vai tas sākas ar `https://`.

**Kvadrātā ir `??`.** Nosaukumā nav burtu, no kā atvasināt monogrammu. Pieliec
`mono` ar diviem burtiem.

**Vietā, kur vajadzēja bildi, ir pelēks kvadrāts ar burtiem.** Ceļš `mark` laukā
norāda uz neesošu failu. Pārbaudi rakstību vai noņem `mark` rindu.

## Pirms publicēšanas

- Katrai lietotnei ir īsts `url`, nevis `#`
- Katrai lietotnei ir `owner` un `contact`, lai ir kam rakstīt par piekļuvi
- Apraksti ir vienā rindā, teikuma reģistrā, bez izsaukuma zīmēm
- Nosaukumos ir pareizās garumzīmes un mīkstinājuma zīmes
