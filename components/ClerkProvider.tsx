'use client'

import { ClerkProvider as ClerkProviderBase } from '@clerk/nextjs'
import { getClerkPublishableKey } from '@/lib/clerkConfig'

const publishableKey = getClerkPublishableKey()

/**
 * Wraps the app with Clerk when NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set.
 * If the key is missing, children render without auth (no sign-in/sign-up).
 */
export default function ClerkProvider({ children }: { children: React.ReactNode }) {
  if (!publishableKey) {
    return <>{children}</>
  }

  return (
    <ClerkProviderBase
      publishableKey={publishableKey}
      afterSignInUrl="/"
      afterSignUpUrl="/"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      {children}
    </ClerkProviderBase>
  )
}
