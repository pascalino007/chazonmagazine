import { ArticleCard } from './ArticleCard'
import { CategoryFilters } from './CategoryFilters'
import { ScrollReveal } from './ScrollReveal'
import { getPublishedArticles, getActiveCategories, formatArticleDate } from '@/lib/cms-api'

export async function ArticlesSection() {
  const [{ data: articles }, categories] = await Promise.all([
    getPublishedArticles({ limit: 6 }),
    getActiveCategories(),
  ])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
      <ScrollReveal className="mb-6">
        <CategoryFilters categories={categories} />
      </ScrollReveal>

      <ScrollReveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2">Actualités</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-primary flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-accent to-accent-light rounded-full" aria-hidden />
            Derniers Articles
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Analyses, enquêtes et actualités du monde humanitaire
          </p>
        </div>
      </ScrollReveal>

      {articles.length === 0 ? (
        <div className="col-span-3 py-16 text-center text-slate-400">
          <p className="text-4xl mb-3">📝</p>
          <p>Aucun article publié pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {articles.map((article, i) => (
            <ScrollReveal key={article.slug} delay={i * 80}>
              <ArticleCard
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
            </ScrollReveal>
          ))}
        </div>
      )}

      <ScrollReveal className="flex justify-center mt-12">
        <a
          href="/articles"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-slate-200 text-primary hover:border-accent hover:text-accent transition-all duration-200 font-semibold text-sm group"
        >
          Voir plus d&apos;articles
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-200 group-hover:translate-x-1">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </ScrollReveal>
    </section>
  )
}
