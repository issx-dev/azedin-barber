import React, { useState, useEffect, useRef } from 'react';

/**
 * BookingModal — Barber selection + Booksy redirect.
 *
 * - Names from content.js via props (not hardcoded)
 * - Rectangular CTA (editorial, not pill)
 * - CSS-driven transitions and hover events (no inline DOM mutations)
 */

export default function BookingModal({ booksyUrl, barbers = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState('Azedin');

  const closeRef = useRef(null);
  const triggerRef = useRef(null);
  // Listen for book:open event
  useEffect(() => {
    const handleOpen = (e) => {
      setIsOpen(true);
      if (e.detail?.barber && barbers.some(b => b.name === e.detail.barber)) {
        setSelectedBarber(e.detail.barber);
      }
    };
    window.addEventListener('book:open', handleOpen);
    return () => window.removeEventListener('book:open', handleOpen);
  }, [barbers]);

  // Escape key + Body Scroll Lock + Focus Trap
  useEffect(() => {
    if (!isOpen) {
      triggerRef.current?.focus();
      return;
    }
    
    triggerRef.current = document.activeElement;
    setTimeout(() => closeRef.current?.focus(), 0);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'Tab') {
        const modalElement = document.querySelector('.modal-content');
        if (!modalElement) return;
        const focusable = Array.from(modalElement.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Reservar cita"
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
      style={{ backgroundColor: 'rgba(12,10,9,0.88)', backdropFilter: 'blur(16px)' }}
    >
      <div
        aria-labelledby="booking-modal-heading"
        className="w-full max-w-[400px] sm:max-w-[460px] relative p-6 sm:p-9 modal-content shadow-2xl"
        style={{
          backgroundColor: '#0C0A09',
          border: '1px solid rgba(138, 149, 165, 0.2)',
          borderRadius: '4px',
        }}
      >
        {/* Top subtle oak accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-oak to-transparent opacity-80" />

        {/* Close button */}
        <button
          ref={closeRef}
          onClick={() => setIsOpen(false)}
          aria-label="Cerrar"
          className="modal-close-btn"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-steel)',
            fontSize: '1.25rem',
            lineHeight: '1',
            padding: '0.25rem',
            transition: 'color 180ms ease-out',
          }}
        >
          ✕
        </button>

        {/* Heading */}
        <h3
          id="booking-modal-heading"
          className="font-display text-cream font-bold leading-none mb-2 text-2xl sm:text-3xl tracking-tight uppercase"
        >
          Reserva tu cita
        </h3>
        <p className="text-steel text-[12px] sm:text-[13px] leading-relaxed mb-6 tracking-wide">
          Elige a tu barbero para abrir Booksy en tu horario.
        </p>

        {/* Barber selector grid */}
        <div
          className="grid grid-cols-2 gap-3 mb-6"
          role="group"
          aria-label="Elegir barbero"
        >
          {barbers.map((barber) => {
            const isSelected = selectedBarber === barber.name;
            const role = barber.name === 'Azedin' ? 'FUNDADOR' : 'ESPECIALISTA';

            return (
              <button
                key={barber.name}
                onClick={() => setSelectedBarber(barber.name)}
                aria-pressed={isSelected}
                className={`flex flex-col items-center py-5 px-3 rounded-sm barber-option-btn transition-all duration-200 ${isSelected ? 'selected' : ''}`}
                style={{
                  background: isSelected ? '#151210' : 'rgba(21, 18, 16, 0.5)',
                  border: `1px solid ${isSelected ? 'var(--color-oak)' : 'rgba(138, 149, 165, 0.18)'}`,
                  cursor: 'pointer',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {/* Avatar Thumbnail with B&W -> Color filter */}
                <div
                  className="w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden mb-3 transition-all duration-300 border"
                  style={{
                    borderColor: isSelected ? 'var(--color-oak)' : 'rgba(138, 149, 165, 0.25)',
                    boxShadow: isSelected ? '0 0 16px rgba(194, 147, 103, 0.25)' : 'none',
                  }}
                >
                  <img
                    src={barber.img}
                    alt={barber.name}
                    className="w-full h-full object-cover transition-all duration-300"
                    style={{
                      filter: isSelected
                        ? 'grayscale(0%) saturate(0.9) contrast(1.05)'
                        : 'grayscale(100%) brightness(0.8)',
                    }}
                  />
                </div>

                {/* Barber Name */}
                <span
                  className="font-display text-[14px] sm:text-[15px] font-bold tracking-wider uppercase transition-colors duration-180 mb-0.5"
                  style={{
                    color: isSelected ? 'var(--color-cream)' : 'var(--color-steel)',
                  }}
                >
                  {barber.name}
                </span>

                {/* Role badge */}
                <span
                  className="text-[9px] font-mono tracking-widest uppercase"
                  style={{
                    color: isSelected ? 'var(--color-oak)' : 'rgba(138, 149, 165, 0.6)',
                  }}
                >
                  {role}
                </span>
              </button>
            );
          })}
        </div>

        {/* CTA — Booksy redirect */}
        <a
          href={booksyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-oak w-full flex items-center justify-center gap-2 py-3.5 text-[11px] font-semibold tracking-[0.18em] uppercase rounded-sm shadow-lg transition-transform"
          aria-label={`Continuar en Booksy para reservar con ${selectedBarber}`}
        >
          <span>CONTINUAR EN BOOKSY</span>
          <span className="text-base font-normal">›</span>
        </a>

        {/* Disclaimer */}
        <p className="mt-3.5 text-[11px] text-steel/60 text-center tracking-wide">
          Se abrirá la agenda de Booksy en una nueva pestaña
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .modal-backdrop {
          animation: fadeIn 200ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .modal-content {
          animation: scaleUp 220ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .modal-close-btn:hover {
          color: var(--color-cream) !important;
        }
        .barber-option-btn:not(.selected):hover {
          border-color: rgba(138, 149, 165, 0.4) !important;
          background: rgba(21, 18, 16, 0.8) !important;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.96) translateY(8px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
}
