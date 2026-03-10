'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const POSITIONS = ['hero', 'editorial', 'sidebar', 'footer']

const empty = { title: '', description: '', imageUrl: '', linkUrl: '', linkLabel: '', position: 'editorial', isActive: true, order: 0, accentColor: '#FF6B35' }

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [form, setForm] = useState<any>(empty)
  const [editId, setEditId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try { setBanners(await api.banners.list()) }
    catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) { await api.banners.update(editId, form) }
      else { await api.banners.create(form) }
      setForm(empty); setEditId(null); await load()
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  const handleEdit = (b: any) => {
    setEditId(b.id)
    setForm({ title: b.title, description: b.description || '', imageUrl: b.imageUrl || '', linkUrl: b.linkUrl || '', linkLabel: b.linkLabel || '', position: b.position, isActive: b.isActive, order: b.order, accentColor: b.accentColor || '#FF6B35' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette bannière ?')) return
    await api.banners.remove(id); await load()
  }

  const handleToggle = async (b: any) => {
    await api.banners.update(b.id, { isActive: !b.isActive }); await load()
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-white">🖼️ Bannières</h1>

      {error && <p className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-navy-700 border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">{editId ? 'Modifier la bannière' : 'Nouvelle bannière'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Titre *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent resize-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">URL de l'image</label>
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Lien URL</label>
                <input value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Label du bouton</label>
                <input value={form.linkLabel} onChange={(e) => setForm({ ...form, linkLabel: e.target.value })}
                  className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Position</label>
                <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
                  className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent">
                  {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Ordre</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })}
                  className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Couleur</label>
                <input type="color" value={form.accentColor} onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                  className="w-full h-10 bg-navy-800 border border-gray-700 rounded-lg cursor-pointer" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="rounded" />
              <label htmlFor="isActive" className="text-gray-300 text-sm">Active</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="flex-1 bg-accent hover:bg-accent/90 text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors">
                {saving ? 'Enregistrement...' : editId ? 'Modifier' : 'Créer'}
              </button>
              {editId && <button type="button" onClick={() => { setEditId(null); setForm(empty) }}
                className="px-4 py-2 rounded-lg bg-navy-600 text-gray-300 text-sm hover:text-white transition-colors">Annuler</button>}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="space-y-3">
          <h2 className="text-white font-semibold">Bannières ({banners.length})</h2>
          {loading ? <p className="text-gray-400 text-sm">Chargement...</p>
          : banners.length === 0 ? <p className="text-gray-500 text-sm">Aucune bannière</p>
          : banners.map((b) => (
            <div key={b.id} className="bg-navy-700 border border-gray-700/50 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${b.isActive ? 'bg-green-400' : 'bg-gray-500'}`} />
                    <p className="text-white text-sm font-medium truncate">{b.title}</p>
                    <span className="text-xs bg-navy-900 text-gray-400 px-2 py-0.5 rounded">{b.position}</span>
                  </div>
                  {b.description && <p className="text-gray-400 text-xs line-clamp-2">{b.description}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleToggle(b)} className="text-xs text-gray-400 hover:text-yellow-400 transition-colors">{b.isActive ? 'Désact.' : 'Act.'}</button>
                  <button onClick={() => handleEdit(b)} className="text-xs text-accent hover:underline">Modifier</button>
                  <button onClick={() => handleDelete(b.id)} className="text-xs text-red-400 hover:underline">Suppr.</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
