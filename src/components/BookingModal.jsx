import React, { useState, useEffect } from 'react';

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

  // Set default selected barber once barbers prop loads
  useEffect(() => {
    if (barbers.length > 0 && !selectedBarber) {
      setSelectedBarber(barbers[0].name);
    }
  }, [barbers]);

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

  // Escape key + Body Scroll Lock
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
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
      className="fixed inset-0 z-[500] flex items-center justify-center p-5 modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
      style={{ backgroundColor: 'rgba(12,10,9,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-[420px] sm:max-w-[500px] relative p-8 sm:p-12 modal-content"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-hi)',
          borderRadius: '4px',
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Cerrar"
          className="modal-close-btn"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1.125rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-ink-faint)',
            fontSize: '1.2rem',
            lineHeight: '1',
            padding: '0.25rem',
            transition: 'color 150ms ease-out',
          }}
        >
          ✕
        </button>

        {/* Heading */}
        <h3
          className="font-display text-cream font-bold leading-none mb-2 text-[1.6rem] sm:text-[2.1rem] tracking-tight"
        >
          Reserva tu cita
        </h3>
        <p className="text-ink-dim text-[0.8rem] sm:text-[0.9rem] leading-relaxed mb-8">
          Elige barbero y abrimos Booksy directamente en tu horario.
        </p>

        {/* Barber selector */}
        <div
          className="flex gap-3 mb-8"
          role="group"
          aria-label="Elegir barbero"
        >
          {barbers.map((barber) => {
            const isSelected = selectedBarber === barber.name;
            return (
              <button
                key={barber.name}
                onClick={() => setSelectedBarber(barber.name)}
                aria-pressed={isSelected}
                className={`flex-1 flex flex-col items-center py-5 sm:py-7 px-2 barber-option-btn ${isSelected ? 'selected' : ''}`}
                style={{
                  background: isSelected ? 'rgba(196,149,106,0.1)' : 'transparent',
                  border: `1px solid ${isSelected ? 'var(--color-oak)' : 'var(--color-border-hi)'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background 180ms ease-out, border-color 180ms ease-out, transform 160ms ease-out',
                }}
              >
                {/* Barber Avatar Thumbnail */}
                <div
                  className="w-[60px] h-[60px] sm:w-[76px] sm:h-[76px] rounded-full overflow-hidden mb-3 transition-all duration-180 barber-avatar-container"
                  style={{
                    border: `2px solid ${isSelected ? 'var(--color-oak)' : 'transparent'}`,
                    boxShadow: isSelected ? '0 0 15px rgba(196,149,106,0.25)' : 'none',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  <img
                    src={barber.img}
                    alt={barber.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>

                {/* Barber Name */}
                <span
                  className="font-body text-[0.7rem] sm:text-[0.78rem] font-semibold tracking-wider uppercase transition-colors duration-180 barber-name"
                  style={{
                    color: isSelected ? 'var(--color-oak)' : 'var(--color-ink-dim)',
                  }}
                >
                  {barber.name}
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
          className="btn-oak"
          style={{ width: '100%', justifyContent: 'center', display: 'flex' }}
          aria-label={`Continuar en Booksy para reservar con ${selectedBarber}`}
        >
          Continuar en Booksy
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: '0.5rem' }} aria-hidden="true">
            <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>

        {/* Disclaimer */}
        <p className="mt-4 text-[0.68rem] text-ink-faint text-center leading-relaxed">
          Se abrirá Booksy en una nueva pestaña
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
          border-color: var(--color-oak-dim) !important;
        }
        .barber-option-btn:active {
          transform: scale(0.97);
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
