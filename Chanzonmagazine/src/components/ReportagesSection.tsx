'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { VideoCard } from './VideoCard'
import { ScrollReveal } from './ScrollReveal'
import type { VideoCardProps } from './VideoCard'
import { getPublishedReportages, formatArticleDate } from '../lib/cms-api'

interface ReportageVideo extends VideoCardProps {
  tag: string
}

export function ReportagesSection() {
  const [videos, setVideos] = useState<ReportageVideo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReportages = async () => {
      try {
        setLoading(true)
        const { data } = await getPublishedReportages({ limit: 3 })
        const formattedData: ReportageVideo[] = data.map(reportage => ({
          slug: reportage.slug,
          tag: reportage.tags?.[0]?.name || 'Reportage',
          title: reportage.title,
          description: reportage.shortDescription,
          duration: reportage.readTime || 'N/A',
          date: formatArticleDate(reportage.createdAt),
          imageUrl: reportage.imageUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
          videoUrl: reportage.videoUrl,
          audioUrl: reportage.audioUrl,
        }))
        setVideos(formattedData)
      } catch (error) {
        console.error('Failed to fetch reportages:', error)
        setVideos([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }

    fetchReportages()
  }, [])

  if (loading) {
    return (
      <section className="bg-surface-muted py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-surface-muted py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2">Vidéos</p>
            <h2 className="text-2xl lg:text-3xl font-bold text-primary flex items-center gap-3">
              <span className="w-1 h-8 bg-gradient-to-b from-accent to-accent-light rounded-full" aria-hidden />
              Reportages &amp; Documentaires
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              Des récits visuels au cœur de l&apos;action humanitaire
            </p>
          </div>
          <Link
            href="/reportages"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-accent transition-colors text-sm font-semibold group whitespace-nowrap"
          >
            Voir tout
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-200 group-hover:translate-x-1">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </ScrollReveal>

        {videos.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="text-4xl mb-3">🎥</p>
            <p>Aucun reportage disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {videos.map((video, i) => (
              <ScrollReveal key={video.slug} delay={i * 100}>
                <VideoCard {...video} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
