import React, { useState, useEffect } from 'react';

/**
 * BookingModal — Barber selection + Booksy redirect.
 *
 * - Names from content.js via props (not hardcoded)
 * - Entry animation: scale(0.96) opacity(0) → scale(1) opacity(1) — Emil: never scale(0)
 * - Escape key + backdrop click to close
 * - Rectangular CTA (editorial, not pill)
 * - Smooth 200ms ease-out transition
 */

export default function BookingModal({ booksyUrl, barbers = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState(barbers?.[0]?.name ?? 'Azedin');
  const [mounted, setMounted] = useState(false);

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

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Mount flag for CSS animation trigger
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Reservar cita"
      className="fixed inset-0 z-[500] flex items-center justify-center p-5"
      onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
      style={{ backgroundColor: 'rgba(12,10,9,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-[420px] sm:max-w-[500px] relative p-8 sm:p-12"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-hi)',
          borderRadius: '4px',
          // Emil: scale from 0.96, not 0 — combined opacity
          transform: mounted ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(8px)',
          opacity: mounted ? 1 : 0,
          transition: 'transform 200ms cubic-bezier(0.23, 1, 0.32, 1), opacity 200ms cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Cerrar"
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
          onMouseEnter={(e) => e.target.style.color = 'var(--color-cream)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--color-ink-faint)'}
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
                className="flex-1 flex flex-col items-center py-5 sm:py-7 px-2"
                style={{
                  background: isSelected ? 'rgba(196,149,106,0.1)' : 'transparent',
                  border: `1px solid ${isSelected ? 'var(--color-oak)' : 'var(--color-border-hi)'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background 180ms ease-out, border-color 180ms ease-out, transform 160ms ease-out',
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--color-oak-dim)'; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--color-border-hi)'; }}
              >
                {/* Barber Avatar Thumbnail */}
                <div
                  className="w-[60px] h-[60px] sm:w-[76px] sm:h-[76px] rounded-full overflow-hidden mb-3 transition-all duration-180"
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
                  className="font-body text-[0.7rem] sm:text-[0.78rem] font-semibold tracking-wider uppercase transition-colors duration-180"
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
    </div>
  );
}
