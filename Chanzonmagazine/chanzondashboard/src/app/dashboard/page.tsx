'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const quickLinks = [
  { href: '/dashboard/posts/new', label: '+ Nouvel article', color: 'bg-accent hover:bg-accent/90 text-white' },
  { href: '/dashboard/banners', label: '🖼️ Bannières', color: 'bg-navy-700 hover:bg-navy-600 text-gray-300' },
  { href: '/dashboard/projects', label: '🚀 Projets', color: 'bg-navy-700 hover:bg-navy-600 text-gray-300' },
  { href: '/dashboard/analytics', label: '📈 Analytiques', color: 'bg-navy-700 hover:bg-navy-600 text-gray-300' },
]

export default function DashboardHome() {
  const [stats, setStats] = useState<any>(null)
  const [txStats, setTxStats] = useState<any>(null)
  const [recentArticles, setRecentArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)

  useEffect(() => {
    Promise.all([
      api.analytics.stats(),
      api.transactions.stats(),
      api.articles.list({ limit: '5', page: '1' }),
    ])
      .then(([s, tx, art]) => {
        setStats(s); setTxStats(tx)
        setRecentArticles(art.data || [])
      })
      .catch(() => setApiError(true))
      .finally(() => setLoading(false))
  }, [])

  const kpis = stats ? [
    { label: 'Articles publiés', value: stats.publishedArticles, total: stats.totalArticles, icon: '📝', href: '/dashboard/posts', color: 'text-blue-400' },
    { label: 'Vues totales', value: stats.totalViews?.toLocaleString(), icon: '👁️', href: '/dashboard/analytics', color: 'text-purple-400' },
    { label: 'Likes totaux', value: stats.totalLikes, icon: '❤️', href: '/dashboard/analytics', color: 'text-red-400' },
    { label: 'Dons reçus', value: txStats ? `${txStats.totalAmount?.toFixed(0)} €` : '—', icon: '💳', href: '/dashboard/don', color: 'text-green-400' },
  ] : []

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">📊 Tableau de bord</h1>
        <p className="text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        {quickLinks.map((l) => (
          <Link key={l.href} href={l.href} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${l.color}`}>
            {l.label}
          </Link>
        ))}
      </div>

      {apiError && (
        <div className="p-4 rounded-xl bg-yellow-900/20 border border-yellow-700/40 text-yellow-300 text-sm">
          ⚠️ Impossible de contacter le backend. Vérifiez que <code className="bg-yellow-900/40 px-1 rounded">npm run start:dev</code> tourne dans <code className="bg-yellow-900/40 px-1 rounded">backend/</code>.
        </div>
      )}

      {/* KPI cards */}
      {!loading && !apiError && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <Link key={k.href} href={k.href} className="bg-navy-700 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600 transition-colors block">
              <p className="text-2xl mb-2">{k.icon}</p>
              <p className={`text-3xl font-bold mb-1 ${k.color}`}>{k.value ?? '—'}</p>
              <p className="text-gray-400 text-sm">{k.label}</p>
              {k.total !== undefined && <p className="text-gray-600 text-xs mt-1">sur {k.total} total</p>}
            </Link>
          ))}
        </div>
      )}

      {loading && !apiError && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-navy-700 border border-gray-700/50 rounded-xl p-5 animate-pulse">
              <div className="w-8 h-8 bg-navy-600 rounded mb-3" />
              <div className="w-16 h-7 bg-navy-600 rounded mb-2" />
              <div className="w-24 h-4 bg-navy-600 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Recent articles */}
      <div className="bg-navy-700 border border-gray-700/50 rounded-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-700/50">
          <h2 className="text-white font-semibold">Articles récents</h2>
          <Link href="/dashboard/posts" className="text-accent text-sm hover:underline">Voir tout →</Link>
        </div>
        {loading ? (
          <div className="p-5 text-gray-500 text-sm">Chargement...</div>
        ) : recentArticles.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Aucun article.{' '}
            <Link href="/dashboard/posts/new" className="text-accent hover:underline">Créer le premier</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/30">
            {recentArticles.map((a) => (
              <div key={a.id} className="flex items-center gap-4 px-5 py-3 hover:bg-navy-600/30 transition-colors">
                {a.imageUrl
                  ? <img src={a.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                  : <div className="w-9 h-9 rounded-lg bg-navy-600 flex-shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{a.title}</p>
                  <p className="text-gray-500 text-xs">{new Date(a.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  a.status === 'published' ? 'bg-green-900/40 text-green-300' : 'bg-yellow-900/40 text-yellow-300'
                }`}>
                  {a.status === 'published' ? 'Publié' : 'Brouillon'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
