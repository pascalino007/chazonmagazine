import Link from 'next/link'
import { ScrollReveal } from './ScrollReveal'

interface EditorialBannerProps {
  variant: 'impact' | 'mission'
}

const bannerData = {
  impact: {
    imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1400&q=85',
    tag: '🌿 Environnement & Avenir',
    title: 'La crise climatique frappe en premier les plus vulnérables',
    description:
      'Sécheresses, inondations, déplacements forcés : les populations les plus pauvres subissent de plein fouet les conséquences d\'un réchauffement qu\'elles n\'ont pas causé. Nos équipes sont sur le terrain.',
    cta: { label: 'Lire le dossier', href: '/category/environnement' },
    ctaSecondary: { label: 'Faire un don', href: '/don' },
    align: 'left' as const,
    accentColor: '#22c55e',
  },
  mission: {
    imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1400&q=85',
    tag: '📚 Éducation & Espoir',
    title: 'Chaque enfant mérite le droit d\'apprendre, partout dans le monde',
    description:
      'Dans les camps de réfugiés, les zones de conflit et les villages reculés, des milliers d\'enseignants bénévoles s\'engagent pour que les enfants d\'aujourd\'hui construisent le monde de demain.',
    cta: { label: 'Découvrir les projets', href: '/category/education' },
    ctaSecondary: { label: 'Devenir bénévole', href: '/benevoles' },
    align: 'right' as const,
    accentColor: '#FF6B35',
  },
}

export function EditorialBanner({ variant }: EditorialBannerProps) {
  const d = bannerData[variant]
  const isRight = d.align === 'right'

  return (
    <section className="w-full overflow-hidden relative" style={{ minHeight: '420px' }}>
      {/* Background */}
      <div className="absolute inset-0">
        <img src={d.imageUrl} alt="" className="w-full h-full object-cover" />
        <div
          className={`absolute inset-0 ${
            isRight
              ? 'bg-gradient-to-l from-[#0d2137]/95 via-[#0d2137]/75 to-transparent'
              : 'bg-gradient-to-r from-[#0d2137]/95 via-[#0d2137]/75 to-transparent'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2137]/40 via-transparent to-transparent" />
      </div>

      {/* Accent line */}
      <div
        className="absolute top-0 left-0 w-full h-0.5"
        style={{ background: `linear-gradient(to right, ${d.accentColor}, transparent)` }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20">
        <div className={`max-w-xl ${isRight ? 'ml-auto' : ''}`}>
          <ScrollReveal direction={isRight ? 'right' : 'left'}>
            <span
              className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 text-white"
              style={{ background: `${d.accentColor}22`, border: `1px solid ${d.accentColor}44` }}
            >
              {d.tag}
            </span>

            <h2 className="gradient-text text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-5">
              {d.title}
            </h2>

            <p className="text-white/70 text-base leading-relaxed mb-8">
              {d.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={d.cta.href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm transition-all duration-300 shadow-lg hover:scale-[1.03] group"
                style={{
                  background: d.accentColor,
                  boxShadow: `0 8px 24px ${d.accentColor}44`,
                }}
              >
                {d.cta.label}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-200 group-hover:translate-x-1">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href={d.ctaSecondary.href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/18 border border-white/20 hover:border-white/35 text-white font-bold text-sm backdrop-blur-sm transition-all duration-300"
              >
                {d.ctaSecondary.label}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
