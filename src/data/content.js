/**
 * Single source of truth for every piece of copy, price and business datum.
 * Nothing here is invented: each field is traceable to Booksy (profile 141862),
 * the @azedinbarber Instagram bio or the Google Business Profile.
 * Verified 2026-10-03.
 */

// --- Photography -------------------------------------------------------------
// The archivo uses the six frames sharp enough to judge. The ~1200px phone
// crops and the 720px video posters stay on disk until a real session.
import corteSkinFade from '../assets/img/corte-skin-fade-degradado.jpeg';
import corteCropTop from '../assets/img/corte-crop-top-texturizado.jpeg';
import corteAfeitadoClasico from '../assets/img/corte-afeitado-clasico-navaja.jpeg';
import corteMidFade from '../assets/img/corte-mid-fade-degradado-medio.jpeg';
import corteLowFade from '../assets/img/corte-low-fade-degradado-bajo.jpeg';
import corteArregloBarba from '../assets/img/corte-arreglo-barba-perfilado.jpeg';
import salonEnCorte from '../assets/img/corte-pelo-azedin.jpeg';
import personaAzedin from '../assets/img/barbero-azedin-master-barber-berja.jpeg';
import personaSamir from '../assets/img/barbero-samir-berja.jpeg';

/** True once the shop sends full-resolution photography. Gates hero imagery. */
export const HAS_HIRES_PHOTOGRAPHY = false;

// --- Business ----------------------------------------------------------------
export const business = {
  // Instagram and Booksy disagree: @azedinbarber displays "Barbería Azedin",
  // Google and Booksy list "Azedin Barber". Brand name = the one they chose
  // for themselves on their own channel; the Google form stays for SEO/schema.
  name: 'Barbería Azedin',
  legalName: 'Azedin Barber',
  owner: 'Azedin',
  tagline: 'Estilo y Elegancia', // their own words, from the Instagram bio
  town: 'Berja',
  province: 'Almería',
  address: 'Avenida José Barrionuevo Peña 14',
  postalCode: '04760',
  addressFull: 'Avenida José Barrionuevo Peña 14, 04760 Berja, Almería',
  lat: 36.841288,
  lng: -2.9454388,
  placeId: 'ChIJ7W6d2rNJcA0Rzn67hTCZhgo',
  phone: '+34 643 94 55 22',
  phoneRaw: '+34643945522',
  rating: '5,0',
  reviewCount: 202,
  reviewSource: 'Booksy',
  booksyUrl: 'https://azedinbarber.booksy.com/a',
  booksyProfileUrl: 'https://booksy.com/es-es/141862_azedin-barber_barberia_26193_berja',
  instagramUrl: 'https://www.instagram.com/azedinbarber/',
  // TikTok is abandoned and duplicated (95 and 86 followers, zero videos).
  // Facebook does not exist. Linking either would cost credibility.
  instagramSamirUrl: 'https://www.instagram.com/smr.barber/',
};

/** Verbatim from Booksy. Monday afternoons only, Saturday closes at 15:30. */
export const hours = [
  { day: 'Lunes', slots: ['15:30 – 20:00'], note: 'Solo tarde' },
  { day: 'Martes', slots: ['10:00 – 14:00', '16:00 – 20:00'] },
  { day: 'Miércoles', slots: ['10:00 – 14:00', '16:00 – 20:00'] },
  { day: 'Jueves', slots: ['10:00 – 14:00', '16:00 – 20:00'] },
  { day: 'Viernes', slots: ['10:00 – 14:00', '16:00 – 20:00'] },
  { day: 'Sábado', slots: ['09:30 – 14:00', '14:30 – 15:30'], note: 'Jornada corta' },
  { day: 'Domingo', slots: [], note: 'Cerrado' },
];

// --- Services ----------------------------------------------------------------
// Prices verified on Booksy 2026-10-03. Visible without a click on purpose:
// it is the single thing a barbershop customer looks for, and the thing almost
// every barbershop site hides.
export const services = [
  { num: '01', name: 'Corte & Barba', price: '17', minutes: 30, note: 'El más pedido' },
  { num: '02', name: 'Corte de pelo', price: '13', minutes: 30 },
  { num: '03', name: 'Rapado & Barba', price: '15', minutes: 30 },
  {
    num: '04',
    name: 'Arreglo de barba o afeitado',
    price: '8',
    minutes: 30,
    note: 'Diseño de la barba a navaja o afeitado',
  },
  { num: '05', name: 'Corte niño', price: null, minutes: 30, note: 'Hasta 10 años · consultar' },
];

// --- Team --------------------------------------------------------------------
// Three barbers, not two: ANAS joined and already has verified reviews
// (first one 29 Sep 2026).
export const barbers = [
  {
    name: 'Azedin',
    role: 'Fundador',
    img: personaAzedin,
    width: 320,
    height: 320,
    instagram: business.instagramUrl,
  },
  {
    name: 'Samir',
    role: 'Barbero',
    img: personaSamir,
    width: 320,
    height: 320,
    instagram: business.instagramSamirUrl,
  },
  { name: 'Anas', role: 'Barbero', img: null },
];

// --- Reviews -----------------------------------------------------------------
// Verbatim, verified-customer reviews from Booksy. Real names, real services,
// real dates — attribution is the whole point.
export const reviews = [
  {
    quote:
      'Llevo a mi hijo de 2 años y son súper cariñosos, cuidadosos y profesionales. Lo dejan guapísimo.',
    author: 'Lidia',
    service: 'Corte de pelo',
    barber: 'Samir',
    date: '2026-07-16',
    featured: true,
  },
  {
    quote:
      'La mejor peluquería sin duda. Atención de diez, grandes profesionales y resultados de revista. ¡Recomendadísima!',
    author: 'Antonio',
    service: 'Corte de pelo',
    barber: 'Azedin',
    date: '2026-07-22',
  },
  {
    quote:
      'Me ha cortado el pelo Samir, es muy profesional y estoy súper contento, me ha dejado muy muy bien. Ya han conseguido un nuevo cliente.',
    author: 'Alex',
    service: 'Corte de pelo',
    barber: 'Samir',
    date: '2026-03-26',
  },
  {
    quote: 'Gran profesionalidad, buen trato y un rato distendido, como siempre genial.',
    author: 'Jose',
    service: 'Corte & Barba',
    barber: 'Azedin',
    date: '2026-08-27',
  },
  {
    quote: 'Puntual y muy atento, una máquina.',
    author: 'Zouhair',
    service: 'Corte de pelo',
    barber: 'Azedin',
    date: '2026-07-17',
  },
  {
    quote: 'Profesionales, todo muy limpio y muy amables. Son 2 cracks.',
    author: 'Alex',
    service: 'Corte & Barba',
    barber: 'Azedin',
    date: '2026-09-25',
  },
  {
    quote: 'Muy bien trato a los clientes, tanto Samir como Azedin. Los dos pelan muy bien.',
    author: 'Iker',
    service: 'Corte de pelo',
    barber: 'Azedin',
    date: '2026-07-29',
  },
  {
    quote: 'De los mejores en Berja.',
    author: 'Virginia',
    service: 'Corte de pelo',
    barber: 'Azedin',
    date: '2026-06-02',
  },
];

/**
 * Short verified reviews for the moving wall: one line each, so the section
 * reads as a crowd of voices rather than a block of text. Verbatim (Booksy).
 */
export const shortReviews = [
  { quote: 'Puntual y muy atento, una máquina.', author: 'Zouhair' },
  { quote: 'De los mejores en Berja.', author: 'Virginia' },
  { quote: 'Son los mejores.', author: 'Gador' },
  { quote: 'Excelentes profesionales.', author: 'Alejandro' },
  { quote: 'Todo perfecto, muy buena gente.', author: 'Miguel' },
  { quote: 'Muy competente y profesionales.', author: 'Manu' },
  { quote: 'Son puntuales y amables.', author: 'Julio' },
  { quote: 'Muy bien pelado, calidad.', author: 'Vlad' },
  { quote: 'Todo perfecto. Muy recomendable.', author: 'José C.' },
  { quote: 'Buen profesional, trato agradable y muy atento.', author: 'Daniel' },
  { quote: 'Correcto y rápido.', author: 'Juan' },
  { quote: 'Muy buen trato, os recomiendo 100 por 100.', author: 'Fina' },
  { quote: 'Unos cracks.', author: 'Álvaro' },
  { quote: 'Los mejores.', author: 'Marian' },
];

/** The five words customers actually repeat across ~60 reviews, in order. */
export const reviewThemes = ['Profesionalidad', 'Detalle', 'Buen trato', 'Puntualidad', 'Limpieza'];

// --- Gallery -----------------------------------------------------------------
// Placeholder frames. `focus` sets object-position so the haircut, not the
// ceiling, survives the crop.
export const galleryItems = [
  { label: 'Low Fade', barber: 'Azedin', alt: 'Crop con low fade', src: corteLowFade, width: 1755, height: 2340, focus: 'center 28%' },
  { label: 'Crop Top', barber: 'Azedin', alt: 'Crop top texturizado', src: corteCropTop, width: 1755, height: 2340, focus: 'center 30%' },
  { label: 'Afeitado a navaja', barber: 'Azedin', alt: 'Afeitado clásico con navaja', src: corteAfeitadoClasico, width: 1755, height: 2340, focus: 'center 38%' },
  { label: 'French crop', barber: 'Azedin', alt: 'French crop con degradado', src: corteArregloBarba, width: 1179, height: 2556, focus: 'center 30%' },
  { label: 'Mid Fade clásico', barber: 'Azedin', alt: 'Mid fade degradado medio', src: corteMidFade, width: 1440, height: 1800, focus: 'center 30%' },
  { label: 'Skin Fade', barber: 'Azedin', alt: 'Skin fade degradado', src: corteSkinFade, width: 1179, height: 2071, focus: 'center 30%' },
];

export const shopImages = {
  // Sharpest interior on disk: a real cut on the marble, 4032×3024.
  salon: {
    src: salonEnCorte,
    width: 4032,
    height: 3024,
    alt: 'Corte en el salón de Berja: suelo de mármol negro y pared de lamas de roble',
  },
};
