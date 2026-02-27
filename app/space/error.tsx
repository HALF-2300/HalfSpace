'use client'

interface SpaceErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function SpaceError({ error, reset }: SpaceErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full glass rounded-3xl border border-purple-500/30 p-8 text-center space-y-4">
        <div className="text-4xl" aria-hidden>
          🛡️
        </div>
        <h1 className="text-3xl font-bold text-white">Space page recovered</h1>
        <p className="text-gray-200">
          واجهنا خطأ غير متوقع أثناء تحميل تجربة الفضاء. تم تفعيل وضع الأمان للحفاظ على الصفحة دون انهيار.
        </p>
        {error?.message && <p className="text-sm text-purple-200/80">التفاصيل: {error.message}</p>}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-lg border border-purple-400/60 text-purple-100 hover:border-purple-300 transition-colors"
          >
            إعادة المحاولة
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg border border-blue-400/60 text-blue-100 hover:border-blue-300 transition-colors"
          >
            تحديث الصفحة
          </button>
        </div>
        {error?.digest && <p className="text-xs text-gray-400">ref: {error.digest}</p>}
      </div>
    </div>
  )
}
