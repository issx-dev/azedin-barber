# Azedin Barber — proyecto Astro

Web de una página para Azedin Barber (Berja, Almería), migrada de HTML plano a Astro,
dividida en componentes reutilizables.

## Arrancar en local

```bash
npm install
npm run dev
```

Abre `http://localhost:4321`.

## Compilar para producción

```bash
npm run build
npm run preview   # para probar el build antes de subirlo
```

El resultado estático queda en `dist/` — puedes subir esa carpeta a Netlify, Vercel,
Cloudflare Pages o cualquier hosting estático.

## Estructura

```
src/
  data/content.js       ← precios, galería, reseñas y datos del negocio (edita aquí)
  layouts/Layout.astro  ← <head>, fuentes y el script global del modal de reserva
  styles/global.css     ← todos los estilos
  components/
    Header.astro
    Hero.astro           ← selector Azedin / Samir
    Trust.astro          ← franja de valoración
    Lookbook.astro       ← galería filtrable
    Reviews.astro        ← carrusel de reseñas
    Services.astro       ← tarifas
    Location.astro       ← dirección, horario, mapa
    Footer.astro
    BookingModal.astro
  pages/index.astro      ← ensambla todas las secciones
```

## Pendiente antes de publicar

1. **Fotos reales**: el hero y la galería usan fotos de stock de Pexels (barberos
   genéricos, no Azedin ni Samir). Sustituye las URLs en `src/data/content.js`
   (`galleryItems`) y en `src/components/Hero.astro` por vuestras fotos reales.
2. **Reseñas**: las reseñas en `src/data/content.js` están parafraseadas a partir de
   Booksy y atribuidas a "Cliente verificado · Booksy" porque Booksy no publica el
   nombre del cliente. Si consigues los nombres reales, cámbialos ahí.
3. **Precios**: los precios en `services` (13€ / 17€ / 15€ / 8€) vienen del dosier
   que me diste. El Booksy en vivo mostraba 15€ / 12€ / 10€ / 8€ en el momento de
   revisarlo — confirma cuál es el correcto antes de publicar.
4. **Reseñas totales**: "87+ reseñas verificadas en Booksy" es el dato en vivo de
   Booksy; tu dosier decía 140+ (quizá sumando Google Maps). Confirma la cifra real.
5. **Mapa**: `Location.astro` usa un mapa decorativo en CSS, no uno real. Si quieres
   un mapa interactivo de verdad, hay que añadir un embed de Google Maps o Mapbox.
