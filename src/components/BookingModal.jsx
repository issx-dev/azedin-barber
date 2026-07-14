import React, { useState, useEffect } from 'react';

export default function BookingModal({ booksyUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState('Azedin');

  useEffect(() => {
    const handleOpen = (e) => {
      setIsOpen(true);
      if (e.detail?.barber) setSelectedBarber(e.detail.barber);
    };
    window.addEventListener('book:open', handleOpen);
    return () => window.removeEventListener('book:open', handleOpen);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-sm p-5"
      onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-[440px] bg-surface border border-border p-10 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-[18px] cursor-pointer text-ink-dim text-xl bg-transparent border-none hover:text-gold"
          aria-label="Close"
        >
          ✕
        </button>
        <h3 className="font-syne text-2xl mb-2">Reserva tu cita</h3>
        <p className="text-ink-dim text-[13px] mb-7">
          Elige barbero y te llevamos directo a Booksy para confirmar hora.
        </p>
        <div className="flex gap-2.5 mb-7">
          {['Azedin', 'Samir'].map((name) => (
            <button
              key={name}
              onClick={() => setSelectedBarber(name)}
              className={`flex-1 py-4 px-2.5 text-center border text-[13px] font-bold uppercase tracking-[0.06em] cursor-pointer transition-colors ${
                selectedBarber === name
                  ? 'border-gold text-gold'
                  : 'border-border text-ink-dim'
              } bg-transparent`}
            >
              {name}
            </button>
          ))}
        </div>
        <a
          href={booksyUrl}
          target="_blank"
          rel="noopener"
          className="flex w-full justify-center py-4 px-5 bg-gold border border-gold text-dark-bg font-bold uppercase tracking-[0.14em] text-xs hover:bg-gold-hi hover:border-gold-hi hover:text-black transition-colors"
        >
          Continuar en Booksy →
        </a>
      </div>
    </div>
  );
}
