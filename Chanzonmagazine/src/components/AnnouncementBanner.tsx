'use client'

import { useState, useEffect } from 'react'

const messages = [
  '🌍 Bienvenue sur HUMANITÉ+ — Des récits qui changent le monde',
  '✨ Nouvelles histoires chaque semaine sur l\'action humanitaire',
  '❤️ Rejoignez notre communauté de lecteurs engagés dans la solidarité',
  '🤝 Ensemble, construisons un avenir plus juste pour tous',
  '📖 Découvrez nos reportages exclusifs du terrain',
]

export function AnnouncementBanner() {
  const [visible, setVisible] = useState(true)
  const [index, setIndex] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setIndex((i) => (i + 1) % messages.length)
        setFading(false)
      }, 350)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  if (!visible) return null

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#081525] via-primary to-[#081525] text-white py-2.5 px-4 shimmer-bar">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <p
          className="text-xs sm:text-sm font-medium tracking-wide text-center transition-all duration-350"
          style={{
            opacity: fading ? 0 : 1,
            transform: fading ? 'translateY(-6px)' : 'translateY(0)',
          }}
        >
          {messages[index]}
        </p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-all"
        aria-label="Fermer"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
