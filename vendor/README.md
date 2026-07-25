# vendor/

Third-party runtime dependencies, self-hosted so the launchpad makes **no
external network requests**.

| File | Package | Version |
|---|---|---|
| `daisyui.css` | [daisyui](https://daisyui.com) | 5.7.4 |
| `tailwindcss-browser.js` | [@tailwindcss/browser](https://tailwindcss.com) | 4.3.3 |

The Sintakse design system specifies "Tailwind CSS + DaisyUI (CDN, no build
step)". These are the same files `cdn.jsdelivr.net` serves for those packages,
copied locally — the stack and the no-build-step property are unchanged, only the
origin is.

Fonts are vendored separately, alongside the design system's own faces:

- `brand/fonts/Gilroy-SemiBold.woff` — display face
- `brand/fonts/google-sans/` — body and mono faces (replaces the Google Fonts import)
- `brand/fonts/fontawesome/` — icons (already self-hosted in the source kit)

## Updating

```bash
npm i --no-save daisyui@5 @tailwindcss/browser@4
cp node_modules/daisyui/daisyui.css vendor/daisyui.css
cp node_modules/@tailwindcss/browser/dist/index.global.js vendor/tailwindcss-browser.js
npm ci                      # restore the test dependencies --no-save skipped
```

`--no-save` keeps these two out of `package.json` — they are runtime assets that
live in `vendor/`, not build dependencies. Do **not** delete `package.json`: it
is committed and holds the test toolchain.

Then update the version table above, re-run `npm test`, and refresh
[`docs/perf-baseline.md`](../docs/perf-baseline.md) — these two files dominate
the page weight.
