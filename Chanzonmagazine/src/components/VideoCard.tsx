'use client'

import { useState } from 'react'
import { VideoModal } from './VideoModal'
import { AudioPlayer } from './AudioPlayer'

export interface VideoCardProps {
  slug: string
  tag: string
  title: string
  description: string
  duration: string
  date: string
  imageUrl: string
  videoUrl?: string
  audioUrl?: string
}

export function VideoCard({ slug, tag, title, description, duration, date, imageUrl, videoUrl, audioUrl }: VideoCardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  function handlePlayClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (videoUrl) setModalOpen(true)
  }

  return (
    <>
      {modalOpen && videoUrl && (
        <VideoModal videoUrl={videoUrl} title={title} onClose={() => setModalOpen(false)} />
      )}

      <article className="bg-white rounded-2xl overflow-hidden border border-slate-200/70 h-full flex flex-col shadow-sm card-lift">
        {/* Thumbnail */}
        <div className="relative aspect-video img-zoom cursor-pointer" onClick={handlePlayClick}>
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-bold uppercase tracking-wide">
            {tag}
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 group-hover:scale-110 ${
                videoUrl
                  ? 'bg-accent shadow-accent/40 hover:scale-110 hover:shadow-accent/60 cursor-pointer'
                  : 'bg-slate-500/70 cursor-not-allowed'
              }`}
              aria-hidden
            >
              <PlayIcon />
            </span>
          </div>
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
            {duration}
          </div>
          {videoUrl && (
            <div className="absolute inset-0 flex items-end justify-center pb-12 opacity-0 hover:opacity-100 transition-opacity duration-200">
              <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                Cliquez pour regarder
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-primary hover:text-accent transition-colors duration-200 line-clamp-2 mb-2 text-base leading-snug cursor-pointer" onClick={handlePlayClick}>
            {title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">{description}</p>

          {audioUrl && (
            <div className="mb-4">
              <AudioPlayer audioUrl={audioUrl} title={title} />
            </div>
          )}

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100 text-slate-400 text-xs">
            <span className="flex items-center gap-1.5">
              <ClockIcon />
              {duration}
            </span>
            <span className="text-slate-200">·</span>
            <span className="flex items-center gap-1.5">
              <CalendarIcon />
              {date}
            </span>
            {videoUrl && (
              <>
                <span className="text-slate-200">·</span>
                <button
                  onClick={handlePlayClick}
                  className="flex items-center gap-1 text-accent font-semibold hover:underline"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  Regarder
                </button>
              </>
            )}
          </div>
        </div>
      </article>
    </>
  )
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}
