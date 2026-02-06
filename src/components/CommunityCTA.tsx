import Link from 'next/link'

export function CommunityCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="rounded-2xl border border-accent/30 bg-navy-800/80 p-8 lg:p-12 text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-accent mb-4">
          Rejoignez notre communauté
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
          Ensemble, nous pouvons faire une différence. Découvrez comment vous pouvez contribuer à nos actions humanitaires et sociales.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/don"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent-light transition-colors"
          >
            Faire un don
          </Link>
          <Link
            href="/benevoles"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-gray-500 text-gray-300 font-medium hover:border-accent hover:text-accent transition-colors"
          >
            Devenir bénévole
          </Link>
        </div>
      </div>
    </section>
  )
}
