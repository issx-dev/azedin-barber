# MÁRMOL — Sistema de identidad digital de Azedin Barber

Derivado **solo** del logo y del local (Av. José Barrionuevo Peña 14, Berja).
Sustituye a PLOMO (minera/roja), rechazado por el cliente. Nada aquí viene de
la Sierra de Gádor ni del escudo de Berja: todo se midió en los frames del vídeo
`azedin-resources/instalaciones-completas.MOV` (frame-02s / 06s / 12s) y en
`logo-01.PNG` / `logo-02.PNG`.

## 0. Lo que hay de verdad (medido)

| Elemento del local | Muestra (mediana de región, PIL) | Lectura |
| --- | --- | --- |
| Suelo mármol negro pulido, vetas blancas diagonales | base `#0C0C15`–`#2D2D30`, reflejos `#C3C2C0` | **Lienzo**: negro ligeramente azulado, no neutro |
| Pared mate negra / carbón | `#1E1D24`, `#39393E` | planos elevados |
| Sillones piel negra | `#0D0D17` | el negro más profundo |
| Lamas verticales de madera (roble/fresno claro, ranuras negras) | `#ACA38F`, `#9D9680` | **único acento** cálido |
| Mesa palé de pino barnizado | `#D9C979` | acento cálido-alto, uso puntual |
| Mobiliario y aire acondicionado blancos | `#EBECEC` | texto principal |
| Aro de luz + cromo | `#C3C2C0` | metal, foco |
| Techo: panel LED **hexagonal** (panal) luz fría | `#C3C2C0`→`#FFFFFF` | motivo geométrico principal |
| Monstera / plantas | `#6B7A51` | estado "abierto", nada más |

Logo (`logo-02.PNG`, blanco sobre transparente, 1417×1417, bbox 139,258→1278,795):

- **"Azedin"**: caligrafía copperplate/formal script, trazo de pluma con
  contraste alto, la **A** abre con un bucle y la **n** final remata con un
  gran rasgo ascendente a la derecha. Es un gesto único, no una tipografía de UI.
- **"BARBER"**: serif romana de mayúsculas (familia Trajan), tracking muy
  abierto (~0.3em), tamaño ≈ 1/5 del script, centrado bajo él.
- Sin símbolo, sin escudo, sin círculo. Un solo color: blanco.

Conclusión: la marca es **negro pulido + blanco + madera clara + luz
hexagonal fría + una caligrafía**. El rojo nunca existió.

---

## 1. Tipografía

Tres voces, cada una con un trabajo y un límite duro.

| Rol | Familia | Por qué | Paquete (verificado en npm 5.3.0) |
| --- | --- | --- | --- |
| **Wordmark** | El propio logo como SVG/PNG (`logo-02.PNG`) | La caligrafía del logo es un dibujo, no se reconstruye con fuente | — |
| **Gesto script** (máx. 1 por página) | `Pinyon Script` 400 | Copperplate más cercano al trazo del logo; sólo para una palabra suelta en el hero (p. ej. *desde Berja*) o el nombre del barbero en el lookbook | `@fontsource/pinyon-script` |
| **Display** | `Cinzel Variable` 500–700 | Misma genealogía romana que el "BARBER" del logo. Siempre MAYÚSCULAS + tracking ancho | `@fontsource-variable/cinzel` |
| **Body / UI** | `Hanken Grotesk Variable` 400–600 | Ya instalada y auto-hospedada; neutra, no compite con Cinzel | `@fontsource-variable/hanken-grotesk` (ya en `package.json`) |

Reglas:

- Cinzel **nunca** en minúsculas, **nunca** por debajo de `--step-1`; en tamaños
  pequeños se cambia a Hanken 600 con `tracking-wide` (así el eyebrow sigue
  pareciendo "BARBER" sin usar una romana a 13px).
- Pinyon sólo a `--step-3` o superior y siempre en `#ECECEA`; nunca para
  precios, botones o texto de párrafo. Si una página ya lleva el logo grande
  en el hero, no se añade Pinyon encima: el logo ya es el gesto.
- Tracking positivo solo en Cinzel y eyebrows (`0.18em`–`0.3em`); Hanken a 0.
- Escala fluida (clamp), ratio ~1.25 en texto y salto de escala brutal al
  display, igual que el logo (script 5× BARBER):

```css
--step--1: clamp(0.8125rem, 0.78rem + 0.15vw, 0.875rem);   /* captions, horario */
--step-0:  clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);     /* body */
--step-1:  clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);       /* sub, precios */
--step-2:  clamp(1.75rem, 1.3rem + 1.8vw, 2.75rem);        /* h3, Cinzel min */
--step-3:  clamp(2.5rem, 1.6rem + 3.4vw, 4.5rem);          /* h2 */
--step-poster: clamp(3.25rem, 12vw, 11rem);                 /* h1 Cinzel o Pinyon */
```

Line-height: Cinzel 0.95 (tiene ascendentes cortas), Hanken 1.55 body / 1.35 sub,
Pinyon 1.0 (sus rasgos salen de la caja; dar `padding-inline` 0.15em para
que la n final no se corte).

Fallback con métricas ajustadas (CLS 0) para Hanken ya existe en `global.css`;
añadir el mismo patrón para Cinzel con `local('Georgia')`, `size-adjust: 104%`.

---

## 2. Tokens

Nombres en castellano, por material, para que nadie pueda escribir `slate` o
`gold` sin notar que no pertenece al local.

### 2.1 Color

| Token | Hex | Origen | Uso | Contraste sobre `marmol` |
| --- | --- | --- | --- | --- |
| `marmol` | `#0F0F14` | suelo pulido entre vetas | canvas | — |
| `marmol-2` | `#16161C` | pared mate | tarjetas, nav | — |
| `marmol-3` | `#212128` | estantería / lateral | hover de tarjeta, inputs | — |
| `piel` | `#0D0D17` | sillón | sólo overlays sobre vídeo/foto | — |
| `veta` | `#3A3A42` | sombra de veta | hairlines, bordes 1px, **nunca texto** | 1.7 |
| `humo-lo` | `#6E6E76` | gris pared iluminada | iconos decorativos, texto ≥24px | 3.78 (AA large) |
| `humo` | `#9A9AA2` | reflejo apagado | metadatos, horario, duración | **6.84 AA** |
| `cal-dim` | `#C4C4C2` | cromo / aro | texto secundario largo | 10.94 |
| `cal` | `#ECECEA` | mobiliario blanco | texto principal, logo | **16.16 AAA** |
| `roble` | `#B3A98F` | lamas de madera | **acento único**: CTA, precios, focus, selección | 8.18 |
| `roble-hi` | `#CFC5A8` | lama a contraluz | hover del CTA, estrella 5.0 | 11.11 |
| `roble-lo` | `#8E8468` | ranura de lama | borde de CTA, texto ≥18px | 5.14 |
| `pino` | `#D9C979` | mesa palé | **una** sola aparición por página (badge "5.0 ★" o el precio destacado). No en links. | 11.45 |
| `salvia` | `#8FA070` | monstera | sólo el punto de estado "Abierto ahora" | 6.76 |

Fondo claro: **no existe**. El local es negro; el botón primario es `roble`
con texto `marmol` (8.18:1), no blanco sobre madera (1.98:1 — prohibido).

### 2.2 Superficie, radio, profundidad

- Radio: `0` por defecto (lamas, mármol, panel LED: todo es arista).
  Excepciones nominales: `sm: 2px` para inputs; `full` **sólo** para el aro de
  luz = avatar de barbero y punto de estado.
- Sombra: ninguna difusa. Profundidad = reflejo, como el mármol:
  `--reflejo: inset 0 1px 0 0 rgb(236 236 234 / 0.06)` (filo superior de luz).
- Borde: `1px solid veta`. Nunca `2px` salvo focus.
- Veta de mármol como textura: SVG inline de 2–3 líneas diagonales
  (`stroke: cal`, opacidad 0.05–0.08, `stroke-width: 1`), no grain de ruido.

### 2.3 Espaciado y rejilla

- Espaciado proporcional a 1440 (ya en `global.css`): `--gap`, `--safe`.
- **Ritmo de lama**: `--lama: 12px` (ancho de lama) y `--ranura: 4px`. Se usa
  para gaps de listas, padding vertical de filas y el patrón decorativo
  `.lamas`. Todo múltiplo de 4.
- Hex: `--hex: 56px` (apotema) para el patrón de techo; nunca escalar hexágonos
  por debajo de 40px (dejan de leerse como el panel y parecen "tech").

### 2.4 Implementación — `src/styles/tokens.css`

```css
@layer base {
  :root {
    --c-marmol: #0f0f14;
    --c-marmol-2: #16161c;
    --c-marmol-3: #212128;
    --c-piel: #0d0d17;
    --c-veta: #3a3a42;
    --c-humo-lo: #6e6e76;
    --c-humo: #9a9aa2;
    --c-cal-dim: #c4c4c2;
    --c-cal: #ececea;
    --c-roble: #b3a98f;
    --c-roble-hi: #cfc5a8;
    --c-roble-lo: #8e8468;
    --c-pino: #d9c979;
    --c-salvia: #8fa070;

    --reflejo: inset 0 1px 0 0 rgb(236 236 234 / 0.06);
    --rule: 1px;
    --lama: 12px;
    --ranura: 4px;
    --hex: 56px;

    --ease-marmol: cubic-bezier(0.23, 1, 0.32, 1);   /* micro-estados */
    --ease-lama: cubic-bezier(0.4, 0, 0, 1);         /* reveals por franjas */
    --ease-led: cubic-bezier(0.165, 0.84, 0.44, 1);  /* encendidos, opacidad */
    --ease-puerta: cubic-bezier(0.86, 0, 0.07, 1);   /* overlays, modal Booksy */

    --dur-1: 120ms; --dur-2: 240ms; --dur-3: 420ms; --dur-4: 700ms;
    color-scheme: dark;
  }
  :focus-visible { outline: 2px solid var(--c-roble); outline-offset: 3px; }
  ::selection { background: var(--c-roble); color: var(--c-marmol); }
}
```

### 2.5 `tailwind.config.mjs` (sustituye el bloque `colors` / `fontFamily` / `boxShadow` de PLOMO)

```js
colors: {
  transparent: 'transparent', current: 'currentColor',
  marmol: '#0F0F14', 'marmol-2': '#16161C', 'marmol-3': '#212128', piel: '#0D0D17',
  veta: '#3A3A42', 'humo-lo': '#6E6E76', humo: '#9A9AA2',
  'cal-dim': '#C4C4C2', cal: '#ECECEA',
  roble: '#B3A98F', 'roble-hi': '#CFC5A8', 'roble-lo': '#8E8468',
  pino: '#D9C979', salvia: '#8FA070',
},
fontFamily: {
  display: ['"Cinzel Variable"', 'Georgia', 'serif'],
  script: ['"Pinyon Script"', 'cursive'],
  body: ['"Hanken Grotesk Variable"', '"Hanken fallback"', 'ui-sans-serif', 'sans-serif'],
},
borderRadius: { none: '0', DEFAULT: '0', sm: '2px', full: '9999px' },
boxShadow: { none: 'none', reflejo: 'inset 0 1px 0 0 rgb(236 236 234 / 0.06)' },
letterSpacing: { normal: '0', wide: '0.18em', wider: '0.3em' },
transitionTimingFunction: {
  marmol: 'cubic-bezier(0.23, 1, 0.32, 1)', lama: 'cubic-bezier(0.4, 0, 0, 1)',
  led: 'cubic-bezier(0.165, 0.84, 0.44, 1)', puerta: 'cubic-bezier(0.86, 0, 0.07, 1)',
},
transitionDuration: { 120: '120ms', 240: '240ms', 420: '420ms', 700: '700ms' },
```

Instalar: `pnpm add @fontsource-variable/cinzel @fontsource/pinyon-script` y
quitar `@fontsource-variable/archivo`, `@fontsource-variable/instrument-sans`,
`@fontsource/fraunces` (ya no se usan). Pinyon se carga con
`font-display: swap` y **sólo** en la ruta que lo usa (import en el componente
hero, no en el layout) — pesa ~40 KB y es un gesto, no una dependencia.

---

## 3. Motivos (los cuatro, y de dónde salen)

### 3.1 Panal LED (techo)
Hexágonos de contorno 1px `cal` al 8% sobre `marmol`, apotema `--hex`,
orientación con lado plano arriba (como el panel real). Usos: fondo del hero
detrás del vídeo (máscara radial, se apaga hacia los bordes), separador de la
sección Reseñas, patrón del 404. Nunca relleno, nunca más de una capa.

```css
.panal {
  --s: var(--hex);
  background:
    radial-gradient(ellipse at 50% 30%, rgb(15 15 20 / 0) 30%, var(--c-marmol) 75%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='194' viewBox='0 0 112 194'%3E%3Cg fill='none' stroke='%23ECECEA' stroke-opacity='.08'%3E%3Cpath d='M56 2 110 33v62L56 128 2 95V33z'/%3E%3Cpath d='M56 130l54 31v62M56 130 2 161v62'/%3E%3C/g%3E%3C/svg%3E");
  background-size: auto, calc(var(--s) * 2) auto;
}
```

### 3.2 Lamas (pared de madera)
Franjas verticales `--lama` con ranura `--ranura`. Es el **motivo de
transición**: reveals de imagen por franjas (ver motion), divisor vertical
entre "Azedin / Samir" en el hero partido, borde izquierdo de 3 lamas en
las tarjetas de precio al hacer hover. Color: `roble` sobre `marmol`, o
`cal` 6% cuando es textura de fondo.

```css
.lamas {
  background: repeating-linear-gradient(90deg,
    var(--c-roble) 0 var(--lama), transparent var(--lama) calc(var(--lama) + var(--ranura)));
}
```

### 3.3 Veta (suelo de mármol)
Una línea diagonal fina (`cal` 7%, 1px, ~−28°) que cruza una sección completa,
y una regla horizontal 1px `veta` que se dibuja de izquierda a derecha al
entrar en viewport. Es la única "decoración" permitida en el body. Como
máximo una veta diagonal por pantalla; se posiciona detrás del texto, nunca
a través de un rostro.

### 3.4 Aro de luz (ring light)
Círculo 1px `cal-dim` con un `box-shadow: 0 0 0 6px rgb(236 236 234 / .06)`.
Usos: avatar de barbero (único `rounded-full`), estado "abierto ahora"
(punto `salvia` + aro), indicador de foco en el lookbook. No se usa como
botón.

Prohibido (no está en el local): tijeras, navajas, bigotes, poste de
barbero, texturas de cuero, dorado brillante `#FFD700`, degradados a rojo,
grain WebGL, glassmorphism con blur.

### 3.5 Logo: uso
- Mínimo 140px de ancho (por debajo, el script pierde el bucle de la A);
  en nav móvil usar sólo el "BARBER" en Cinzel + un `aria-label` completo.
- Área de respeto = altura de la "B" de BARBER a cada lado.
- Siempre `cal` sobre `marmol`/foto oscura. Nunca sobre madera (`roble`):
  1.98:1.
- Convertir `logo-02.PNG` a SVG (potrace o Figma) y servirlo inline en el hero
  para animar el trazo (ver 4.3).

---

## 4. Motion

Principio: el local es quieto; lo único que se mueve es la **luz** (LEDs
encendiéndose, reflejos en el mármol) y la **mano del barbero** (un gesto,
preciso, una vez). Nada rebota, nada flota, nada hace parallax de 200px.

### 4.1 Vocabulario

| Nombre | Qué hace | Curva / duración | Dónde |
| --- | --- | --- | --- |
| **Encendido** | opacidad 0→1 + `filter: brightness(1.4→1)` escalonado 40ms por celda | `--ease-led`, 420ms | hexágonos del hero al cargar; estrellas de la valoración |
| **Lama** | revelado de imagen por 8 franjas verticales (`clip-path` por franja, stagger 30ms) | `--ease-lama`, 700ms | fotos del lookbook y de barberos al entrar en viewport |
| **Veta** | regla 1px `scaleX(0→1)` desde `transform-origin: left` | `--ease-led`, 420ms | debajo de cada h2 |
| **Reflejo** | brillo que recorre el CTA (pseudo-elemento, `translateX(-100%→100%)`, 1 vez al hover) | linear, 700ms | botón primario `roble` |
| **Trazo** | el logo SVG se dibuja con `stroke-dashoffset` y luego rellena | `--ease-lama`, 1.2s, una vez por sesión (`sessionStorage`) | hero |
| **Puerta** | overlay del modal Booksy entra desde abajo (`y: 100%→0`) | `--ease-puerta`, 420ms | modal reserva |
| Micro | hover de enlaces: color `cal`→`roble-hi` | `--ease-marmol`, 120ms | todo |

Scroll: Lenis con `lerp: 0.1` sólo en desktop, drive por `gsap.ticker`
(patrón oficial verificado en la doc de Lenis). En móvil Lenis desactivado
(`smoothTouch` no se usa). Sin scroll-jacking: no hay `pin`, y `scrub` sólo
en la veta diagonal del hero (desplazamiento máximo 6vh).

### 4.2 Reduced motion
`gsap.matchMedia()` con condición `reduceMotion` (API verificada). Con
`prefers-reduced-motion: reduce`: Lama → fade 240ms; Encendido → sin stagger;
Trazo → logo estático; Reflejo y scrub → desactivados. El CSS ya fuerza
`animation-duration: 0.01ms` como red de seguridad.

### 4.3 Implementación — `src/scripts/motion.ts`

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const EASE = {
  led: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  lama: 'cubic-bezier(0.4, 0, 0, 1)',
  puerta: 'cubic-bezier(0.86, 0, 0.07, 1)',
};

const mm = gsap.matchMedia();

mm.add(
  {
    isDesktop: '(min-width: 1024px)',
    isMobile: '(max-width: 1023px)',
    reduceMotion: '(prefers-reduced-motion: reduce)',
  },
  (ctx) => {
    const { isDesktop, reduceMotion } = ctx.conditions!;

    // Lenis sólo en desktop y sin reduced-motion. Patrón oficial Lenis+GSAP.
    let lenis: Lenis | undefined;
    let tick: ((t: number) => void) | undefined;
    if (isDesktop && !reduceMotion) {
      lenis = new Lenis({ lerp: 0.1, autoRaf: false });
      lenis.on('scroll', ScrollTrigger.update);
      tick = (t) => lenis!.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Encendido: celdas del panal del hero
    gsap.from('[data-led]', {
      autoAlpha: 0,
      filter: reduceMotion ? 'none' : 'brightness(1.4)',
      duration: reduceMotion ? 0.24 : 0.42,
      stagger: reduceMotion ? 0 : { each: 0.04, from: 'center' },
      ease: EASE.led,
    });

    // Lama: revelado por franjas (8 <span data-lama> absolutos con clip-path)
    gsap.utils.toArray<HTMLElement>('[data-reveal="lama"]').forEach((el) => {
      const franjas = el.querySelectorAll('[data-lama]');
      gsap.fromTo(
        franjas,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: reduceMotion ? 0.24 : 0.7,
          stagger: reduceMotion ? 0 : 0.03,
          ease: EASE.lama,
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        },
      );
    });

    // Veta: regla bajo h2
    gsap.utils.toArray<HTMLElement>('[data-veta]').forEach((el) => {
      gsap.from(el, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.42,
        ease: EASE.led,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    // Veta diagonal del hero: único scrub, 6vh máximo
    if (!reduceMotion) {
      gsap.to('[data-veta-hero]', {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
    }

    // Trazo del logo, una vez por sesión
    const logo = document.querySelector<SVGPathElement>('[data-logo-path]');
    if (logo && !reduceMotion && !sessionStorage.getItem('az-trazo')) {
      const len = logo.getTotalLength();
      gsap.set(logo, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
      gsap
        .timeline({ onComplete: () => sessionStorage.setItem('az-trazo', '1') })
        .to(logo, { strokeDashoffset: 0, duration: 1.2, ease: EASE.lama })
        .to(logo, { fillOpacity: 1, duration: 0.42, ease: EASE.led }, '-=0.3');
    }

    // Cleanup propio; context.revert() lo hace GSAP solo (doc matchMedia).
    return () => {
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  },
);
```

Cargar con `<script>` de Astro (módulo, deferido) sólo en `index.astro`; el
404 no lleva motion.

### 4.4 CSS que no necesita JS

```css
.cta-roble { position: relative; overflow: hidden; background: var(--c-roble); color: var(--c-marmol); }
.cta-roble::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(100deg, transparent 30%, rgb(236 236 234 / .35) 50%, transparent 70%);
  transform: translateX(-100%);
}
.cta-roble:hover::after { transition: transform 700ms linear; transform: translateX(100%); }
.cta-roble:hover { background: var(--c-roble-hi); transition: background var(--dur-1) var(--ease-marmol); }
@media (prefers-reduced-motion: reduce) { .cta-roble::after { display: none; } }
```

---

## 5. Checklist de migración desde PLOMO

1. `tokens.css` nuevo + sustituir bloque `:root` de `global.css`.
2. `tailwind.config.mjs`: reemplazar `colors`, `fontFamily`, `boxShadow`,
   `letterSpacing`, `transitionTimingFunction` por los de §2.5.
3. `pnpm add @fontsource-variable/cinzel @fontsource/pinyon-script && pnpm remove @fontsource-variable/archivo @fontsource-variable/instrument-sans @fontsource/fraunces`.
4. Buscar y eliminar: `gules`, `oro`, `caliza`, `ink`, `lead`, `shadow-hard`,
   `font-mono`, `tracking-tight` (el display romano no se aprieta).
5. Vectorizar `logo-02.PNG` → `src/assets/logo.svg` con `data-logo-path`.
6. Grabar `motion.ts`, probar con `prefers-reduced-motion` forzado en
   DevTools y Lighthouse móvil (presupuesto: CLS 0, sin JS en 404).
