'use client'

import { useTransition, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArticleCard } from '@/components/ArticleCard'
import { CmsArticle, CmsCategory, getPublishedArticles, formatArticleDate } from '@/lib/cms-api'

interface ArticlesPageClientProps {
  initialArticles: CmsArticle[]
  totalPages: number
  currentPage: number
  categorySlug?: string
  categories: CmsCategory[]
}

export function ArticlesPageClient({
  initialArticles,
  totalPages: initialTotalPages,
  currentPage: initialCurrentPage,
  categorySlug: initialCategorySlug,
  categories
}: ArticlesPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [articles, setArticles] = useState(initialArticles)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [currentPage, setCurrentPage] = useState(initialCurrentPage)
  const [categorySlug, setCategorySlug] = useState(initialCategorySlug)

  // Fetch articles when page or category changes
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1')
    const category = searchParams.get('category') || undefined

    // Only fetch if different from current state
    if (page !== currentPage || category !== categorySlug) {
      startTransition(async () => {
        try {
          const { data, total } = await getPublishedArticles({
            limit: 6,
            page,
            categorySlug: category,
          })
          setArticles(data)
          setTotalPages(Math.ceil(total / 6))
          setCurrentPage(page)
          setCategorySlug(category)
        } catch (error) {
          console.error('Failed to fetch articles:', error)
          // Keep current data on error
        }
      })
    }
  }, [searchParams, currentPage, categorySlug])

  const handlePageChange = (page: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', String(page))
      router.push(`/articles?${params}`)
    })
  }

  const handleCategoryChange = (newCategorySlug?: string) => {
    startTransition(() => {
      const params = new URLSearchParams()
      params.set('page', '1') // Reset to page 1 when changing category
      if (newCategorySlug) params.set('category', newCategorySlug)
      router.push(`/articles?${params}`)
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
      {/* Category Filters */}
      <div className="mb-10">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange(undefined)}
            disabled={isPending}
            className={`px-4 py-2 rounded-full text-xs font-semibold ${
              !categorySlug
                ? 'bg-accent text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-accent hover:text-accent'
            } transition-all duration-200 ${isPending ? 'opacity-50' : ''}`}
          >
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              disabled={isPending}
              className={`px-4 py-2 rounded-full text-xs font-semibold ${
                categorySlug === cat.slug
                  ? 'bg-accent text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-accent hover:text-accent'
              } transition-all duration-200 ${isPending ? 'opacity-50' : ''}`}
              style={categorySlug === cat.slug && cat.color ? { background: cat.color } : undefined}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2">Articles</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-primary flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-accent to-accent-light rounded-full" aria-hidden />
            {categorySlug ? `Articles - ${categories.find(c => c.slug === categorySlug)?.name}` : 'Tous les Articles'}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Analyses, enquêtes et actualités du monde humanitaire
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      )}

      {/* Articles Grid */}
      {!isPending && articles.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <p className="text-4xl mb-3">📝</p>
          <p>Aucun article trouvé pour cette catégorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 mb-12">
          {(isPending ? [] : articles).map((article) => (
            <ArticleCard
              key={article.slug}
              slug={article.slug}
              category={article.category?.name ?? 'Actualité'}
              title={article.title}
              description={article.shortDescription}
              author={article.author}
              date={formatArticleDate(article.createdAt)}
              readTime={article.readTime ?? ''}
              imageUrl={article.imageUrl || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80'}
              audioUrl={article.audioUrl}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !isPending && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              disabled={isPending}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                pageNum === currentPage
                  ? 'bg-accent text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-accent hover:text-accent'
              } transition-all duration-200 ${isPending ? 'opacity-50' : ''}`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
