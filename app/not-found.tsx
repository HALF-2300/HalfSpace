import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full glass rounded-3xl border border-purple-500/30 p-8 text-center space-y-4">
        <div className="text-4xl" aria-hidden>
          🔍
        </div>
        <h1 className="text-3xl font-bold text-white">404 - Page Not Found</h1>
        <p className="text-gray-200">
          The page you're looking for doesn't exist in this universe.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-purple-400/60 text-purple-100 hover:border-purple-300 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/space"
            className="px-4 py-2 rounded-lg border border-blue-400/60 text-blue-100 hover:border-blue-300 transition-colors"
          >
            Explore Space
          </Link>
        </div>
      </div>
    </div>
  )
}
