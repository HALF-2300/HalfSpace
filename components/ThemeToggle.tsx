'use client'

import { useState, useEffect } from 'react'

type Theme = 'dark' | 'astronaut'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    if (newTheme === 'astronaut') {
      root.classList.add('astronaut-mode')
      root.classList.remove('dark-mode')
    } else {
      root.classList.add('dark-mode')
      root.classList.remove('astronaut-mode')
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'astronaut' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-4 glass rounded-full border-2 border-purple-500/30 hover:border-purple-500/50 transition-all transform hover:scale-110 glow-purple"
      title={theme === 'dark' ? 'Enable Astronaut Mode' : 'Enable Dark Mode'}
    >
      <span className="text-3xl">
        {theme === 'dark' ? '👨‍🚀' : '🌙'}
      </span>
    </button>
  )
}

