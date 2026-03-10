import { ScrollReveal } from './ScrollReveal'

const testimonials = [
  {
    name: 'Amira Hassan',
    role: 'Réfugiée syrienne, France',
    quote: 'L\'accueil que j\'ai reçu m\'a redonné espoir en l\'humanité.',
    story: 'Après avoir fui la guerre, j\'ai trouvé une communauté qui m\'a aidée à reprendre pied. Aujourd\'hui je travaille pour aider d\'autres familles.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    emoji: '🌸',
  },
  {
    name: 'Jean-Marc Durand',
    role: 'Bénévole, Médecins du Monde',
    quote: 'Chaque mission me rappelle pourquoi nous nous battons.',
    story: 'Sur le terrain, nous voyons des visages, pas des statistiques. Chaque vie sauvée compte.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    emoji: '❤️',
  },
  {
    name: 'Fatou Diallo',
    role: 'Entrepreneure, Sénégal',
    quote: 'Le micro-crédit m\'a donné les clés de mon autonomie.',
    story: 'Avec un petit prêt et une formation, j\'ai pu créer mon commerce et scolariser mes enfants.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    emoji: '✨',
  },
]

export function TestimonialsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
      <ScrollReveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2">Histoires vraies</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-primary flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-accent to-accent-light rounded-full" aria-hidden />
            Témoignages
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Des histoires de vie qui inspirent le changement
          </p>
        </div>
        <a
          href="/temoignages"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border-2 border-slate-200 text-primary hover:border-accent hover:text-accent transition-all text-sm font-semibold group whitespace-nowrap"
        >
          Toutes les stories
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-200 group-hover:translate-x-1">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
        {testimonials.map((t, i) => (
          <ScrollReveal key={t.name} delay={i * 110}>
            <article className="bg-white rounded-2xl overflow-hidden border border-slate-200/70 flex flex-col shadow-sm card-lift">
              <div className="relative aspect-[4/3] img-zoom">
                <img src={t.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 text-2xl">{t.emoji}</span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex-1 h-px bg-slate-100" />
                  <svg width="20" height="16" viewBox="0 0 32 24" fill="none" className="text-accent/40">
                    <path d="M0 24V14.4C0 6.4 4.8 1.6 14.4 0l2.4 3.2C11.2 4.267 8 7.2 8 12h6.4V24H0zm17.6 0V14.4C17.6 6.4 22.4 1.6 32 0l2.4 3.2C28.8 4.267 25.6 7.2 25.6 12H32V24H17.6z" fill="currentColor"/>
                  </svg>
                  <span className="flex-1 h-px bg-slate-100" />
                </div>
                <blockquote className="text-primary font-semibold mb-3 leading-snug italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <p className="text-slate-500 text-sm line-clamp-3 flex-1 leading-relaxed mb-4">{t.story}</p>
                <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-xs flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-primary text-sm leading-tight">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
