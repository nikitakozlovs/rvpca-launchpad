# Illustrations

This system uses **[unDraw](https://undraw.co)** illustrations for empty states, onboarding screens, login pages, settings landing pages, and any moment where a softer, friendlier visual is needed inside an otherwise utilitarian dashboard.

## How to add an illustration

1. Browse [undraw.co/illustrations](https://undraw.co/illustrations).
2. **Set the accent colour to cornflower blue:** `#254CD4` — that's the `--rudzupuku-zilais` token. Use the picker in the top-right of the unDraw site before downloading.
3. Download the SVG.
4. Save it here as `kebab-case-name.svg`.
5. Reference it from your component via `<img src="../../assets/illustrations/name.svg" />` or copy it into your output folder.

## Curated starter checklist

These are the illustrations the dashboard kit expects. **✓ = already in this folder; checked in by the brand owner.** The rest are still TODO — grab them from undraw.co (search term in parentheses) and drop them in.

- ✓ `speed-test.svg` — wired to the dashboard's "Integrācijas" empty state (no integrations connected)
- ✓ `about-us.svg` — wired to generic stub pages ("coming soon" surfaces)
- ✓ `searching.svg` — for empty search results / 404 / no-results
- ✓ `random-thoughts.svg` — wired to the requests page ("all caught up") empty state
- `empty-folder.svg` — *(search: "empty")* — empty list / table state
- `no-data.svg` — *(search: "no data")* — empty dashboard / no metrics yet
- `welcome.svg` — *(search: "welcome")* — first-run onboarding
- `login.svg` — *(search: "login")* — login screen side illustration
- `permission-denied.svg` — *(search: "access denied")* — 403 page
- `success.svg` — *(search: "completed")* — checkout / process complete
- `connection-lost.svg` — *(search: "server down" or "no connection")* — network error
- `team.svg` — *(search: "team")* — team / users page header
- `report.svg` — *(search: "report")* — reports / analytics landing
- `coffee.svg` — *(search: "coffee break")* — generic break / loading

## Rules

- **One illustration per surface.** Don't stack them.
- **Always single-accent cornflower.** Re-tint if you find one in a different colour.
- **Centred, max 280px wide** for inline empty states; up to 440px for full-page error / login illustrations.
- Pair with a short headline + one sentence of help + one primary action.
- Never paste unrelated illustrations together — keep the visual language coherent.

## Substitution flag

Four illustrations are now checked in (`speed-test`, `about-us`, `searching`, `random-thoughts`); the rest of the checklist is still TODO. Once you have your full set, drop them into this folder and update the dashboard's `EmptyState` `illustration` props to reference them by name.
