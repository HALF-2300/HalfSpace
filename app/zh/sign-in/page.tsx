'use client'

import { SignIn } from '@clerk/nextjs'
import AuthNotConfigured from '@/components/AuthNotConfigured'
import { isClerkEnabled } from '@/lib/clerkConfig'

export default function SignInPageZh() {
  if (!isClerkEnabled()) {
    return (
      <AuthNotConfigured
        title="暂时无法登录"
        body="此部署尚未配置身份验证。"
      />
    )
  }
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">登录 HalfSPACE 帐号</h1>
          <p className="text-sm text-gray-400">
            使用电子邮箱或第三方账户登录，继续你的宇宙之旅。
          </p>
        </div>
        <SignIn
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

