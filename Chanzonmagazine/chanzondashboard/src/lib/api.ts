const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444/api'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('chanzon_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || `API error ${res.status}`)
  }
  return res.json()
}

async function uploadFile(path: string, formData: FormData): Promise<any> {
  const token = getToken()
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', body: formData, headers })
  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`)
  return res.json()
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      request<{ access_token: string; user: any }>('/auth/login', {
        method: 'POST', body: JSON.stringify({ username, password }),
      }),
  },
  articles: {
    list: (params?: Record<string, string>) =>
      request<any>(`/articles?${new URLSearchParams(params)}`),
    get: (id: number) => request<any>(`/articles/${id}`),
    create: (data: any) => request<any>('/articles', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => request<any>(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number) => request<void>(`/articles/${id}`, { method: 'DELETE' }),
    stats: () => request<any>('/articles/stats'),
  },
  categories: {
    list: () => request<any[]>('/categories'),
    create: (data: any) => request<any>('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => request<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number) => request<void>(`/categories/${id}`, { method: 'DELETE' }),
  },
  banners: {
    list: () => request<any[]>('/banners'),
    create: (data: any) => request<any>('/banners', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => request<any>(`/banners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number) => request<void>(`/banners/${id}`, { method: 'DELETE' }),
  },
  projects: {
    list: () => request<any[]>('/projects'),
    get: (id: number) => request<any>(`/projects/${id}`),
    create: (data: any) => request<any>('/projects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => request<any>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number) => request<void>(`/projects/${id}`, { method: 'DELETE' }),
  },
  transactions: {
    list: (params?: Record<string, string>) =>
      request<any>(`/transactions?${new URLSearchParams(params)}`),
    stats: () => request<any>('/transactions/stats'),
    update: (id: number, data: any) => request<any>(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  analytics: {
    stats: () => request<any>('/analytics/stats'),
    articlesPerDay: (days = 30) => request<any[]>(`/analytics/articles-per-day?days=${days}`),
    articlesPerMonth: () => request<any[]>('/analytics/articles-per-month'),
    viewsPerDay: (days = 30) => request<any[]>(`/analytics/views-per-day?days=${days}`),
    likesPerArticle: () => request<any[]>('/analytics/likes-per-article'),
    topArticles: () => request<any[]>('/analytics/top-articles'),
  },
  upload: {
    image: (file: File, folder = 'images') => {
      const fd = new FormData(); fd.append('file', file)
      return uploadFile(`/upload/image?folder=${folder}`, fd)
    },
    images: (files: File[]) => {
      const fd = new FormData(); files.forEach((f) => fd.append('files', f))
      return uploadFile('/upload/images', fd)
    },
    audio: (file: File) => {
      const fd = new FormData(); fd.append('file', file)
      return uploadFile('/upload/audio', fd)
    },
  },
}
