'use client'

import { useState } from 'react'

interface LikeShareButtonsProps {
  slug: string
  title: string
}

export function LikeShareButtons({ slug, title }: LikeShareButtonsProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(() => {
    let hash = 0
    for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) & 0xffff
    return (hash % 80) + 12
  })
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const articleUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/article/${slug}`
    : `/article/${slug}`

  function handleLike(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setLiked((prev) => {
      setLikeCount((c) => prev ? c - 1 : c + 1)
      return !prev
    })
  }

  function handleShare(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setShowShareMenu((v) => !v)
  }

  function shareOn(platform: string, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const encodedUrl = encodeURIComponent(articleUrl)
    const encodedTitle = encodeURIComponent(title)
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    }
    window.open(urls[platform], '_blank', 'noopener,noreferrer,width=600,height=500')
    setShowShareMenu(false)
  }

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(articleUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
    setShowShareMenu(false)
  }

  return (
    <div className="relative flex items-center gap-2 pt-3 border-t border-slate-100">
      {/* Like */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
          liked
            ? 'bg-red-50 text-red-500 border border-red-200 scale-105'
            : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-red-50 hover:text-red-400 hover:border-red-200'
        }`}
        aria-label={liked ? 'Ne plus aimer' : 'Aimer cet article'}
        aria-pressed={liked}
      >
        <svg
          width="13" height="13" viewBox="0 0 24 24"
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="2"
          className={`transition-transform duration-200 ${liked ? 'scale-110' : ''}`}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span>{likeCount}</span>
      </button>

      {/* Share */}
      <div className="relative">
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-400 border border-slate-200 hover:bg-accent/8 hover:text-accent hover:border-accent/30 transition-all duration-200"
          aria-label="Partager"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span>Partager</span>
        </button>

        {showShareMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowShareMenu(false) }} />
            <div className="absolute bottom-full left-0 mb-2 z-20 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/60 p-1.5 min-w-[160px] animate-slide-down">
              {[
                { id: 'twitter', icon: '𝕏', label: 'Twitter / X', color: 'hover:bg-slate-100' },
                { id: 'facebook', icon: 'f', label: 'Facebook', color: 'hover:bg-blue-50 hover:text-blue-600' },
                { id: 'linkedin', icon: 'in', label: 'LinkedIn', color: 'hover:bg-blue-50 hover:text-blue-700' },
                { id: 'whatsapp', icon: '💬', label: 'WhatsApp', color: 'hover:bg-green-50 hover:text-green-600' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={(e) => shareOn(s.id, e)}
                  className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-slate-600 font-medium transition-colors ${s.color}`}
                >
                  <span className="w-5 text-center font-bold text-xs">{s.icon}</span>
                  {s.label}
                </button>
              ))}
              <div className="h-px bg-slate-100 my-1" />
              <button
                onClick={handleCopy}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500"><path d="M20 6L9 17l-5-5"/></svg>
                    <span className="text-green-600">Copié !</span>
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copier le lien
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {copied && (
        <span className="ml-auto text-xs text-green-500 font-medium animate-fade-in">✓ Lien copié</span>
      )}
    </div>
  )
}
