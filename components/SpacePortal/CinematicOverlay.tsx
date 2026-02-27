'use client'

interface CinematicOverlayProps {
  intensity?: number
}

export default function CinematicOverlay({ intensity = 1 }: CinematicOverlayProps) {
  return (
    <>
      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, ${0.4 * intensity}) 100%)`,
        }}
      />

      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{
            background: `rgba(147, 51, 234, ${0.3 * intensity})`,
            animation: 'pulse-slow 4s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{
            background: `rgba(59, 130, 246, ${0.3 * intensity})`,
            animation: 'pulse-slow 4s ease-in-out infinite',
            animationDelay: '2s',
          }}
        />
      </div>

      {/* Section Separator Glow */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(147, 51, 234, ${0.5 * intensity}), transparent)`,
            boxShadow: `0 0 20px rgba(147, 51, 234, ${0.3 * intensity})`,
          }}
        />
      </div>
    </>
  )
}
