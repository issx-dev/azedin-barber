# design-critic-fixes

Branch `audit/design-critic-experimental`. Apply Design Critic BLOCK fixes; no merge without user permission.

## Specs

S1. "dots del carrusel de reseñas: h-px w-8 → 32×1px" → hit-area ≥44×44px, visual dot stays small
S2. "#ig-title @azedinbarber mide 454px en viewport de 390px" → no overflow on ≤390px
S3. "enlaces tel: e inline de footer/dirección miden 19–22px" → ≥44px touch height
S4. "Header logo 159×19px y botón Cerrar 40px" → logo and menu/cerrar ≥44px hit-area
S5. "Preload de /tour/d/000.webp nunca consumido — 14 warnings" → defer or match LCP so preload is used
S6. "Eyebrows a 11px" → mínimo 12px en móvil
S7. "Marquee cortado verticalmente al entrar al footer (móvil)" → no vertical clip of phrase
S8. "Nav desktop 13px con tracking 2,35px y color rgb(154,154,162)" → 14–15px + contrast ≥4.5:1 where feasible

## Tasks

- T1 S1 — inline — Reviews.astro — done (clean recommit after history rewrite)
- T2 S2 — inline — InstagramFeed.astro — done (clamp 7.2vw; measured 319px @ 390vw)
- T3 S3 — inline — Footer.astro, Location.astro — done (tel + IG + Booksy min-h-11)
- T4 S4 — inline — Header.astro — done (logo/menu min-h-11 = 44px)
- T5 S5 — inline — Layout.astro — done (AVIF preload matches picture; used as link on mobile)
- T6 S6 — inline — global.css .eyebrow — done (0.75rem / 12px measured)
- T7 S7 — inline — Marquee.astro — done (overflow-x-hidden + leading-none)
- T8 S8 — inline — Header.astro nav — done (text-sm / 19px desktop, text-cal-dim)

## Log

L1. User: "Ya tiene acceso a la web y a subagentes, dale con todo" then "Dale con todo" — implement all design-critic fixes on isolated branch, no merge without permission.
L2. P0 commit 3221e8f landed Reviews/IG/Footer-tel/Location-tel; accidentally staged unrelated .atl/.opencode/e2e files.
L3. P1/P2 verified at http://127.0.0.1:4321/ (390 + 1440): logo/menu/footer/dots ≥44px; ig-title no overflow; eyebrow 12px; desktop nav 19px cal-dim; AVIF preload consumed; screenshots in `.audit/verify-*.png`.
L4. User: "dale con tod, despliega todo tu poder" — soft-reset unpushed dirty commits; recommit design-only files; push + open PR without merge.
