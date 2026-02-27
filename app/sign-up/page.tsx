'use client'

import { SignUp } from '@clerk/nextjs'
import AuthNotConfigured from '@/components/AuthNotConfigured'
import { isClerkEnabled } from '@/lib/clerkConfig'

export default function SignUpPage() {
  if (!isClerkEnabled()) {
    return (
      <AuthNotConfigured
        title="Sign-up is not available"
        body="Authentication is not configured for this deployment yet."
      />
    )
  }
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-space-dark/95 border border-purple-500/30 shadow-2xl',
          },
          variables: {
            colorPrimary: '#a855f7',
            colorBackground: 'rgba(10, 14, 39, 0.95)',
            colorText: '#e2e8f0',
            colorInputBackground: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '0.75rem',
          },
        }}
      />
    </div>
  )
}
