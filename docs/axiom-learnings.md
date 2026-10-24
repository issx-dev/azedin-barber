# Axiom Learnings — Patrones de defectos

Registro de patrones (no instancias) detectados por el Design Critic, para evitar recurrencias.

## 2026-10-24 — auditoría `audit/design-critic-experimental` (azedin-barber)

- **PATRÓN: Tipografía display sin clamp en móvil.** Los títulos display (`text-sect`) deben usar `clamp()` o `min()`; una línea fija desborda viewports de 390px (caso: `#ig-title` 454px > 390px).
- **PATRÓN: Controles de carrusel invisibles.** Los dots/indicadores de slider hechos con `h-px` (1px de alto) son inalcanzables como tap target; usar `p-` + hit-area ≥44px o `::after` expandido.
- **PATRÓN: Enlaces de texto sueltos en footer/dirección.** Los `tel:` e hipervínculos inline de texto sencillo miden 19–22px de alto; añadir padding vertical para llegar a 44px (WCAG 2.5.8, mínimo 24px AA).
- **PATRÓN: Preload de assets WebGL/scene condicional.** Preload de la primera imagen del tour aunque el tour no haya arrancado genera avisos "preloaded but not used"; mover el preload al momento de init de la escena.
- **PATRÓN: Eyebrows < 12px con tracking muy ancho.** Elegantes en desktop, frágiles en móvil; mínimo 12px y tracking proporcional.
