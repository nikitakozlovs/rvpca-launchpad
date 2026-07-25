# Folk-mark patterns

Seamless tiling artwork derived from the six **deconstruct** folk marks (`assets/riga-deconstruct-1…6.svg`) — the Latvian folk-embroidery abstractions of the Rīga key. This folder holds the **tile-ready** versions; the canonical glyphs in `../` keep their padding for use as standalone marks and watermarks.

Used for: dark sidebars, login screens, wallboard / hero backgrounds, empty-state corners — anywhere a quiet brand texture is wanted. Reference render: `preview/19-pattern.html` (DS card "Pattern in use").

> **Key fact about these marks.** Every deconstruct mark is an **openwork lattice** — a plus/block motif with a hole at its own centre, all drawn on the same 5×5 block grid (cells ≈102u). That openwork is the motif, not a defect. It means a *single* mark **cannot** be tiled into a solid field: offsetting copies (half-drop, 4-way, even pairing two different marks) lands hole-on-hole, so square voids always remain. If you need a genuinely gapless field, use the **solid-weave** treatment below (tone the voids), not more offset layers.

---

## The files

| File | What it is |
|---|---|
| `riga-deconstruct-N.svg`        | **Seamless openwork.** Same path as the canonical mark, but the `viewBox` is cropped to the content grid so it tiles edge-to-edge with no gutter. Transparent — recolour with CSS. |
| `riga-deconstruct-N-solid.svg`  | **Solid weave.** The same mark over a full-bleed background rect in a second tone → a 2-tone tile that tiles with **zero** transparent gaps. Colours are baked in. |

`N` = 1…6.

---

## Recipe 1 — make a seamless openwork tile

The canonical marks sit on a `0 0 640 640` viewBox with the glyph occupying the inner `64…576` (a 512 grid, 64u padding all round). That padding is what creates gaps when you tile. Crop it out:

```
viewBox="0 0 640 640"   →   viewBox="64 64 512 512"
```

Nothing else changes. The arms now reach the tile edges, so adjacent tiles connect into a continuous lattice. (This is exactly how `riga-deconstruct-N.svg` here were generated from `../riga-deconstruct-N.svg`.)

## Recipe 2 — tile openwork at low contrast (on-brand texture)

The marks are dark-on-transparent, so on the dark canvas invert them to paper-tone and drop the opacity. A **two-layer half-drop** (a second copy offset by half a tile) packs the marks as densely as the openwork allows:

```css
.pat {
  position: absolute; inset: 0;
  background-image: url('riga-deconstruct-2.svg'), url('riga-deconstruct-2.svg');
  background-repeat: repeat;
  background-size: var(--s) var(--s);                 /* tile size, e.g. 58px */
  background-position: 0 0, calc(var(--s)/2) calc(var(--s)/2);
  filter: invert(1);                                  /* dark mark → light */
  opacity: 0.10;                                      /* low-contrast texture */
}
```

- Keep opacity **0.08–0.18**. This is a *background*, never foreground-competing.
- On a **light** surface, drop the `invert(1)` and use opacity ~0.14 (dark mark on paper).
- Always lay foreground content above with `position: relative; z-index: 1`.

## Recipe 3 — redraw a solid-weave tile (genuinely gapless)

Fill the openwork voids with a second tone. Wrap the mark's path over a full-bleed rect inside the cropped viewBox:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="64 64 512 512">
  <rect x="64" y="64" width="512" height="512" fill="#000B40"/>  <!-- tone A: ground -->
  <path d="…the mark path…" fill="#254CD4"/>                      <!-- tone B: figure -->
</svg>
```

The rect fills the viewBox edge-to-edge, so tiling leaves **no transparent gaps** — the voids are simply tone A. Tile it as a single layer (no invert, no opacity, no offset needed):

```css
.spat {
  position: absolute; inset: 0;
  background-image: url('riga-deconstruct-1-solid.svg');
  background-repeat: repeat;
  background-size: var(--s) var(--s);
}
```

### Colourways shipped (2-tone, on-brand)

| Mark | Ground (A) | Figure (B) | |
|---|---|---|---|
| 1 | `#000B40` Midsummer | `#254CD4` cornflower | navy / cornflower |
| 2 | `#000B40` Midsummer | `#AAD0FF` sky | navy / sky |
| 3 | `#0D382C` pine | `#78E9B8` copper | pine / copper |
| 4 | `#43010B` maroon | `#FF4B33` roof-tile | maroon / roof-tile |
| 5 | `#000B40` Midsummer | `#E2FF86` cucumber | navy / cucumber |
| 6 | `#254CD4` cornflower | `#AAD0FF` sky | cornflower / sky |

Pick any two palette tokens with enough contrast. Keep one accent per surface — don't mix colourways in a single field.

---

## Regenerating the whole set

Both sets are derived mechanically from `../riga-deconstruct-N.svg`:

1. **Openwork:** copy each mark, swap `viewBox="0 0 640 640"` → `viewBox="64 64 512 512"`.
2. **Solid:** extract the `<path d="…">`, wrap it over a `<rect x="64" y="64" width="512" height="512" fill="A"/>` with `fill="B"` on the path, same cropped viewBox.

To add a new mark, drop its canonical glyph in `../` on the same 64-step grid, then run both steps.
