'use client'

import { ReactNode } from 'react'
import '@/app/space/theme/space-theme.css'

interface SpaceHeroOverlayProps {
  children?: ReactNode
  title?: string
  subtitle?: string
  titleAr?: string
  className?: string
  variant?: 'default' | 'minimal' | 'cinematic'
}

export default function SpaceHeroOverlay({
  children,
  title,
  subtitle,
  titleAr,
  className = '',
  variant = 'cinematic',
}: SpaceHeroOverlayProps) {
  const overlayClasses = {
    default: 'space-hero-default',
    minimal: 'space-hero-minimal',
    cinematic: 'space-hero-cinematic',
  }

  return (
    <section className={`space-hero-overlay ${overlayClasses[variant]} ${className}`}>
      {/* Cinematic Gradient Overlay */}
      <div className="space-hero-gradient" />
      
      {/* Vignette Effect */}
      <div className="space-hero-vignette" />
      
      {/* Content */}
      <div className="space-hero-content relative z-10">
        {(title || titleAr) && (
          <div className="space-hero-header mb-8 animate-fade-in">
            {title && (
              <h1 className="space-hero-title space-text-gradient space-heading-glow">
                {title}
              </h1>
            )}
            {titleAr && (
              <p className="space-hero-title-ar space-text-gradient space-heading-glow">
                {titleAr}
              </p>
            )}
            {subtitle && (
              <p className="space-hero-subtitle">
                {subtitle}
              </p>
            )}
            <div className="space-hero-divider" />
          </div>
        )}
        {children}
      </div>

      <style jsx>{`
        .space-hero-overlay {
          position: relative;
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6rem 1rem 4rem;
          overflow: hidden;
        }

        .space-hero-cinematic {
          background: linear-gradient(
            to bottom,
            var(--space-bg-deep) 0%,
            var(--space-bg-dark) 30%,
            var(--space-bg-deeper) 60%,
            transparent 100%
          );
        }

        .space-hero-default {
          background: linear-gradient(
            to bottom,
            var(--space-bg-dark) 0%,
            transparent 100%
          );
        }

        .space-hero-minimal {
          background: transparent;
        }

        .space-hero-gradient {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 20%, var(--space-fog-medium) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }

        .space-hero-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            transparent 0%,
            transparent 40%,
            rgba(0, 0, 0, 0.4) 100%
          );
          pointer-events: none;
          z-index: 2;
        }

        .space-hero-content {
          max-width: 1200px;
          width: 100%;
          text-align: center;
        }

        .space-hero-header {
          margin-bottom: 2rem;
        }

        .space-hero-title {
          font-size: clamp(3rem, 8vw, 7rem);
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.1;
        }

        .space-hero-title-ar {
          font-size: clamp(2rem, 6vw, 4rem);
          font-weight: 600;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .space-hero-subtitle {
          font-size: clamp(1.25rem, 3vw, 2rem);
          color: var(--space-text-secondary);
          font-weight: 300;
          margin-bottom: 1.5rem;
        }

        .space-hero-divider {
          width: 8rem;
          height: 2px;
          margin: 1.5rem auto 0;
          background: linear-gradient(
            to right,
            transparent,
            var(--space-purple),
            var(--space-blue),
            transparent
          );
          border-radius: 2px;
        }

        .space-heading-glow {
          filter: drop-shadow(0 0 20px var(--space-glow-purple));
          animation: spaceTitleGlow 3s ease-in-out infinite;
        }

        @keyframes spaceTitleGlow {
          0%, 100% {
            filter: drop-shadow(0 0 20px var(--space-glow-purple));
          }
          50% {
            filter: drop-shadow(0 0 40px var(--space-glow-intense));
          }
        }

        @media (max-width: 768px) {
          .space-hero-overlay {
            min-height: 50vh;
            padding: 4rem 1rem 3rem;
          }
        }
      `}</style>
    </section>
  )
}
