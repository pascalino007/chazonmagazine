import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublishedArticles, getActiveCategories, formatArticleDate } from '@/lib/cms-api'
import { ArticleCard } from '@/components/ArticleCard'
import { CategoryFilters } from '@/components/CategoryFilters'

type Props = { params: Promise<{ category: string }> | { category: string } }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props) {
  const { category } = await Promise.resolve(params)
  const categories = await getActiveCategories()
  const cat = categories.find((c) => c.slug === category)
  if (!cat) return { title: 'Catégorie | HUMANITÉ+' }
  return {
    title: `${cat.name} | HUMANITÉ+`,
    description: cat.description ?? `Articles et reportages sur ${cat.name}.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await Promise.resolve(params)

  const [categories, { data: articles }] = await Promise.all([
    getActiveCategories(),
    getPublishedArticles({ categorySlug: category, limit: 30 }),
  ])

  const cat = categories.find((c) => c.slug === category)
  if (!cat) notFound()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-200" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-accent text-sm font-medium mb-6 transition-colors">
            ← Retour à l&apos;accueil
          </Link>
          <div className="flex items-center gap-3 mb-4">
            {cat.color && <span className="w-1.5 h-10 rounded-full" style={{ background: cat.color }} aria-hidden />}
            <h1 className="text-3xl sm:text-4xl font-bold text-primary">{cat.name}</h1>
          </div>
          {cat.description && <p className="text-slate-600 mb-3 max-w-xl">{cat.description}</p>}
          <p className="text-slate-400 text-sm">
            {articles.length} article{articles.length !== 1 ? 's' : ''} dans cette catégorie
          </p>
        </div>
      </div>

      {/* Category filter bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <CategoryFilters categories={categories} />
      </div>

      {/* Articles grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-slate-600 mb-6">Aucun article dans cette catégorie pour le moment.</p>
            <Link href="/" className="text-accent hover:text-accent-light font-medium text-sm">← Voir tous les articles</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {articles.map((article) => (
              <ArticleCard
                key={article.slug}
                slug={article.slug}
                category={article.category?.name ?? cat.name}
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
      </div>
    </div>
  )
}
