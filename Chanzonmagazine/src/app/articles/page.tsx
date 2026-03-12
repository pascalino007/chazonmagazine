import { Suspense } from 'react'
import { ArticlesPageClient } from './ArticlesPageClient'
import { getPublishedArticles, getActiveCategories } from '@/lib/cms-api'

interface PageProps {
  searchParams: { page?: string; category?: string }
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1')
  const categorySlug = searchParams.category

  // Fetch articles and categories from CMS API
  const [{ data: articles, total }, categories] = await Promise.all([
    getPublishedArticles({
      limit: 6,
      page,
      categorySlug,
    }),
    getActiveCategories(),
  ])

  const totalPages = Math.ceil(total / 6)

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20">
        <Suspense fallback={<div>Loading...</div>}>
          <ArticlesPageClient
            initialArticles={articles}
            totalPages={totalPages}
            currentPage={page}
            categorySlug={categorySlug}
            categories={categories}
          />
        </Suspense>
      </div>
    </div>
  )
}
