'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { isClerkEnabled } from '@/lib/clerkConfig'

const hasClerk = isClerkEnabled()

function useAuthLocale() {
  const pathname = usePathname()
  const isAr = pathname?.startsWith('/ar')

  const base = isAr ? '/ar' : ''

  const labels = {
    signIn: isAr ? 'تسجيل الدخول' : 'Sign in',
    signUp: isAr ? 'إنشاء حساب' : 'Create account',
    profile: isAr ? 'الملف الشخصي' : 'Profile',
  }

  return { base, labels }
}

export default function AuthNav() {
  const { base, labels } = useAuthLocale()

  const signInHref = base ? `${base}/sign-in` : '/sign-in'
  const signUpHref = base ? `${base}/sign-up` : '/sign-up'
  const profileHref = base ? `${base}/profile` : '/profile'

  if (!hasClerk) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href={signInHref}
          className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-purple-500/20"
        >
          {labels.signIn}
        </Link>
        <Link
          href={signUpHref}
          className="px-3 py-2 rounded-lg text-sm font-medium bg-purple-500/30 text-white hover:bg-purple-500/50"
        >
          {labels.signUp}
        </Link>
      </div>
    )
  }

  return (
    <>
      <SignedOut>
        <div className="flex items-center gap-2">
          <Link
            href={signInHref}
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-purple-500/20"
          >
            {labels.signIn}
          </Link>
          <Link
            href={signUpHref}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-purple-500/30 text-white hover:bg-purple-500/50"
          >
            {labels.signUp}
          </Link>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-2">
          <Link
            href={profileHref}
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-purple-500/20"
          >
            {labels.profile}
          </Link>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9 ring-2 ring-purple-500/50',
              },
            }}
          />
        </div>
      </SignedIn>
    </>
  )
}

