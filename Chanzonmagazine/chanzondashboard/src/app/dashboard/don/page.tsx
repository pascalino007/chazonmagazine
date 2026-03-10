'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'En attente', color: 'bg-yellow-900/40 text-yellow-300' },
  completed: { label: 'Complété',   color: 'bg-green-900/40 text-green-300' },
  failed:    { label: 'Échoué',     color: 'bg-red-900/40 text-red-300' },
  refunded:  { label: 'Remboursé',  color: 'bg-gray-700 text-gray-300' },
}

export default function DonPage() {
  const [data, setData] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [updating, setUpdating] = useState<number | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { limit: '50' }
      if (statusFilter) params.status = statusFilter
      const [res, s] = await Promise.all([api.transactions.list(params), api.transactions.stats()])
      setData(res.data || [])
      setStats(s)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [statusFilter])

  const handleStatus = async (id: number, status: string) => {
    setUpdating(id)
    try { await api.transactions.update(id, { status }); await load() }
    catch (e: any) { alert(e.message) }
    finally { setUpdating(null) }
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-white">💳 Don & Transactions</h1>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total transactions', value: stats.total, icon: '📋' },
            { label: 'Complétées', value: stats.completed, icon: '✅' },
            { label: 'En attente', value: stats.pending, icon: '⏳' },
            { label: 'Montant total', value: `${stats.totalAmount?.toFixed(2)} €`, icon: '💰' },
          ].map((s) => (
            <div key={s.label} className="bg-navy-700 border border-gray-700/50 rounded-xl p-5">
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-gray-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-3">
        <label className="text-gray-400 text-sm">Filtrer:</label>
        {['', 'pending', 'completed', 'failed', 'refunded'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === s ? 'bg-accent text-white' : 'bg-navy-600 text-gray-400 hover:text-white'
            }`}
          >
            {s === '' ? 'Tous' : STATUS_LABELS[s]?.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : error ? (
        <p className="text-red-400">Erreur: {error}</p>
      ) : (
        <div className="bg-navy-700 border border-gray-700/50 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-700">
              <tr className="text-gray-500">
                <th className="text-left p-4 font-medium">Référence</th>
                <th className="text-left p-4 font-medium">Donateur</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-right p-4 font-medium">Montant</th>
                <th className="text-left p-4 font-medium">Statut</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Aucune transaction</td></tr>
              ) : data.map((t) => (
                <tr key={t.id} className="border-b border-gray-700/30 hover:bg-navy-600/30 transition-colors">
                  <td className="p-4 font-mono text-xs text-gray-400">{t.reference}</td>
                  <td className="p-4 text-white">{t.isAnonymous ? '🕵️ Anonyme' : t.donorName}</td>
                  <td className="p-4 text-gray-400">{t.donorEmail || '—'}</td>
                  <td className="p-4 text-accent font-bold text-right">{parseFloat(t.amount).toFixed(2)} {t.currency}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_LABELS[t.status]?.color}`}>
                      {STATUS_LABELS[t.status]?.label}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-xs">{new Date(t.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="p-4">
                    {t.status === 'pending' && (
                      <button
                        disabled={updating === t.id}
                        onClick={() => handleStatus(t.id, 'completed')}
                        className="px-3 py-1 rounded bg-green-800 hover:bg-green-700 text-green-200 text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        {updating === t.id ? '...' : 'Valider'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
