import Link from 'next/link'

export function FeaturedHero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden bg-navy-800 border border-gray-700/50">
        <div className="p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
          <span className="inline-flex w-fit px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
            Action Humanitaire
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
            Pour un monde plus solidaire
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-6">
            Comment les organisations humanitaires mobilisent citoyens et ressources pour répondre aux crises mondiales et construire un avenir plus juste pour tous.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm mb-8">
            <span>Jean-Luc Moreau</span>
            <span>•</span>
            <span>10 nov. 2025</span>
            <span>•</span>
            <span>12 min</span>
          </div>
          <Link
            href="/article/pour-un-monde-plus-solidaire"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent-light transition-colors w-fit"
          >
            Lire l&apos;article
            <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px] order-1 lg:order-2">
          <div
            className="absolute inset-0 bg-gradient-to-r from-navy-800 via-navy-800/60 to-transparent lg:from-navy-800 lg:via-navy-800/40 z-10"
            aria-hidden
          />
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
            alt="Bénévoles en action humanitaire"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
