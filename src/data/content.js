import corteSkinFade from '../assets/img/corte-skin-fade-degradado.jpeg';
import corteArregloBarba from '../assets/img/corte-arreglo-barba-perfilado.jpeg';
import corteCropTop from '../assets/img/corte-crop-top-texturizado.jpeg';
import corteLowFade from '../assets/img/corte-low-fade-degradado-bajo.jpeg';
import corteAfeitadoClasico from '../assets/img/corte-afeitado-clasico-navaja.jpeg';
import corteMidFade from '../assets/img/corte-mid-fade-degradado-medio.jpeg';
import barberiaInteriorSalon from '../assets/img/barberia-interior-salon.jpeg';
import barberiaInteriorRecepcion from '../assets/img/barberia-interior-recepcion.jpeg';
import personaAzedin from '../assets/img/barbero-azedin-berja.jpeg';
import personaSamir from '../assets/img/barbero-samir-berja.jpeg';

export const services = [
  { name: 'Corte de pelo', price: '13€', time: '30 min' },
  { name: 'Corte & Barba', price: '17€', time: '30 min' },
  { name: 'Rapado & Barba', price: '15€', time: '30 min' },
  { name: 'Arreglo de Barba', price: '8€', time: '30 min' },
];

export const galleryItems = [
  // focus = object-position: where the haircut sits in the photo
  { area: 'tall', label: 'Skin Fade',        barber: 'Azedin', alt: 'Skin fade corte degradado',      src: corteSkinFade, width: 1179, height: 2071, focus: 'center 30%' },
  { area: 'sq',   label: 'Beard Sculpt',     barber: 'Samir',  alt: 'Escultura de barba profesional', src: corteArregloBarba, width: 1179, height: 2556, focus: 'center 28%' },
  { area: 'sq',   label: 'Crop Top',         barber: 'Azedin', alt: 'Crop top texturizado',           src: corteCropTop, width: 1755, height: 2340, focus: 'center 30%' },
  { area: 'sq',   label: 'Low Fade',         barber: 'Samir',  alt: 'Low fade degradado bajo',        src: corteLowFade, width: 1755, height: 2340, focus: 'center 35%' },
  { area: 'tall', label: 'Afeitado Clásico', barber: 'Azedin', alt: 'Afeitado clásico con navaja',   src: corteAfeitadoClasico, width: 1755, height: 2340, focus: 'center 38%' },
  { area: 'sq',   label: 'Mid Fade',         barber: 'Azedin', alt: 'Mid fade degradado medio',       src: corteMidFade, width: 1440, height: 1800, focus: 'center 30%' },
  { area: 'sq',   label: 'Taper Fade',       barber: 'Samir',  alt: 'Taper fade degradado en sien',   src: corteLowFade, width: 1755, height: 2340, focus: 'center 35%' },
  { area: 'tall', label: 'Buzz Cut',         barber: 'Azedin', alt: 'Corte rapado con máquina',       src: corteAfeitadoClasico, width: 1755, height: 2340, focus: 'center 38%' },
  { area: 'sq',   label: 'Line Up',          barber: 'Samir',  alt: 'Perfilado de línea frontal',     src: corteSkinFade, width: 1179, height: 2071, focus: 'center 30%' },
  { area: 'sq',   label: 'Pompadour',        barber: 'Azedin', alt: 'Pompadour clásico',              src: corteArregloBarba, width: 1179, height: 2556, focus: 'center 28%' },
  { area: 'sq',   label: 'Fade & Design',    barber: 'Samir',  alt: 'Fade con diseño artístico',      src: corteCropTop, width: 1755, height: 2340, focus: 'center 30%' },
];

export const barberImgs = {
  Azedin: { src: personaAzedin, width: 320, height: 320 },
  Samir: { src: personaSamir, width: 320, height: 320 },
};

export const reviews = [
  { quote: 'Me ha cortado el pelo Samir, es muy profesional y estoy súper contento, me ha dejado muy muy bien. Consiguieron un nuevo cliente.', service: 'Corte de pelo', barber: 'Samir' },
  { quote: 'Todo perfecto, como siempre un trato excepcional.', service: 'Corte & Barba', barber: 'Azedin' },
  { quote: 'El mejor peluquero de Almería con diferencia. Por eso voy siempre allí.', service: 'Corte de pelo', barber: 'Azedin' },
  { quote: 'Atención inmejorable. Un corte precioso. ¡Sois los mejores!', service: 'Corte niño', barber: 'Azedin' },
  { quote: 'Un servicio estupendo y muy servicial. Si vienes, no dejarás de cortarte el pelo aquí, son los mejores.', service: 'Corte de pelo', barber: 'Azedin' },
  { quote: 'Muy buena mano con el corte de pelo y barba. Recomendable 100%.', service: 'Corte & Barba', barber: 'Samir' },
];

export const business = {
  name: 'Azedin Barber',
  address: 'Avenida José Barrionuevo Peña 14, 04760, Berja, Almería',
  tagline: 'Berja · Almería · Sin dos cortes iguales',
  rating: '5.0',
  reviewCount: '142 opiniones en Booksy',
  booksyUrl: 'https://booksy.com/es-es/141862_azedin-barber_barberia_26195_castala',
  instagramUrl: 'https://www.instagram.com/azedinbarber/',
  tiktokUrl: 'https://www.tiktok.com/@azedin.barber',
  hours: [
    { day: 'Lunes', time: '15:30 – 20:30' },
    { day: 'Martes – Sábado', time: '10:00–14:00 · 16:00–20:00' },
    { day: 'Domingo', time: 'Cerrado' },
  ],
};
