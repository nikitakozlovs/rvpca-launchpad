# RVP CA launchpad — development guide

Latviešu valodā: [`docs/lv/izstrade.md`](../lv/izstrade.md)

---

## What this is

A static page with no dependencies and **no build step**. There is no
`npm install` and no `npm run build`. Three authored files (`index.html`,
`launchpad.css`, `app.js`), one config file, and a `brand/` folder holding the
design system.

## Running it

Two routes, both work:

```bash
# 1. Static server (preferred — closest to the deployed environment)
python3 -m http.server 8000
# → http://127.0.0.1:8000

# 2. Straight from the file
xdg-open index.html
```

The second works because the config loads through a `<script>` tag rather than
`fetch()`. That is deliberate: `fetch('apps.json')` is blocked under the `file://`
protocol, which would force a web server everywhere, including places that do not
need one.

## Layout

```
index.html          page shell
config/apps.js      CONTENT — normally the only file you edit
app.js              rendering, filter, theme toggle
launchpad.css       bento grid, tiles, footer
brand/              the design system, vendored (one patched line, see below)
vendor/             daisyUI + Tailwind, self-hosted
docs/               this documentation
```

## `config/apps.js`

The file assigns `window.RVPCA_LAUNCHPAD`. The convention is taken from the design
system's own data files (`assets/app-icons/systems-data.js` → `window.RIGA_SYSTEMS`).

### Root fields

| Field | Type | Description |
|---|---|---|
| `title` | string | Page heading; also becomes the `<title>` |
| `lead` | string | One line under the heading |
| `groups` | array | Groups, in the order given |

### Group fields

| Field | Type | Description |
|---|---|---|
| `id` | string | Internal identifier |
| `title` | string | Group name. Empty → `Bez nosaukuma` |
| `icon` | string | Font Awesome icon beside the title, e.g. `fa-users`. Optional |
| `span` | `narrow` \| `wide` \| `full` | How much of the outer grid the group takes |
| `apps` | array | Apps. If empty, the group is not drawn at all |

### App fields

| Field | Type | Description |
|---|---|---|
| `id` | string | Internal identifier |
| `title` | string | **Required.** Falls back to `id`; with neither, the tile is skipped |
| `desc` | string | One line. Optional |
| `url` | string | Address. If empty, the tile is not made into a link |
| `size` | `sm` \| `md` \| `lg` | Tile width. Defaults to `md` |
| `status` | `pieejama` \| `izstrade` | Defaults to `pieejama` (available) |
| `mark` | path | Drawn product mark |
| `markMuted` | path | Single-colour version, used in the `izstrade` state |
| `mono` | two letters | Flat monogram, when there is no `mark` |
| `family` | tonal family | Monogram colouring |

## The two icon modes

The design system has two monogram modes and the launchpad uses both.

**1. Stacked — product marks.** The six named systems already have marks drawn and
exported. Point at them with `mark`:

```js
mark:      'brand/assets/app-icons/exports/sagade-colored.svg',
markMuted: 'brand/assets/app-icons/exports/sagade-mono.svg'
```

The exports are self-contained: a 90×90 `viewBox`, three offset squares, and the
monogram already converted to vector paths — no font needed.

**2. Flat — every other app.** Omit `mark`; give `mono` and `family`:

```js
mono: 'Bu',
family: 'Blues'
```

Available families and their tones (`fill` / `ink`):

| `family` | Fill | Ink |
|---|---|---|
| `Blues` | `#254CD4` | `#AAD0FF` |
| `Greens` | `#0D382C` | `#E2FF86` |
| `Reds` | `#FF4833` | `#43010B` |
| `Alt Blue` | `#000B40` | `#BEAFEC` |
| `Grays` | `#565947` | `#FFFFFF` |

With neither `mark` nor `mono`, the monogram is derived from the first two letters
of the title and rendered in sand grey. That is why a malformed entry never takes
the page down — it just looks neutral.

## Group icons

Group headers use **Font Awesome Pro Light**, the design system's functional icon
vocabulary. The full Pro set is self-hosted under `brand/fonts/fontawesome/` — no
Kit script and no domain allowlist.

```js
{ id: 'cilveki', title: 'Cilvēki', icon: 'fa-users', span: 'wide', apps: [ … ] }
```

The `fa-` prefix is optional (`users` and `fa-users` both work). The Light style is
applied for you; do not put `fa-light` in the value.

To check a name exists before using it:

```bash
grep -c '\.fa-users {' brand/fonts/fontawesome/css/fontawesome.css   # 1 = present
```

Note that the key glyphs in `brand/assets/` are **not** used here. The design
system reserves them for ornament and gives functional icons to Font Awesome.

## The in-development state

```js
{ id: 'budzets', title: 'Budžets', url: '#', mono: 'Bu', family: 'Blues', status: 'izstrade' }
```

What `status: 'izstrade'` changes:

- The tile renders as `<div role="link" aria-disabled="true" tabindex="0">` rather
  than an `<a>`. There is **no `href`**, so there is no dead click — but the tile
  stays reachable by `Tab` and still shows the focus ring.
- An `IZSTRĀDĒ` badge appears, wired to the tile through `aria-describedby` so
  screen readers announce it.
- If `markMuted` is given, it is used instead of `mark`.
- The border becomes dashed and the text is muted.

## The grid

The outer grid is 12 columns; groups take `narrow` 4, `wide` 6, `full` 12. The
inner grid is always **6 columns** regardless of group width, so tile sizes are
predictable: `sm` 2, `md` 3, `lg` 6.

| Width | Outer grid | Tiles |
|---|---|---|
| ≥ 1200px | 12 columns | `sm` 2, `md` 3, `lg` 6 |
| 768–1199px | 6 columns, all groups full width | unchanged |
| 560–767px | 6 columns | `sm` 3, `md`/`lg` 6 |
| < 560px | 1 column | everything stacks |

For the wall to pack instead of going ragged, sizes within a group should sum to
whole rows (6, 12, …). For example `lg` + `lg`, or `md` + `md` + `lg`, or
`lg` + `sm` + `sm` + `sm`. The grid has `grid-auto-flow: dense`, which backfills
holes when something smaller appears later in the list.

Density is the responsive lever: above 1024px the page uses the design system's
`.airy` values, below it the comfortable default. That is one media query, not a
separate mobile stylesheet.

## `brand/` is vendored, not authored

Everything under `brand/` is copied from the design system kit essentially
unmodified — with exactly one deliberate, marked exception, documented below.

**Do not patch it in place.** When the design system is updated, re-copy the
files. If something needs overriding, do it in `launchpad.css`, which loads after
`brand/styles.css`.

### Re-vendoring: the one line to re-apply

There is exactly **one** local deviation from the kit, and it must be re-applied
after every re-copy or the launchpad silently starts calling Google Fonts again.

In `brand/colors_and_type.css`, the kit's line 11 is:

```css
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Google+Sans+Code:wght@400;500&display=swap');
```

Replace it with:

```css
@import url('fonts/google-sans/google-sans.css');
```

The deviation is marked in the file with a `⚠ RVPCA LOKĀLĀ IZMAIŅA` comment. To
confirm nothing else drifted, diff the re-copied tree against the kit — that one
hunk should be the only difference.

Verify afterwards with the external-request guard described under
[No external requests](#no-external-requests).

Included: `styles.css`, `colors_and_type.css`, `daisyui-theme.css`, Gilroy, Font
Awesome, the product mark exports, the pattern tiles, and the 14 key glyphs. Added
by us, not from the kit: `brand/fonts/google-sans/` (see below).

Not included: the kit's `uploads/`, `_ds_bundle.js`, `components/`, `ui_kits/`.
The design system itself states that its JSX is "cosmetic, not production-ready"
and that production code should be written against the tokens.

## Brand rules for anything new

These come from `brand/README.md`, *Visual foundations*, and bind anything added:

- Crisp radii: `--r-2` (4px) default, `--r-3` (8px) for the largest panels. Full
  rounding (`--r-pill`) is **only** for status pills and filter chips.
- Cards are **bordered, not shadowed**. Shadows are for floating UI only — menus,
  toasts, modals.
- 1px hairlines on `var(--line)`.
- Flat fills. **No gradients on chrome.**
- One accent per surface. Cornflower blue is the action colour; roof-tile red
  stays reserved for destructive actions and errors.
- Hover: border deepens to `--line-strong` plus a 2px lift. **Never opacity.**
  Wrap it in `@media (hover: hover)` so tiles do not stick on touch devices.
- **Never** remove focus rings.
- Restrained motion: `--ease-out`, 220ms, fades and small slides only.
- Key glyphs are **ornament only**, never a functional icon — that is Font
  Awesome's job.
- Interface copy in Latvian with correct diacritics. Sentence case, not Title
  Case. No exclamation marks. No emoji in chrome.

## Dark mode

The design system has **two** layers and both must be switched together:

```js
document.documentElement.classList.toggle('dark', dark);        // semantic tokens
document.documentElement.dataset.theme = 'sintakse-dark';       // daisyUI variables
```

The same applies to the colourways: `.theme-red` pairs with
`data-theme="sintakse-red"`.

## Pre-deploy checklist

- [ ] Every `url` points at a real address, not `#`
- [ ] The page opens both from a server and from `file://`
- [ ] No console errors
- [ ] **No external requests** — run the guard above; it must report zero
- [ ] No horizontal scrolling at any width from 1440px down to 360px
- [ ] Dark mode recolours everything; no hard-coded hex left anywhere
- [ ] `Tab` reaches every tile and the focus ring is visible
- [ ] `IZSTRĀDĒ` tiles do not open on click or `Enter`

## No external requests

The page loads **nothing** from the internet. Everything is self-hosted, so the
launchpad works on a closed network, offline, and leaks no request data to third
parties.

| Resource | Where it lives | Version |
|---|---|---|
| daisyUI | `vendor/daisyui.css` | 5.7.4 |
| Tailwind CSS (browser build) | `vendor/tailwindcss-browser.js` | 4.3.3 |
| Google Sans / Google Sans Code | `brand/fonts/google-sans/` | via Fontsource 5.3.0 |
| Gilroy | `brand/fonts/Gilroy-SemiBold.woff` | from the kit |
| Font Awesome 7 Pro | `brand/fonts/fontawesome/` | from the kit |

The design system specifies "Tailwind CSS + DaisyUI (CDN, no build step)". Serving
the identical files locally keeps the stack and the no-build-step property — only
the origin changes.

Only `latin` and `latin-ext` font subsets are shipped, woff2 only. `latin-ext`
carries the Latvian diacritics (ā ē ī ū č ģ ķ ļ ņ š ž all sit in U+0100–02BA), and
each `@font-face` declares its `unicode-range` so the browser fetches only the
subset a given character needs.

See `vendor/README.md` for how to refresh daisyUI and Tailwind.

**Regression guard.** Because a stray CDN reference fails silently in development
(the asset just loads), assert it rather than eyeballing it: block every non-local
request and confirm the page is unchanged.

```js
await ctx.route('**/*', route =>
  route.request().url().startsWith('http://127.0.0.1:8899/')
    ? route.continue()
    : route.abort());   // any external request now breaks the page loudly
```

## CSS class namespace

Every class this project owns is prefixed **`lp-`** (`lp-tile`, `lp-group__head`,
`lp-footer`). This is not cosmetic: daisyUI ships components called `.footer`,
`.filter`, `.card`, `.badge`, `.status` and many more, and an unprefixed class
silently inherits that component's layout. Both `.footer` and `.filter` collided
before the prefix was introduced.

Two deliberate exceptions:

- `.sr-only` — matches Tailwind's own utility of identical intent.
- `.dark` — belongs to the design system (`brand/colors_and_type.css`).

When adding a class, prefix it. To check a name is free:

```bash
grep -c '\.myclass' vendor/daisyui.css   # 0 = safe
```

Element **IDs** are not prefixed — they are not part of the CSS cascade and cannot
collide with a stylesheet.
