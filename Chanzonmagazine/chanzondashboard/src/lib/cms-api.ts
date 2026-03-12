const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.chazonmagazine.com/api'

export interface CmsArticle {
  id: number
  slug: string
  title: string
  shortDescription: string
  content: string
  imageUrl?: string
  imageUrls?: string[]
  audioUrl?: string
  videoUrl?: string
  author?: string
  readTime?: string
  status: string
  viewCount: number
  categoryId?: number
  category?: {
    id: number
    name: string
    slug: string
  }
  tags?: Array<{
    id: number
    name: string
    slug: string
  }>
  createdAt: string
  updatedAt: string
}

export interface CmsCategory {
  id: number
  slug: string
  name: string
  description?: string
  color?: string
  isActive: boolean
  order: number
}

export interface CmsBanner {
  id: number
  title: string
  description?: string
  imageUrl?: string
  linkUrl?: string
  linkLabel?: string
  position: string
  isActive: boolean
  order: number
  accentColor?: string
  createdAt: string
  updatedAt: string
}

async function apiFetch<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate },
    })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

export async function getActiveCategories(): Promise<CmsCategory[]> {
  const result = await apiFetch<CmsCategory[]>('/categories?active=true', 3600)
  return result ?? []
}

export async function createReportage(data: {
  slug: string
  title: string
  shortDescription: string
  content: string
  imageUrl: string
  videoUrl: string
  audioUrl?: string
  readTime?: string
  tags: string[]
  categorySlug: string
  status: string
}): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/reportages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create reportage')
    return res.json()
  } catch (error) {
    throw error
  }
}

export async function updatePost(id: number, data: Partial<CmsArticle>): Promise<CmsArticle> {
  const res = await fetch(`${API_BASE}/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update post')
  return res.json()
}

export async function updateBanner(id: number, data: Partial<CmsBanner>): Promise<CmsBanner> {
  const res = await fetch(`${API_BASE}/banners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update banner')
  return res.json()
}

export async function getPublishedArticles(opts?: {
  limit?: number
  page?: number
  categorySlug?: string
}): Promise<{ data: CmsArticle[]; total: number }> {
  const q = new URLSearchParams()
  if (opts?.limit) q.set('limit', String(opts.limit))
  if (opts?.page) q.set('page', String(opts.page))
  if (opts?.categorySlug) q.set('category', opts.categorySlug)
  const result = await apiFetch<{ data: CmsArticle[]; total: number }>(
    `/articles/published?${q}`,
    60,
  )
  return result ?? { data: [], total: 0 }
}

export async function getActiveBanners(position?: string): Promise<CmsBanner[]> {
  const path = position ? `/banners?position=${position}` : '/banners?active=true'
  const result = await apiFetch<CmsBanner[]>(path, 300)
  return result ?? []
}
