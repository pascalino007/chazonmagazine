import Link from 'next/link'
import { getActiveBanners } from '@/lib/cms-api'
import { ScrollReveal } from './ScrollReveal'

interface CmsBannerProps {
  position: string
  fallbackVariant?: 'impact' | 'mission'
}

const FALLBACK = {
  impact: {
    imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1400&q=85',
    title: 'La crise climatique frappe en premier les plus vulnérables',
    description: "Sécheresses, inondations, déplacements forcés : les populations les plus pauvres subissent de plein fouet les conséquences d'un réchauffement qu'elles n'ont pas causé.",
    linkUrl: '/category/environnement',
    linkLabel: 'Lire le dossier',
    accentColor: '#22c55e',
    align: 'left' as const,
  },
  mission: {
    imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1400&q=85',
    title: "Chaque enfant mérite le droit d'apprendre, partout dans le monde",
    description: "Dans les camps de réfugiés, les zones de conflit et les villages reculés, des enseignants bénévoles s'engagent pour l'éducation.",
    linkUrl: '/category/education',
    linkLabel: 'Découvrir les projets',
    accentColor: '#FF6B35',
    align: 'right' as const,
  },
}

export async function CmsBanner({ position, fallbackVariant = 'impact' }: CmsBannerProps) {
  const banners = await getActiveBanners(position)
  const banner = banners[0]

  const fb = FALLBACK[fallbackVariant]
  const data = {
    imageUrl: banner?.imageUrl ?? fb.imageUrl,
    title: banner?.title ?? fb.title,
    description: banner?.description ?? fb.description,
    linkUrl: banner?.linkUrl ?? fb.linkUrl ?? '/',
    linkLabel: banner?.linkLabel ?? fb.linkLabel,
    accentColor: banner?.accentColor ?? fb.accentColor,
    align: fb.align,
  }

  const isRight = data.align === 'right'

  return (
    <section className="w-full overflow-hidden relative" style={{ minHeight: '420px' }}>
      <div className="absolute inset-0">
        <img src={data.imageUrl} alt="" className="w-full h-full object-cover" />
        <div className={`absolute inset-0 ${isRight
          ? 'bg-gradient-to-l from-[#0d2137]/95 via-[#0d2137]/75 to-transparent'
          : 'bg-gradient-to-r from-[#0d2137]/95 via-[#0d2137]/75 to-transparent'
        }`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2137]/40 via-transparent to-transparent" />
      </div>

      <div className="absolute top-0 left-0 w-full h-0.5"
        style={{ background: `linear-gradient(to right, ${data.accentColor}, transparent)` }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20">
        <div className={`max-w-xl ${isRight ? 'ml-auto' : ''}`}>
          <ScrollReveal direction={isRight ? 'right' : 'left'}>
            <h2 className="gradient-text text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-5">
              {data.title}
            </h2>
            {data.description && (
              <p className="text-white/70 text-base leading-relaxed mb-8">{data.description}</p>
            )}
            <div className="flex flex-wrap gap-3">
              <Link
                href={data.linkUrl}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm transition-all duration-300 shadow-lg hover:scale-[1.03] group"
                style={{ background: data.accentColor, boxShadow: `0 8px 24px ${data.accentColor}44` }}
              >
                {data.linkLabel}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-200 group-hover:translate-x-1">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/don"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/18 border border-white/20 hover:border-white/35 text-white font-bold text-sm backdrop-blur-sm transition-all duration-300"
              >
                Faire un don
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
