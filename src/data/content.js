export const services = [
  { name: 'Corte de pelo', price: '13€', time: '30 min' },
  { name: 'Corte & Barba', price: '17€', time: '30 min' },
  { name: 'Rapado & Barba', price: '15€', time: '30 min' },
  { name: 'Arreglo de Barba', price: '8€', time: '30 min' },
];

export const galleryItems = [
  {
    style: 'fade',
    label: 'Skin Fade',
    barber: 'Azedin',
    img: 'https://images.pexels.com/photos/2035227/pexels-photo-2035227.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop',
    alt: 'Barbero cortando el pelo a un cliente sentado',
  },
  {
    style: 'beard',
    label: 'Beard Sculpt',
    barber: 'Samir',
    img: 'https://images.pexels.com/photos/2014808/pexels-photo-2014808.jpeg?auto=compress&cs=tinysrgb&w=700&h=700&fit=crop',
    alt: 'Barbero de pie perfilando la barba de un cliente',
  },
  {
    style: 'crop',
    label: 'Crop Top',
    barber: 'Azedin',
    img: 'https://images.pexels.com/photos/331989/pexels-photo-331989.jpeg?auto=compress&cs=tinysrgb&w=700&h=700&fit=crop',
    alt: 'Barbero de pie cortando el pelo en salón moderno',
  },
  {
    style: 'fade',
    label: 'Low Fade',
    barber: 'Samir',
    img: 'https://images.pexels.com/photos/4952625/pexels-photo-4952625.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop',
    alt: 'Barbero con tatuajes cortando el pelo de pie',
  },
  {
    style: 'beard',
    label: 'Afeitado Clásico',
    barber: 'Azedin',
    img: 'https://images.pexels.com/photos/2809652/pexels-photo-2809652.jpeg?auto=compress&cs=tinysrgb&w=700&h=700&fit=crop',
    alt: 'Barbero afeitando con navaja a un cliente',
  },
  {
    style: 'crop',
    label: 'Textured Crop',
    barber: 'Samir',
    img: 'https://images.pexels.com/photos/2076930/pexels-photo-2076930.jpeg?auto=compress&cs=tinysrgb&w=700&h=700&fit=crop',
    alt: 'Barbero de pie cortando el pelo con tijera',
  },
  {
    style: 'fade',
    label: 'Mid Fade',
    barber: 'Azedin',
    img: 'https://images.pexels.com/photos/1836983/pexels-photo-1836983.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop',
    alt: 'Barbero de pie estilizando el pelo de un cliente',
  },
];

// Nombres reales pendientes: Booksy no publica el nombre del cliente junto a la reseña.
// Sustituye "Cliente verificado · Booksy" por el nombre real en cuanto lo tengas.
export const reviews = [
  { quote: 'Para mí es el mejor peluquero de Almería, por eso vuelvo siempre.', service: 'Corte de pelo', barber: 'Azedin' },
  { quote: 'Servicio estupendo y muy atento conmigo. Si vienes, no querrás cortarte el pelo en otro sitio.', service: 'Corte & Barba', barber: 'Azedin' },
  { quote: 'Lo que más valoro es lo cómodo que es pedir cita desde la app, a cualquier hora.', service: 'Corte de pelo', barber: 'Samir' },
  { quote: 'Buen servicio y mejor persona.', service: 'Corte de pelo', barber: 'Samir' },
  { quote: 'Con la máquina es un máquina de verdad, hay que verlo en persona.', service: 'Corte & Barba', barber: 'Azedin' },
  { quote: 'Cada vez que voy, la misma profesionalidad de siempre.', service: 'Arreglo de barba', barber: 'Azedin' },
];

export const business = {
  name: 'Azedin Barber',
  address: 'Avenida José Barrionuevo Peña 14, 04760, Berja, Almería',
  rating: '5.0',
  reviewCount: '87+ reseñas verificadas en Booksy',
  booksyUrl: 'https://booksy.com/es-es/141862_azedin-barber_barberia_26195_castala',
  instagramUrl: 'https://www.instagram.com/azedinbarber/',
  hours: [
    { day: 'Lunes', time: '15:30 – 20:30' },
    { day: 'Martes – Sábado', time: '10:00–14:00 · 16:00–20:00' },
    { day: 'Domingo', time: 'Cerrado' },
  ],
};
