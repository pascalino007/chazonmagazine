'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export interface HeroSlide {
  src: string
  alt: string
  tag: string
  title: string
  description: string
  author: string
  date: string
  readTime: string
  href: string
}

const AUTOPLAY_MS = 6000

export function FeaturedHeroClient({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0)
  const [textKey, setTextKey] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
      setTextKey((k) => k + 1)
    }, AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [slides.length])

  if (slides.length === 0) {
    return (
      <section className="relative w-full flex items-center justify-center" style={{ height: 'clamp(480px, 82vh, 720px)', background: 'linear-gradient(135deg, #0d2137 0%, #1a3a5c 100%)' }}>
        <div className="text-center text-white/40">
          <p className="text-5xl mb-4">📰</p>
          <p className="text-lg">Aucun article publié pour le moment.</p>
        </div>
      </section>
    )
  }

  const slide = slides[current]

  function goTo(i: number) {
    setCurrent(i)
    setTextKey((k) => k + 1)
  }

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(480px, 82vh, 720px)' }}>
      {slides.map((s, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }} aria-hidden={i !== current}>
          <img src={s.src} alt={s.alt} className="w-full h-full object-cover" />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-[#0d2137]/92 via-[#0d2137]/65 to-[#0d2137]/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d2137]/70 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-accent-light to-transparent" />

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div key={textKey} className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent text-white text-xs font-bold uppercase tracking-widest mb-5 animate-fade-in shadow-lg shadow-accent/30">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>
              {slide.tag}
            </span>
            <h1 className="gradient-text text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight mb-5 animate-fade-in-up" style={{ animationDelay: '60ms' }}>
              {slide.title}
            </h1>
            <p className="text-white/75 text-base lg:text-lg leading-relaxed mb-7 max-w-lg animate-fade-in-up" style={{ animationDelay: '140ms' }}>
              {slide.description}
            </p>
            <div className="flex items-center gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="w-8 h-8 rounded-full bg-accent/25 ring-1 ring-accent/50 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {slide.author[0]}
              </div>
              <span className="text-white/80 text-sm font-medium">{slide.author}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/55 text-sm">{slide.date}</span>
              {slide.readTime && <>
                <span className="text-white/30">·</span>
                <span className="text-white/55 text-sm">{slide.readTime} de lecture</span>
              </>}
            </div>
            <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '260ms' }}>
              <Link href={slide.href}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-accent hover:bg-accent-light text-white font-semibold transition-all duration-300 shadow-xl shadow-accent/35 hover:shadow-accent/50 hover:gap-4 group animate-pulse-glow">
                Lire l&apos;article
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              {slides.length > 1 && (
                <span className="text-white/35 text-sm hidden sm:block">{current + 1} / {slides.length}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-8 right-8 flex items-center gap-2.5 z-10">
            {slides.map((_, i) => (
              <button key={i} type="button" onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-400 ${i === current ? 'w-8 h-2.5 bg-accent shadow-lg shadow-accent/40' : 'w-2.5 h-2.5 bg-white/35 hover:bg-white/60'}`}
                aria-current={i === current} aria-label={`Article ${i + 1}`} />
            ))}
          </div>
          <button type="button" onClick={() => goTo((current - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/22 backdrop-blur-sm text-white flex items-center justify-center transition-all border border-white/10 hover:border-white/25"
            aria-label="Article précédent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" onClick={() => goTo((current + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/22 backdrop-blur-sm text-white flex items-center justify-center transition-all border border-white/10 hover:border-white/25"
            aria-label="Article suivant">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </>
      )}

      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/10 z-10">
        <div key={`${current}-progress`} className="h-full bg-accent origin-left"
          style={{ animation: `shimmer ${AUTOPLAY_MS}ms linear forwards`, width: '100%', transformOrigin: 'left' }} />
      </div>
    </section>
  )
}
