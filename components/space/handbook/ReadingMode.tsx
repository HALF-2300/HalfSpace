'use client'

interface ReadingModeProps {
  isActive: boolean
  onToggle: () => void
  lang?: 'en' | 'ar'
}

export default function ReadingMode({
  isActive,
  onToggle,
  lang = 'en',
}: ReadingModeProps) {
  return (
    <div className={`reading-mode-control ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      <button
        onClick={onToggle}
        className={`reading-mode-toggle ${isActive ? 'active' : ''}`}
        aria-pressed={isActive}
        type="button"
        aria-label={
          lang === 'ar'
            ? isActive
              ? 'إيقاف وضع القراءة'
              : 'تفعيل وضع القراءة'
            : isActive
            ? 'Disable reading mode'
            : 'Enable reading mode'
        }
        title={lang === 'ar' ? 'وضع القراءة' : 'Reading mode'}
      >
        <span className="reading-mode-icon">📖</span>
        <span className="reading-mode-text">
          {lang === 'ar'
            ? isActive
              ? 'وضع القراءة: مفعّل'
              : 'وضع القراءة: معطّل'
            : isActive
            ? 'Reading Mode: ON'
            : 'Reading Mode: OFF'}
        </span>
      </button>
      <style jsx>{`
        .reading-mode-control {
          position: fixed;
          top: 20px;
          z-index: 200;
        }

        .reading-mode-control.rtl {
          left: 20px;
          right: auto;
        }

        .reading-mode-control.ltr {
          right: 20px;
          left: auto;
        }

        .reading-mode-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(10, 14, 39, 0.95);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          color: #e5e7eb;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .reading-mode-toggle:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.5);
          transform: scale(1.05);
        }

        .reading-mode-toggle.active {
          background: rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
          box-shadow: 0 0 16px rgba(139, 92, 246, 0.4);
        }

        .reading-mode-icon {
          font-size: 20px;
        }

        .reading-mode-text {
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .reading-mode-control.rtl {
            left: 10px;
          }

          .reading-mode-control.ltr {
            right: 10px;
          }

          .reading-mode-text {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
