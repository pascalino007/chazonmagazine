import Link from 'next/link'
import { VideoCard } from './VideoCard'
import { ScrollReveal } from './ScrollReveal'
import type { VideoCardProps } from './VideoCard'

const videos: VideoCardProps[] = [
  {
    slug: 'refugies-climatiques',
    tag: 'Documentaire',
    title: "Sur les routes de l'exil: parcours de réfugiés climatiques",
    description: "Un documentaire poignant sur les familles contraintes de quitter leurs terres natales à cause du dérèglement climatique.",
    duration: '42 min',
    date: '5 nov. 2025',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
  {
    slug: 'equipes-urgence',
    tag: 'Reportage',
    title: "Première ligne: équipes d'urgence en zone de catastrophe",
    description: "Immersion au cœur des opérations de secours avec les équipes humanitaires déployées sur le terrain.",
    duration: '28 min',
    date: '2 nov. 2025',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
  },
  {
    slug: 'femmes-debout',
    tag: 'Série',
    title: "Femmes debout: l'émancipation par l'entrepreneuriat",
    description: "Une série qui met en lumière des femmes entrepreneures qui transforment leurs communautés par l'innovation.",
    duration: '35 min',
    date: '30 oct. 2025',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
]

export function ReportagesSection() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {videos.map((video, i) => (
            <ScrollReveal key={video.slug} delay={i * 100}>
              <VideoCard {...video} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
