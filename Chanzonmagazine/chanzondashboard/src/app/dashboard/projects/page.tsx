'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const empty = { title: '', shortDescription: '', content: '', imageUrl: '', location: '', category: '', status: 'En cours', goalAmount: '', isActive: true, order: 0 }

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [form, setForm] = useState<any>(empty)
  const [editId, setEditId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    try { setProjects(await api.projects.list()) }
    catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, goalAmount: form.goalAmount ? parseFloat(form.goalAmount) : null }
      if (editId) { await api.projects.update(editId, payload) }
      else { await api.projects.create(payload) }
      setForm(empty); setEditId(null); setShowForm(false); await load()
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  const handleEdit = (p: any) => {
    setEditId(p.id)
    setForm({ title: p.title, shortDescription: p.shortDescription, content: p.content || '', imageUrl: p.imageUrl || '', location: p.location || '', category: p.category || '', status: p.status || 'En cours', goalAmount: p.goalAmount || '', isActive: p.isActive, order: p.order })
    setShowForm(true); window.scrollTo(0, 0)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce projet ?')) return
    await api.projects.remove(id); await load()
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">🚀 Projets</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(empty) }}
          className="bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          + Nouveau projet
        </button>
      </div>

      {error && <p className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">{error}</p>}

      {/* Form Modal */}
      {showForm && (
        <div className="bg-navy-700 border border-gray-700/50 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">{editId ? 'Modifier le projet' : 'Nouveau projet'}</h2>
            <button onClick={() => { setShowForm(false); setEditId(null) }} className="text-gray-400 hover:text-white">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Titre *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Lieu</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Description courte *</label>
              <textarea required rows={2} value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent resize-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Contenu détaillé</label>
              <textarea rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent resize-y" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Image URL</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Catégorie</label>
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Statut</label>
                <input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Objectif (€)</label>
                <input type="number" step="0.01" value={form.goalAmount} onChange={(e) => setForm({ ...form, goalAmount: e.target.value })}
                  className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="projActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              <label htmlFor="projActive" className="text-gray-300 text-sm">Projet actif (visible sur le site)</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="flex-1 bg-accent hover:bg-accent/90 text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50">
                {saving ? 'Enregistrement...' : editId ? 'Modifier' : 'Créer'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null) }}
                className="px-5 py-2.5 rounded-lg bg-navy-600 text-gray-300 text-sm hover:text-white">Annuler</button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? <p className="text-gray-400">Chargement...</p>
      : projects.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">🚀</p>
          <p>Aucun projet. Créez votre premier projet !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-navy-700 border border-gray-700/50 rounded-xl overflow-hidden">
              {p.imageUrl && <img src={p.imageUrl} alt="" className="w-full h-32 object-cover" />}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mb-2 ${p.isActive ? 'bg-green-900/40 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                      {p.isActive ? 'Actif' : 'Inactif'}
                    </span>
                    <h3 className="text-white font-semibold">{p.title}</h3>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{p.shortDescription}</p>
                  </div>
                </div>
                {p.goalAmount && (
                  <div className="mt-3 mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Collecté: {parseFloat(p.raisedAmount || 0).toFixed(0)} €</span>
                      <span>Objectif: {parseFloat(p.goalAmount).toFixed(0)} €</span>
                    </div>
                    <div className="w-full bg-navy-900 rounded-full h-1.5">
                      <div className="bg-accent h-1.5 rounded-full" style={{ width: `${Math.min(100, (parseFloat(p.raisedAmount || 0) / parseFloat(p.goalAmount)) * 100)}%` }} />
                    </div>
                  </div>
                )}
                <div className="flex gap-3 mt-3">
                  <button onClick={() => handleEdit(p)} className="flex-1 py-1.5 rounded-lg bg-navy-600 text-accent text-xs font-semibold hover:bg-navy-500 transition-colors">Modifier</button>
                  <button onClick={() => handleDelete(p.id)} className="px-4 py-1.5 rounded-lg bg-red-900/30 text-red-400 text-xs font-semibold hover:bg-red-900/50 transition-colors">Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
