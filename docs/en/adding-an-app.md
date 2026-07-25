# How to add an app to the launchpad

This page is written for someone who is not a developer. No programming
knowledge is needed — you copy eight lines and change the text between the
quotes.

Latviski: [`docs/lv/pievienot-lietotni.md`](../lv/pievienot-lietotni.md)

If something goes wrong, ask the development team — better to ask than to guess.

---

## Where the list lives

All the launchpad's content is in one file:

```
config/apps.js
```

Nothing else needs touching. Not `app.js`, not `launchpad.css`, not `brand/`.

## What you need first

Three things:

1. **The app's name** — as it will appear on the tile.
2. **The address** — the full one, with `https://`.
3. **The owner** — the department or person, and an email for access questions.

## Step by step

### 1. Find the spot

Open `config/apps.js`. The file is made of groups — *Iepirkumi un finanses*,
*Cilvēki*, *Pārvaldība un rīki*. Each group holds a list of apps.

Decide which group the app belongs in, and find the last entry in it. It ends
with a line containing `}` and nothing after it.

### 2. Add a comma

If that last entry ends with `}`, add a comma after it: `},`

This is the most common stumble. Entries need a comma between them; the last one
must not have one.

### 3. Paste in a new entry

```js
        {
          id: 'majaslapa',
          title: 'Mājaslapa',
          desc: 'What this system does — one line',
          url: 'https://majaslapa.riga.lv',
          owner: 'Komunikācijas pārvalde',
          contact: 'komunikacija@riga.lv',
          mono: 'Ma',
          family: 'Blues',
          size: 'md'
        }
```

Change the text between the quotes. `id` is a short internal name with no spaces
and no diacritics.

`mono` is the two letters shown in the coloured square. `family` sets its colour.

> The interface is Latvian, so `title` and `desc` should be written in Latvian
> with correct diacritics.

### 4. Save and check

Save the file and reload the page in your browser. The new tile is there.

If the page goes blank or the tile does not appear, a comma or a quote is
missing. See *If something is broken*.

---

## Colour families

`family` sets the square's colour. Five are available:

| Value | Colour |
|---|---|
| `'Blues'` | cornflower blue |
| `'Greens'` | pine green |
| `'Reds'` | roof-tile red |
| `'Alt Blue'` | Midsummer-night blue |
| `'Grays'` | grey |

The six named systems — Sagāde, Starts, Kontrole, Pulss, Izaugsme, Sintakse —
have their own drawn marks and need neither `mono` nor `family`.

## Tile size

| `size` | How wide |
|---|---|
| `'sm'` | one third |
| `'md'` | one half |
| `'lg'` | full width |

For the wall to look tidy, sizes within a group should add up to whole rows:
`lg` + `lg`, or `md` + `md`, or `lg` + `sm` + `sm` + `sm`.

## Optional extras

These lines are optional — add them if you need them.

**The app is still being built.** The tile stays visible but will not open, and
gets a grey *IZSTRĀDĒ* badge:

```js
          status: 'izstrade',
```

**Test environment.** The tile gets a blue *TESTA VIDE* badge so nobody mistakes
it for the real one:

```js
          env: 'test',
```

**A new app.** Write the date — for 30 days the tile carries a green *JAUNS*
badge, then it disappears on its own. Nothing to remember to remove:

```js
          added: '2026-08-01',
```

**Access must be requested separately.** A *Piekļuve* link appears on the tile:

```js
          accessUrl: 'https://intranet.riga.lv/piekluve/majaslapa',
```

**Order within the group.** Lower number, higher up:

```js
          order: 1,
```

## Changing an existing app

Find its entry and change the text between the quotes. Nothing else to do.

## Removing an app

Delete the whole entry, from `{` to `}` inclusive. Check that the commas between
the remaining entries are right, and that the last one has none.

If the app is only temporarily down, prefer `status: 'izstrade',` — that way
people can still see it exists.

---

## If something is broken

**The page is blank, or says "Konfigurācija nav ielādēta".**
There is a syntax error in the file. Nine times out of ten it is one of three:

- a missing comma between two entries;
- a comma after the last entry;
- an unclosed quote, or mixed quote types (`'` and `"`).

Undo your last change and try again in smaller steps.

**The tile is there but does not open.** Check `url` starts with `https://`.

**The square shows `??`.** The name has no letters to build a monogram from. Add
a `mono` with two letters.

**A grey square with letters appears where a picture should be.** The `mark`
path points at a file that does not exist. Check the spelling, or remove the
`mark` line.

## Before publishing

- Every app has a real `url`, not `#`
- Every app has an `owner` and `contact`, so there is someone to ask about access
- Descriptions are one line, sentence case, no exclamation marks
- Names carry the correct Latvian diacritics
