'use client'

import { SignUp } from '@clerk/nextjs'
import AuthNotConfigured from '@/components/AuthNotConfigured'
import { isClerkEnabled } from '@/lib/clerkConfig'

export default function SignUpPageAr() {
  if (!isClerkEnabled()) {
    return (
      <AuthNotConfigured
        title="إنشاء الحساب غير متاح حالياً"
        body="لم يتم إعداد نظام التسجيل لهذا النشر بعد."
      />
    )
  }
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">إنشاء حساب HalfSPACE</h1>
          <p className="text-sm text-gray-400">
            أنشئ حسابك خلال ثوانٍ واستمتع بتجارب كونية مخصّصة ورحلات يومية عبر الفضاء.
          </p>
        </div>
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
    </div>
  )
}

