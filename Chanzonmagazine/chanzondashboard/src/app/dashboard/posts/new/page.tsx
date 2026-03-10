'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api'

const EMPTY = {
  title: '', shortDescription: '', content: '', author: '', readTime: '',
  videoUrl: '', categoryId: '', tags: '', status: 'draft',
}

export default function NewPostPage() {
  const router = useRouter()
  const [form, setForm] = useState(EMPTY)
  const [categories, setCategories] = useState<any[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioName, setAudioName] = useState('')
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const imgRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    api.categories.list().then(setCategories).catch(() => {})
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImageFiles(files)
    setImagePreviews(files.map((f) => URL.createObjectURL(f)))
  }

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) { setAudioFile(f); setAudioName(f.name) }
  }

  const uploadMedia = async () => {
    setUploading(true)
    try {
      const urls: string[] = []
      if (imageFiles.length > 0) {
        const results: any[] = await Promise.all(imageFiles.map((f) => api.upload.image(f)))
        urls.push(...results.map((r) => r.url))
        setUploadedImageUrls(urls)
      }
      if (audioFile) {
        const r = await api.upload.audio(audioFile)
        setUploadedAudioUrl(r.url)
      }
      return urls
    } catch (e: any) {
      throw new Error(`Upload échoué: ${e.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, publishNow = false) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Le titre est requis'); return }
    if (!form.shortDescription.trim()) { setError('La description courte est requise'); return }
    if (!form.content.trim()) { setError("Le contenu de l'article est requis"); return }
    setError(''); setSaving(true)
    try {
      let imgUrls = uploadedImageUrls
      let audioUrl = uploadedAudioUrl
      if (imageFiles.length > 0 || (audioFile && !uploadedAudioUrl)) {
        const results = await uploadMedia()
        if (imageFiles.length > 0) imgUrls = results
        if (audioFile) audioUrl = uploadedAudioUrl
      }
      const payload = {
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        content: form.content.trim(),
        author: form.author.trim() || undefined,
        readTime: form.readTime.trim() || undefined,
        imageUrl: imgUrls[0] || undefined,
        imageUrls: imgUrls.length > 1 ? imgUrls : undefined,
        audioUrl: audioUrl || undefined,
        videoUrl: form.videoUrl.trim() || undefined,
        categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        status: publishNow ? 'published' : form.status,
      }
      await api.articles.create(payload)
      router.push('/dashboard/posts')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/dashboard/posts" className="text-gray-400 hover:text-accent text-sm font-medium mb-6 inline-flex items-center gap-1">
        ← Articles
      </Link>
      <h1 className="text-2xl font-bold text-white mb-8">📝 Nouvel article</h1>

      {error && <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-700/50 text-red-400 text-sm">{error}</div>}

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Titre <span className="text-accent">*</span></label>
          <input value={form.title} onChange={f('title')} required
            className="w-full px-4 py-3 rounded-xl bg-navy-600 border border-gray-600 text-white text-lg font-medium placeholder-gray-500 focus:outline-none focus:border-accent"
            placeholder="Titre de l'article" />
        </div>

        {/* Short description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description courte <span className="text-accent">*</span></label>
          <textarea value={form.shortDescription} onChange={f('shortDescription')} required rows={2}
            className="w-full px-4 py-3 rounded-xl bg-navy-600 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-accent resize-none"
            placeholder="Résumé de l'article en 1-2 phrases" />
        </div>

        {/* Full article content */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Contenu complet <span className="text-accent">*</span></label>
          <textarea value={form.content} onChange={f('content')} required rows={14}
            className="w-full px-4 py-3 rounded-xl bg-navy-600 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-accent resize-y font-mono text-sm"
            placeholder="Rédigez l'article complet ici..." />
          <p className="text-gray-500 text-xs mt-1">{form.content.length} caractères</p>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Images</label>
          <div
            onClick={() => imgRef.current?.click()}
            className="border-2 border-dashed border-gray-600 hover:border-accent rounded-xl p-8 text-center cursor-pointer transition-colors"
          >
            {imagePreviews.length > 0 ? (
              <div className="flex flex-wrap gap-3 justify-center">
                {imagePreviews.map((src, i) => (
                  <img key={i} src={src} alt="" className="w-24 h-20 object-cover rounded-lg" />
                ))}
                <div className="text-gray-400 text-sm self-center">Cliquez pour changer</div>
              </div>
            ) : (
              <div>
                <p className="text-4xl mb-2">🖼️</p>
                <p className="text-gray-400 text-sm">Cliquez pour sélectionner une ou plusieurs images</p>
                <p className="text-gray-500 text-xs mt-1">JPG, PNG, WebP — max 10 MB par image</p>
              </div>
            )}
          </div>
          <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
          {uploadedImageUrls.length > 0 && (
            <p className="text-green-400 text-xs mt-1">✓ {uploadedImageUrls.length} image(s) uploadée(s)</p>
          )}
        </div>

        {/* Audio */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Audio (note vocale)</label>
          <div
            onClick={() => audioRef.current?.click()}
            className="border-2 border-dashed border-gray-600 hover:border-accent rounded-xl p-6 text-center cursor-pointer transition-colors"
          >
            {audioName ? (
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">🎵</span>
                <span className="text-gray-300 text-sm font-medium">{audioName}</span>
                {uploadedAudioUrl && <span className="text-green-400 text-xs">✓ Uploadé</span>}
              </div>
            ) : (
              <div>
                <p className="text-3xl mb-2">🎙️</p>
                <p className="text-gray-400 text-sm">Cliquez pour ajouter un fichier audio</p>
                <p className="text-gray-500 text-xs mt-1">MP3, WAV, AAC — max 50 MB</p>
              </div>
            )}
          </div>
          <input ref={audioRef} type="file" accept="audio/*" className="hidden" onChange={handleAudioChange} />
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Lien YouTube (vidéo)</label>
          <input value={form.videoUrl} onChange={f('videoUrl')} type="url"
            className="w-full px-4 py-3 rounded-xl bg-navy-600 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
            placeholder="https://www.youtube.com/watch?v=..." />
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Catégorie</label>
            <select value={form.categoryId} onChange={f('categoryId')}
              className="w-full px-3 py-3 rounded-xl bg-navy-600 border border-gray-600 text-white focus:outline-none focus:border-accent">
              <option value="">Aucune</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Auteur</label>
            <input value={form.author} onChange={f('author')}
              className="w-full px-3 py-3 rounded-xl bg-navy-600 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
              placeholder="Nom de l'auteur" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Temps de lecture</label>
            <input value={form.readTime} onChange={f('readTime')}
              className="w-full px-3 py-3 rounded-xl bg-navy-600 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
              placeholder="5 min" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Statut</label>
            <select value={form.status} onChange={f('status')}
              className="w-full px-3 py-3 rounded-xl bg-navy-600 border border-gray-600 text-white focus:outline-none focus:border-accent">
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
          <input value={form.tags} onChange={f('tags')}
            className="w-full px-4 py-3 rounded-xl bg-navy-600 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
            placeholder="éducation, solidarité, afrique (séparés par des virgules)" />
          <p className="text-gray-500 text-xs mt-1">Séparez les tags par des virgules</p>
        </div>

        {/* Upload button */}
        {(imageFiles.length > 0 || (audioFile && !uploadedAudioUrl)) && (
          <button type="button" onClick={uploadMedia} disabled={uploading}
            className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold transition-colors disabled:opacity-50">
            {uploading ? '⏳ Upload en cours...' : '☁️ Uploader les médias vers S3'}
          </button>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving || uploading}
            className="flex-1 py-3 rounded-xl bg-navy-600 border border-gray-500 text-gray-300 text-sm font-semibold hover:text-white hover:border-gray-400 transition-colors disabled:opacity-50">
            {saving ? 'Enregistrement...' : 'Enregistrer comme brouillon'}
          </button>
          <button type="button" disabled={saving || uploading} onClick={(e) => handleSubmit(e as any, true)}
            className="flex-1 py-3 rounded-xl bg-accent hover:bg-accent/90 text-white text-sm font-semibold transition-colors disabled:opacity-50">
            {saving ? 'Publication...' : '🚀 Publier maintenant'}
          </button>
          <Link href="/dashboard/posts"
            className="px-6 py-3 rounded-xl border border-gray-600 text-gray-400 text-sm font-semibold hover:text-white transition-colors flex items-center">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
