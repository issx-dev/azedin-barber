import React, { useState } from 'react';

const filters = [
  { key: 'all', label: 'Todos' },
  { key: 'fade', label: 'Skin Fade' },
  { key: 'beard', label: 'Beard' },
  { key: 'crop', label: 'Crop Top' },
];

export default function Lookbook({ items }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const visibleItems = activeFilter === 'all'
    ? items
    : items.filter((item) => item.style === activeFilter);

  return (
    <section id="lookbook" className="py-[120px] px-[5vw]">
      <div className="flex justify-between items-end mb-14 gap-6 flex-wrap">
        <div>
          <div className="text-[11px] tracking-[0.22em] uppercase text-gold font-bold">
            Portfolio
          </div>
          <h2 className="font-syne text-[clamp(30px,4.2vw,54px)] font-extrabold tracking-[-0.02em] uppercase leading-[0.95]">
            Lookbook
          </h2>
        </div>
        <p className="max-w-[360px] text-ink-dim text-sm leading-relaxed">
          Cada corte, firmado. Filtra por estilo y reserva directamente sobre el trabajo que más te convence.
        </p>
      </div>

      <div className="flex gap-2.5 mb-10 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`py-[9px] px-[18px] border rounded-[20px] text-[11px] tracking-[0.1em] uppercase font-bold cursor-pointer transition-all bg-transparent ${
              activeFilter === f.key
                ? 'border-gold text-gold'
                : 'border-border text-ink-dim hover:border-gold hover:text-gold'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-3.5">
        {visibleItems.map((item, i) => (
          <div
            key={`${item.style}-${item.label}`}
            className={`relative border border-border overflow-hidden bg-gradient-to-br from-[#141414] to-[#0a0a0a] min-h-[180px] flex items-end justify-center transition-all duration-300 hover:-translate-y-1 hover:border-gold ${
              i % 4 === 0 ? 'row-span-2' : ''
            }`}
          >
            <img
              src={item.img}
              alt={item.alt}
              className="absolute inset-0 w-full h-full object-cover [filter:grayscale(80%)_contrast(1.1)_brightness(0.75)] transition-all duration-500 hover:scale-106 hover:[filter:grayscale(20%)_contrast(1.08)_brightness(0.85)]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/5" />
            <span className="absolute left-3.5 bottom-3 z-2 text-[11px] tracking-[0.05em] text-ink-dim">
              {item.label} · <b className="text-gold font-bold">{item.barber}</b>
            </span>
            <span className="absolute right-3 top-3 z-2 w-[30px] h-[30px] border border-border rounded-full flex items-center justify-center text-sm text-ink-dim opacity-0 transition-opacity hover:opacity-100 hover:border-gold hover:text-gold">
              ↗
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
