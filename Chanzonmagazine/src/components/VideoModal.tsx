'use client'

import { useEffect, useRef } from 'react'

interface VideoModalProps {
  videoUrl: string
  title: string
  onClose: () => void
}

export function VideoModal({ videoUrl, title, onClose }: VideoModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  const isYoutube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
  const isVimeo = videoUrl.includes('vimeo.com')

  function getEmbedUrl(url: string) {
    if (isYoutube) {
      const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
      const id = match ? match[1] : ''
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
    }
    if (isVimeo) {
      const match = url.match(/vimeo\.com\/(\d+)/)
      const id = match ? match[1] : ''
      return `https://player.vimeo.com/video/${id}?autoplay=1`
    }
    return url
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-4xl animate-fade-in-up"
        style={{ animationDelay: '60ms' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-white font-semibold text-sm line-clamp-1 pr-4">{title}</h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/15 hover:border-white/30"
            aria-label="Fermer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video container */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/60" style={{ paddingBottom: '56.25%' }}>
          {isYoutube || isVimeo ? (
            <iframe
              src={getEmbedUrl(videoUrl)}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={title}
            />
          ) : (
            <video
              src={videoUrl}
              className="absolute inset-0 w-full h-full object-contain"
              controls
              autoPlay
              title={title}
            />
          )}
        </div>

        <p className="text-white/30 text-xs text-center mt-3">Appuyez sur Échap pour fermer</p>
      </div>
    </div>
  )
}
