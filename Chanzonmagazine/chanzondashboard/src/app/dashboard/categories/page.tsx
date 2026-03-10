'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const COLORS = ['#FF6B35', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4']
const empty = { name: '', slug: '', description: '', color: '#FF6B35', isActive: true, order: 0 }

function toSlug(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [form, setForm] = useState<any>(empty)
  const [editId, setEditId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try { setCategories(await api.categories.list()) }
    catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editId) { await api.categories.update(editId, form) }
      else { await api.categories.create(form) }
      setForm(empty); setEditId(null); await load()
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  const handleEdit = (c: any) => {
    setEditId(c.id)
    setForm({ name: c.name, slug: c.slug, description: c.description || '', color: c.color || '#FF6B35', isActive: c.isActive, order: c.order })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette catégorie ?')) return
    await api.categories.remove(id); await load()
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-white">🗂️ Catégories</h1>
      {error && <p className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-navy-700 border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">{editId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Nom *</label>
              <input required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value, slug: editId ? form.slug : toSlug(e.target.value) })}
                className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
                placeholder="Politique" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 text-sm font-mono focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent resize-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">Couleur</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${form.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ background: c }} />
                ))}
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-7 h-7 rounded-full cursor-pointer border-0" title="Couleur personnalisée" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Ordre</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })}
                  className="w-full bg-navy-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                  <span className="text-gray-300 text-sm">Active</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="flex-1 bg-accent hover:bg-accent/90 text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                {saving ? '...' : editId ? 'Modifier' : 'Créer'}
              </button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setForm(empty) }}
                  className="px-4 py-2 rounded-lg bg-navy-600 text-gray-300 text-sm hover:text-white">Annuler</button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="space-y-3">
          <h2 className="text-white font-semibold">Catégories ({categories.length})</h2>
          {loading ? <p className="text-gray-400 text-sm">Chargement...</p>
          : categories.length === 0 ? <p className="text-gray-500 text-sm">Aucune catégorie. Créez-en une !</p>
          : categories.map((c) => (
            <div key={c.id} className="bg-navy-700 border border-gray-700/50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: c.color || '#FF6B35' }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm font-medium">{c.name}</p>
                  {!c.isActive && <span className="text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">Inactive</span>}
                </div>
                <p className="text-gray-500 text-xs font-mono">{c.slug}</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button onClick={() => handleEdit(c)} className="text-xs text-accent hover:underline">Modifier</button>
                <button onClick={() => handleDelete(c.id)} className="text-xs text-red-400 hover:underline">Suppr.</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
