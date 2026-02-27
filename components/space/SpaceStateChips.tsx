'use client'

type StateVariant = 'compact' | 'wide'

const states = [
  {
    key: 'loading',
    label: 'Loading',
    hint: 'نحضّر المحتوى بهدوء',
    tone: 'from-purple-500/20 to-blue-500/10 text-purple-100',
  },
  {
    key: 'empty',
    label: 'Empty',
    hint: 'لا شيء لعرضه الآن',
    tone: 'from-slate-500/20 to-slate-400/10 text-slate-100',
  },
  {
    key: 'error',
    label: 'Error',
    hint: 'حدث خلل بسيط – أعد المحاولة',
    tone: 'from-rose-500/20 to-orange-500/10 text-rose-100',
  },
]

export default function SpaceStateChips({ variant = 'compact' }: { variant?: StateVariant }) {
  return (
    <div
      className={
        variant === 'wide'
          ? 'grid gap-3 md:grid-cols-3'
          : 'flex flex-wrap items-center gap-2 text-xs md:text-sm'
      }
    >
      {states.map((state) => (
        <div
          key={state.key}
          className={`glass border border-white/10 bg-gradient-to-br ${state.tone} rounded-xl px-3 py-2 shadow-sm flex items-center gap-2`}
          aria-live="polite"
        >
          <span className="text-lg">{state.key === 'loading' ? '⏳' : state.key === 'empty' ? '📭' : '⚠️'}</span>
          <div className="leading-tight">
            <div className="font-semibold text-white">{state.label}</div>
            <p className="text-[11px] md:text-xs text-white/70">{state.hint}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
