import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projets — Chanzon Magazine',
  description: 'Découvrez les projets portés par Chanzon Magazine pour soutenir les communautés.',
}

async function getProjects() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444/api'}/projects?active=true`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function ProjetsPage() {
  const projects: any[] = await getProjects()

  return (
    <main className="min-h-screen" style={{ background: '#0d2137' }}>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d2137 0%, #1a3a5c 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #FF6B35 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#FF6B35' }}>Nos Initiatives</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Projets & Missions</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Des actions concrètes sur le terrain pour informer, éduquer et soutenir les communautés.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        {projects.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg">Aucun projet disponible pour le moment.</p>
            <p className="text-gray-500 text-sm mt-2">Revenez bientôt pour découvrir nos initiatives.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any) => (
              <article key={project.id} className="group rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                {project.imageUrl && (
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {project.status && (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background: '#FF6B35', color: 'white' }}>
                        {project.status}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-6">
                  {project.category && (
                    <p className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: '#FF6B35' }}>{project.category}</p>
                  )}
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.shortDescription}</p>

                  {project.location && (
                    <p className="text-gray-500 text-xs mb-4">📍 {project.location}</p>
                  )}

                  {project.goalAmount && (
                    <div className="mb-5">
                      <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Collecté: <strong className="text-white">{parseFloat(project.raisedAmount || 0).toLocaleString('fr-FR')} €</strong></span>
                        <span>Objectif: <strong className="text-white">{parseFloat(project.goalAmount).toLocaleString('fr-FR')} €</strong></span>
                      </div>
                      <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <div
                          className="h-2 rounded-full transition-all duration-1000"
                          style={{
                            background: 'linear-gradient(90deg, #FF6B35, #ff8c5a)',
                            width: `${Math.min(100, (parseFloat(project.raisedAmount || 0) / parseFloat(project.goalAmount)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <a
                    href={`/projets/${project.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                    style={{ color: '#FF6B35' }}
                  >
                    En savoir plus <span>→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA section */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Soutenez nos projets</h2>
          <p className="text-gray-400 mb-8">Votre don permet de financer nos missions sur le terrain et d&apos;amplifier notre impact.</p>
          <a
            href="/don"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #ff8c5a)' }}
          >
            💳 Faire un don
          </a>
        </div>
      </section>
    </main>
  )
}
