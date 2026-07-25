# Arhitektūras lēmumi · Architecture decision records

Īsi ieraksti par lēmumiem, kas nav pašsaprotami no koda un kurus nedrīkst
nejauši atsaukt. Katrs apraksta kontekstu, apsvērtos variantus, izvēli un sekas.

Ieraksti netiek pārrakstīti. Ja lēmums mainās, top jauns ieraksts, kas atsaucas
uz veco.

*Short records of decisions that are not obvious from the code and must not be
reverted by accident. Records are append-only.*

| Nr. | Lēmums | Statuss |
|---|---|---|
| [0001](0001-patched-brand-font-import.md) | `brand/colors_and_type.css` fontu imports norāda uz lokālo kopiju | pieņemts |
| [0002](0002-lp-class-namespace.md) | Visām projekta CSS klasēm priedēklis `lp-` | pieņemts |
| [0003](0003-link-brand-token-files-directly.md) | `index.html` ielādē marku failus tieši, nevis caur `brand/styles.css` | pieņemts |

## Kad rakstīt jaunu ierakstu

- Lēmums skar vairāk nekā vienu failu un nav redzams no koda
- Kāds nākotnē varētu to "salabot", nezinot, kāpēc tā ir
- Izvēle bija starp vairākiem reāliem variantiem
