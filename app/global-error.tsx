'use client'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-black">
          <div className="max-w-2xl w-full glass rounded-3xl border border-purple-500/30 p-8 text-center space-y-4">
            <div className="text-4xl" aria-hidden>
              🌌
            </div>
            <h1 className="text-3xl font-bold text-white">Global Error</h1>
            <p className="text-gray-200">
              A critical error occurred that affected the root layout. Please try refreshing the page.
            </p>
            {error?.message && <p className="text-sm text-purple-200/80">Details: {error.message}</p>}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => reset()}
                className="px-4 py-2 rounded-lg border border-purple-400/60 text-purple-100 hover:border-purple-300 transition-colors"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg border border-blue-400/60 text-blue-100 hover:border-blue-300 transition-colors"
              >
                Refresh page
              </button>
            </div>
            {error?.digest && <p className="text-xs text-gray-400">ref: {error.digest}</p>}
          </div>
        </div>
      </body>
    </html>
  )
}
