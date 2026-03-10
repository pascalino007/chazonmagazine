import Link from 'next/link'
import { ScrollReveal } from './ScrollReveal'

export function CommunityCTA() {
  return (
    <section className="py-14 lg:py-20 px-4 sm:px-6 lg:px-8">
      <ScrollReveal className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-light to-[#1a4a7a] p-10 lg:p-16 text-center shadow-2xl">
          {/* Decorative glows */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-accent-light to-transparent" />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="text-3xl animate-float">🌍</span>
              <span className="text-3xl animate-float" style={{ animationDelay: '0.5s' }}>❤️</span>
              <span className="text-3xl animate-float" style={{ animationDelay: '1s' }}>🤝</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              Rejoignez notre communauté solidaire
            </h2>
            <p className="text-white/70 text-base lg:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Ensemble, nous pouvons faire une différence. Découvrez comment vous pouvez contribuer à nos actions humanitaires et sociales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/don"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-accent hover:bg-accent-light text-white font-bold transition-all duration-300 shadow-lg shadow-accent/40 hover:shadow-accent/60 hover:scale-[1.03] text-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                Faire un don
              </Link>
              <Link
                href="/benevoles"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white/10 hover:bg-white/18 border border-white/25 hover:border-white/40 text-white font-bold transition-all duration-300 hover:scale-[1.03] text-sm backdrop-blur-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Devenir bénévole
              </Link>
            </div>

            <p className="text-white/35 text-xs mt-8">
              ✨ Plus de 12 000 lecteurs engagés · Chaque semaine de nouveaux récits
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
