'use client'

import { SignUp } from '@clerk/nextjs'
import AuthNotConfigured from '@/components/AuthNotConfigured'
import { isClerkEnabled } from '@/lib/clerkConfig'

export default function SignUpPageEs() {
  if (!isClerkEnabled()) {
    return (
      <AuthNotConfigured
        title="Registro no disponible"
        body="La autenticación aún no está configurada para este despliegue."
      />
    )
  }
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Crea tu cuenta de HalfSPACE</h1>
          <p className="text-sm text-gray-400">
            Regístrate en segundos y desbloquea experiencias cósmicas personalizadas y viajes diarios.
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

