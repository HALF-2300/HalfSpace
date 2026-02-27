export default function AuthNotConfigured({
  title,
  body,
}: {
  title: string
  body: string
}) {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4">
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-purple-500/30 bg-space-dark/80 p-6 shadow-2xl">
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        <p className="text-sm leading-relaxed text-gray-300">{body}</p>
        <p className="text-xs text-gray-500">
          Tip: set <span className="font-mono">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</span> in your environment to enable
          sign-in/sign-up.
        </p>
      </div>
    </div>
  )
}

