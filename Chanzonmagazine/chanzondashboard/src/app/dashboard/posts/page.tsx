'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const STATUS_STYLE: Record<string, string> = {
  published: 'bg-green-900/40 text-green-300',
  draft:     'bg-yellow-900/40 text-yellow-300',
  archived:  'bg-gray-700 text-gray-400',
}
const STATUS_LABEL: Record<string, string> = {
  published: 'Publié', draft: 'Brouillon', archived: 'Archivé',
}

export default function PostsPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const load = async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { page: String(page), limit: '20' }
      if (statusFilter) params.status = statusFilter
      const res = await api.articles.list(params)
      let data = res.data || []
      if (search) data = data.filter((a: any) => a.title.toLowerCase().includes(search.toLowerCase()))
      setArticles(data)
      setTotal(res.total || 0)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [statusFilter, page])

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet article définitivement ?')) return
    try { await api.articles.remove(id); await load() }
    catch (e: any) { alert(e.message) }
  }

  const handleTogglePublish = async (article: any) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published'
    try { await api.articles.update(article.id, { status: newStatus }); await load() }
    catch (e: any) { alert(e.message) }
  }

  const filtered = search
    ? articles.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))
    : articles

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">📝 Articles</h1>
          <p className="text-gray-400 text-sm mt-1">{total} article{total > 1 ? 's' : ''} au total</p>
        </div>
        <Link href="/dashboard/posts/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors">
          + Nouvel article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="px-4 py-2 rounded-lg bg-navy-700 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-accent w-60"
        />
        {['', 'published', 'draft', 'archived'].map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === s ? 'bg-accent text-white' : 'bg-navy-700 text-gray-400 hover:text-white'}`}>
            {s === '' ? 'Tous' : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {loading ? (
        <div className="text-center py-16 text-gray-500">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl bg-navy-800 border border-gray-700/50 p-16 text-center">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-gray-400 mb-4">Aucun article trouvé.</p>
          <Link href="/dashboard/posts/new" className="text-accent hover:underline font-medium text-sm">Créer le premier article</Link>
        </div>
      ) : (
        <div className="rounded-xl bg-navy-800 border border-gray-700/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50 text-gray-400 text-sm">
                <th className="text-left py-3 px-5 font-medium">Article</th>
                <th className="text-left py-3 px-5 font-medium hidden lg:table-cell">Catégorie</th>
                <th className="text-left py-3 px-5 font-medium hidden md:table-cell">Statut</th>
                <th className="text-right py-3 px-5 font-medium hidden lg:table-cell">Vues</th>
                <th className="text-left py-3 px-5 font-medium hidden md:table-cell">Date</th>
                <th className="text-right py-3 px-5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-gray-700/20 last:border-0 hover:bg-navy-700/30 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      {a.imageUrl
                        ? <img src={a.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        : <div className="w-10 h-10 rounded-lg bg-navy-600 flex items-center justify-center text-gray-500 text-xs flex-shrink-0">IMG</div>
                      }
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm truncate max-w-xs">{a.title}</p>
                        {a.author && <p className="text-gray-500 text-xs">{a.author}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-gray-400 text-sm hidden lg:table-cell">
                    {a.category?.name || '—'}
                  </td>
                  <td className="py-4 px-5 hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[a.status] || STATUS_STYLE.draft}`}>
                      {STATUS_LABEL[a.status] || a.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-gray-400 text-sm text-right hidden lg:table-cell">
                    {a.viewCount?.toLocaleString() || 0}
                  </td>
                  <td className="py-4 px-5 text-gray-500 text-xs hidden md:table-cell">
                    {new Date(a.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleTogglePublish(a)}
                        className={`text-xs font-semibold transition-colors ${a.status === 'published' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}>
                        {a.status === 'published' ? 'Dépublier' : 'Publier'}
                      </button>
                      <Link href={`/dashboard/posts/${a.id}/edit`} className="text-accent hover:underline text-xs font-semibold">Modifier</Link>
                      <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-300 text-xs font-semibold">Suppr.</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {total > 20 && (
            <div className="p-4 border-t border-gray-700/50 flex justify-center gap-3">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 rounded-lg bg-navy-700 text-gray-400 text-sm disabled:opacity-40 hover:text-white transition-colors">← Précédent</button>
              <span className="px-4 py-2 text-gray-400 text-sm">Page {page}</span>
              <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-lg bg-navy-700 text-gray-400 text-sm disabled:opacity-40 hover:text-white transition-colors">Suivant →</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
