import React, { useState, useEffect } from 'react';

/**
 * MobileNav — Fullscreen overlay panel.
 *
 * Slides in from the right: translateX(100%) → translateX(0)
 * Uses --ease-drawer (iOS-like curve) per Emil Kowalski.
 * Links stagger via inline animation-delay.
 * Logo displayed at top of panel.
 * Backdrop: blur + dark.
 */

const anchors = [
  { href: '#lookbook',  label: 'Lookbook'  },
  { href: '#servicios', label: 'Servicios' },
  { href: '#reseñas',   label: 'Reseñas'   },
  { href: '#ubicacion', label: 'Ubicación' },
];

export default function MobileNav({ logoSrc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [panelReady, setPanelReady] = useState(false);

  // Listen for nav:open
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('nav:open', handleOpen);
    return () => window.removeEventListener('nav:open', handleOpen);
  }, []);

  // Escape + body scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    // Stagger trigger after panel enters
    const t = setTimeout(() => setPanelReady(true), 50);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      clearTimeout(t);
    };
  }, [isOpen]);

  const close = () => {
    setPanelReady(false);
    setIsOpen(false);
  };

  const handleAnchor = () => close();

  return (
    <div
      className="fixed inset-0 z-[300] pointer-events-none"
      style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(12,10,9,0.92)',
          backdropFilter: 'blur(12px)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 250ms cubic-bezier(0.23, 1, 0.32, 1)',
        }}
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className="absolute inset-0 flex flex-col"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 320ms cubic-bezier(0.32, 0.72, 0, 1)',
          backgroundColor: 'transparent',
        }}
      >
        {/* Header: Logo + Close */}
        <div className="flex items-center justify-between px-6 h-[68px]">
          {logoSrc && (
            <img
              src={logoSrc}
              alt="Azedin Barber"
              style={{
                width: '100px',
                height: 'auto',
                filter: 'invert(1)',
                mixBlendMode: 'screen',
                opacity: 0.94,
              }}
            />
          )}
          <button
            onClick={close}
            aria-label="Cerrar menú"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-ink-dim)',
              fontSize: '1.3rem',
              padding: '0.5rem',
              lineHeight: 1,
              transition: 'color 150ms ease-out',
            }}
          >
            ✕
          </button>
        </div>

        {/* Nav links — centered, staggered */}
        <nav
          className="flex-1 flex flex-col items-center justify-center gap-2"
          aria-label="Navegación principal"
        >
          {anchors.map((a, i) => (
            <a
              key={a.href}
              href={a.href}
              onClick={handleAnchor}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                fontWeight: '700',
                color: 'var(--color-cream)',
                textDecoration: 'none',
                letterSpacing: '-0.02em',
                lineHeight: '1.1',
                paddingLeft: '1rem',
                opacity: panelReady ? 1 : 0,
                transform: panelReady ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 350ms cubic-bezier(0.23, 1, 0.32, 1) ${80 + i * 60}ms, transform 350ms cubic-bezier(0.23, 1, 0.32, 1) ${80 + i * 60}ms, color 150ms ease-out`,
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-oak)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-cream)'}
            >
              {a.label}
            </a>
          ))}
        </nav>

        {/* CTA bottom */}
        <div
          className="px-6 pb-12 flex flex-col gap-3"
          style={{
            opacity: panelReady ? 1 : 0,
            transform: panelReady ? 'translateY(0)' : 'translateY(16px)',
            transition: `opacity 350ms cubic-bezier(0.23, 1, 0.32, 1) 360ms, transform 350ms cubic-bezier(0.23, 1, 0.32, 1) 360ms`,
          }}
        >
          <div
            style={{
              width: '100%',
              height: '1px',
              background: 'var(--color-border)',
              marginBottom: '1.25rem',
            }}
          />
          <button
            onClick={() => { close(); window.dispatchEvent(new CustomEvent('book:open')); }}
            className="btn-oak"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem' }}
            aria-label="Reservar cita en Booksy"
          >
            Reservar cita
          </button>
        </div>
      </div>
    </div>
  );
}
