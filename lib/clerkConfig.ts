export function getClerkPublishableKey(): string | null {
  const raw = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (!raw) return null
  const key = raw.trim()
  if (!key) return null
  // Common placeholder used in this codebase to "disable" Clerk.
  if (key.startsWith('pk_test_xxxx')) return null
  return key
}

export function isClerkEnabled(): boolean {
  return getClerkPublishableKey() !== null
}

