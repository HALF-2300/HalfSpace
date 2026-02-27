'use client'

import '@/app/space/theme/space-theme.css'

interface SpaceSectionSeparatorProps {
  variant?: 'subtle' | 'glow' | 'gradient' | 'stars'
  className?: string
}

export default function SpaceSectionSeparator({
  variant = 'subtle',
  className = '',
}: SpaceSectionSeparatorProps) {
  const variants = {
    subtle: 'space-separator-subtle',
    glow: 'space-separator-glow',
    gradient: 'space-separator-gradient',
    stars: 'space-separator-stars',
  }

  return (
    <div className={`space-section-separator ${variants[variant]} ${className}`}>
      {variant === 'stars' && (
        <div className="space-separator-stars-container">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="space-separator-star"
              style={{
                left: `${20 + i * 20}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              ✦
            </span>
          ))}
        </div>
      )}
      <style jsx>{`
        .space-section-separator {
          position: relative;
          width: 100%;
          height: 1px;
          margin: var(--space-spacing-2xl) 0;
          overflow: hidden;
        }

        .space-separator-subtle {
          background: linear-gradient(
            to right,
            transparent,
            var(--space-border-color),
            transparent
          );
        }

        .space-separator-glow {
          background: linear-gradient(
            to right,
            transparent,
            var(--space-purple),
            var(--space-blue),
            transparent
          );
          height: 2px;
          box-shadow: 
            0 0 10px var(--space-glow-purple),
            0 0 20px var(--space-glow-soft);
        }

        .space-separator-gradient {
          height: 3px;
          background: linear-gradient(
            to right,
            transparent,
            var(--space-purple) 20%,
            var(--space-blue) 50%,
            var(--space-pink) 80%,
            transparent
          );
          border-radius: 2px;
        }

        .space-separator-stars {
          height: 60px;
          background: transparent;
        }

        .space-separator-stars-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .space-separator-star {
          position: absolute;
          font-size: 1.5rem;
          color: var(--space-purple);
          opacity: 0.6;
          animation: spaceStarTwinkle 2s ease-in-out infinite;
          filter: drop-shadow(0 0 4px var(--space-glow-purple));
        }

        @keyframes spaceStarTwinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .space-separator-stars::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 30%;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--space-border-color));
          transform: translateY(-50%);
        }

        .space-separator-stars::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          width: 30%;
          height: 1px;
          background: linear-gradient(to left, transparent, var(--space-border-color));
          transform: translateY(-50%);
        }
      `}</style>
    </div>
  )
}
