'use client'

import { useState, useEffect } from 'react'
import { getActiveCategories, createReportage } from '@/lib/cms-api'

export function ReportageForm() {
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    shortDescription: '',
    content: '',
    imageUrl: '',
    videoUrl: '',
    audioUrl: '',
    readTime: '',
    tags: [] as string[],
    categorySlug: '',
  })
  const [categories, setCategories] = useState([])
  const [currentTag, setCurrentTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getActiveCategories()
        setCategories(cats)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, currentTag.trim()] }))
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const data = {
        ...formData,
        status: 'published',
        tags: formData.tags,
      }
      await createReportage(data)
      setMessage('Reportage créé avec succès!')
      // Reset form
      setFormData({
        slug: '',
        title: '',
        shortDescription: '',
        content: '',
        imageUrl: '',
        videoUrl: '',
        audioUrl: '',
        readTime: '',
        tags: [],
        categorySlug: '',
      })
    } catch (error) {
      setMessage('Erreur lors de la création du reportage')
      console.error('Failed to create reportage:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Slug *
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-navy-600 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="slug-du-reportage"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Catégorie *
          </label>
          <select
            name="categorySlug"
            value={formData.categorySlug}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-navy-600 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat: any) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Titre *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 bg-navy-600 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="Titre du reportage"
        />
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description courte *
        </label>
        <textarea
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleInputChange}
          required
          rows={3}
          className="w-full px-3 py-2 bg-navy-600 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="Description courte du reportage"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Contenu *
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
          rows={6}
          className="w-full px-3 py-2 bg-navy-600 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="Contenu complet du reportage"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            URL de l'image *
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-navy-600 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="https://..."
          />
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            URL de la vidéo *
          </label>
          <input
            type="url"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-navy-600 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audio URL */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            URL de l'audio (optionnel)
          </label>
          <input
            type="url"
            name="audioUrl"
            value={formData.audioUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-navy-600 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="https://..."
          />
        </div>

        {/* Read Time */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Temps de lecture (optionnel)
          </label>
          <input
            type="text"
            name="readTime"
            value={formData.readTime}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-navy-600 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="5 min"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-3 py-2 bg-navy-600 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Ajouter un tag"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/80 transition-colors"
          >
            Ajouter
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-accent/20 text-accent rounded-md text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-accent hover:text-accent/80"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Création...' : 'Créer le reportage'}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-md ${message.includes('succès') ? 'bg-green-600/20 text-green-400 border border-green-600/50' : 'bg-red-600/20 text-red-400 border border-red-600/50'}`}>
          {message}
        </div>
      )}
    </form>
  )
}
