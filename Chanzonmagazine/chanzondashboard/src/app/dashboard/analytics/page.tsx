'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

function StatCard({ label, value, icon, color }: { label: string; value: any; icon: string; color: string }) {
  return (
    <div className="bg-navy-700 border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${color}`}>Live</span>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value ?? '—'}</p>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  )
}

function MiniChart({ data, label }: { data: Array<{ date?: string; month?: string; count: string }>; label: string }) {
  if (!data?.length) return <div className="text-gray-500 text-sm py-4 text-center">Pas de données</div>
  const max = Math.max(...data.map((d) => parseInt(d.count) || 0)) || 1
  return (
    <div>
      <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">{label}</p>
      <div className="flex items-end gap-1 h-20">
        {data.slice(-30).map((d, i) => {
          const h = Math.round(((parseInt(d.count) || 0) / max) * 100)
          return (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              <div
                className="w-full bg-accent/70 rounded-t hover:bg-accent transition-colors"
                style={{ height: `${Math.max(h, 4)}%` }}
              />
              <div className="absolute bottom-full mb-1 hidden group-hover:block bg-navy-900 border border-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                {d.date || d.month}: {d.count}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [articlesPerDay, setArticlesPerDay] = useState<any[]>([])
  const [viewsPerDay, setViewsPerDay] = useState<any[]>([])
  const [likesPerArticle, setLikesPerArticle] = useState<any[]>([])
  const [topArticles, setTopArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      api.analytics.stats(),
      api.analytics.articlesPerDay(30),
      api.analytics.viewsPerDay(30),
      api.analytics.likesPerArticle(),
      api.analytics.topArticles(),
    ])
      .then(([s, apd, vpd, lpa, ta]) => {
        setStats(s); setArticlesPerDay(apd); setViewsPerDay(vpd)
        setLikesPerArticle(lpa); setTopArticles(ta)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-gray-400 text-center">Chargement des analytiques...</div>
  if (error) return <div className="p-8 text-red-400 text-center">Erreur: {error}</div>

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-white">📈 Analytiques</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total articles" value={stats?.totalArticles} icon="📝" color="bg-blue-900/50 text-blue-300" />
        <StatCard label="Publiés" value={stats?.publishedArticles} icon="✅" color="bg-green-900/50 text-green-300" />
        <StatCard label="Vues totales" value={stats?.totalViews?.toLocaleString()} icon="👁️" color="bg-purple-900/50 text-purple-300" />
        <StatCard label="Likes totaux" value={stats?.totalLikes} icon="❤️" color="bg-red-900/50 text-red-300" />
        <StatCard label="Vues aujourd'hui" value={stats?.viewsToday} icon="📅" color="bg-accent/20 text-accent" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navy-700 border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Articles publiés (30 jours)</h2>
          <MiniChart data={articlesPerDay} label="articles / jour" />
        </div>
        <div className="bg-navy-700 border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Visites (30 jours)</h2>
          <MiniChart data={viewsPerDay} label="vues / jour" />
        </div>
      </div>

      {/* Likes per article */}
      <div className="bg-navy-700 border border-gray-700/50 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">❤️ Likes par article (Top 10)</h2>
        {likesPerArticle.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucun like enregistré</p>
        ) : (
          <div className="space-y-3">
            {likesPerArticle.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-gray-500 text-sm w-4">{i + 1}</span>
                <span className="text-gray-300 text-sm flex-1 truncate">{item.title}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-navy-900 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (parseInt(item.likes) / (parseInt(likesPerArticle[0]?.likes) || 1)) * 100)}%` }}
                    />
                  </div>
                  <span className="text-accent text-sm font-bold w-8 text-right">{item.likes}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top articles by views */}
      <div className="bg-navy-700 border border-gray-700/50 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">👁️ Articles les plus vus (Top 10)</h2>
        {topArticles.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune vue enregistrée</p>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="text-gray-500 border-b border-gray-700">
              <th className="text-left py-2 font-medium">#</th>
              <th className="text-left py-2 font-medium">Titre</th>
              <th className="text-right py-2 font-medium">Vues</th>
              <th className="text-right py-2 font-medium">Date</th>
            </tr></thead>
            <tbody>
              {topArticles.map((a, i) => (
                <tr key={a.id} className="border-b border-gray-700/30">
                  <td className="py-2 text-gray-500">{i + 1}</td>
                  <td className="py-2 text-gray-300 truncate max-w-xs">{a.title}</td>
                  <td className="py-2 text-accent font-bold text-right">{a.viewCount?.toLocaleString()}</td>
                  <td className="py-2 text-gray-500 text-right">{new Date(a.createdAt).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
