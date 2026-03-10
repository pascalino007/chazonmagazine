'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'

export interface Category {
  id: string
  name: string
  slug: string
}

export interface PostSection {
  id: string
  content: string
}

export interface Post {
  id: string
  name: string
  image: string
  categoryId: string
  sections: PostSection[]
  createdAt: string
  updatedAt: string
}

const STORAGE_CATEGORIES = 'chanzon_categories'
const STORAGE_POSTS = 'chanzon_posts'

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

interface DashboardContextValue {
  categories: Category[]
  posts: Post[]
  loading: boolean
  addCategory: (data: { name: string; slug: string }) => Promise<Category>
  updateCategory: (id: string, data: { name: string; slug: string }) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  getCategory: (id: string) => Category | undefined
  addPost: (data: { name: string; image: string; categoryId: string; sections: PostSection[] }) => Promise<Post>
  updatePost: (id: string, data: { name: string; image: string; categoryId: string; sections: PostSection[] }) => Promise<void>
  deletePost: (id: string) => Promise<void>
  getPost: (id: string) => Post | undefined
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

function mapArticle(a: any): Post {
  return {
    id: a.id,
    name: a.title,
    image: a.imageUrl || '',
    categoryId: a.categoryId,
    sections: a.content ? JSON.parse(a.content) : [],
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }
}

function ensureSections(sections: PostSection[], min = 3): PostSection[] {
  if (sections.length >= min) return sections
  const extra = Array(min - sections.length).fill(0).map(() => ({ id: generateId(), content: '' }))
  return [...sections, ...extra]
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('chanzon_token')
    if (token) {
      const load = async () => {
        try {
          const [cats, arts] = await Promise.all([
            api.categories.list(),
            api.articles.list()
          ])
          setCategories(cats)
          setPosts(arts.map(mapArticle))
        } catch (e) {
          console.error('Failed to load data:', e)
        } finally {
          setLoading(false)
        }
      }
      load()
    } else {
      setLoading(false)
    }
  }, [])

  const updateCategory = useCallback(async (id: string, data: { name: string; slug: string }) => {
    await api.categories.update(+id, data)
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
  }, [])

  const addCategory = useCallback(async (data: { name: string; slug: string }) => {
    const res = await api.categories.create(data)
    setCategories((prev) => [...prev, res])
    return res
  }, [])

  const deleteCategory = useCallback(async (id: string) => {
    await api.categories.remove(+id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
    setPosts((prev) => prev.filter((p) => p.categoryId !== id))
  }, [])

  const getCategory = useCallback((id: string) => categories.find((c) => c.id === id), [categories])

  const addPost = useCallback(async (data: { name: string; image: string; categoryId: string; sections: PostSection[] }) => {
    const mapped = {
      title: data.name,
      imageUrl: data.image,
      categoryId: data.categoryId,
      content: JSON.stringify(data.sections),
      status: 'published'
    }
    const res = await api.articles.create(mapped)
    const newPost = mapArticle(res)
    setPosts((prev) => [...prev, newPost])
    return newPost
  }, [])

  const updatePost = useCallback(async (id: string, data: { name: string; image: string; categoryId: string; sections: PostSection[] }) => {
    const mapped = {
      title: data.name,
      imageUrl: data.image,
      categoryId: data.categoryId,
      content: JSON.stringify(data.sections)
    }
    await api.articles.update(parseInt(id), mapped)
    const updated = mapArticle(await api.articles.get(parseInt(id)))
    setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)))
  }, [])

  const deletePost = useCallback(async (id: string) => {
    await api.articles.remove(parseInt(id))
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const getPost = useCallback((id: string) => posts.find((p) => p.id === id), [posts])

  const value: DashboardContextValue = {
    categories,
    posts,
    loading,
    
  
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    addPost,
    updatePost,
    deletePost,
    getPost,
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}
