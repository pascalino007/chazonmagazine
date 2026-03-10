import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleBySlug, formatArticleDate } from '@/lib/cms-api'
import { AudioPlayer } from '@/components/AudioPlayer'

type Props = { params: Promise<{ slug: string }> | { slug: string } }

export async function generateMetadata({ params }: Props) {
  const { slug } = await Promise.resolve(params)
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Article non trouvé | HUMANITÉ+' }
  return {
    title: `${article.title} | HUMANITÉ+`,
    description: article.shortDescription,
    openGraph: { images: article.imageUrl ? [article.imageUrl] : [] },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await Promise.resolve(params)
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  return (
    <article className="min-h-screen bg-white">
      {/* Hero header */}
      <div className="relative bg-slate-100" style={{ minHeight: '340px' }}>
        {article.imageUrl && (
          <div className="absolute inset-0 z-0">
            <img src={article.imageUrl} alt="" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white" />
          </div>
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-accent text-sm font-medium mb-8 transition-colors">
            ← Retour aux articles
          </Link>
          {article.category && (
            <span
              className="inline-flex px-3 py-1 rounded-full text-sm font-medium mb-4 mr-2"
              style={{
                background: article.category.color ? `${article.category.color}22` : 'rgba(255,107,53,0.12)',
                color: article.category.color ?? '#FF6B35',
                border: `1px solid ${article.category.color ?? '#FF6B35'}44`,
              }}
            >
              {article.category.name}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight mb-6">
            {article.title}
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl">{article.shortDescription}</p>
          <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-xs">
                {article.author[0]}
              </div>
              <span className="font-medium text-primary">{article.author}</span>
            </div>
            <span>·</span>
            <span>{formatArticleDate(article.createdAt)}</span>
            {article.readTime && <>
              <span>·</span>
              <span>{article.readTime} de lecture</span>
            </>}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1 w-full">
                {article.tags.map((t) => (
                  <span key={t.id} className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-500">#{t.name}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cover image */}
      {article.imageUrl && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="rounded-2xl overflow-hidden shadow-xl aspect-[16/8]">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Audio player */}
      {article.audioUrl && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <AudioPlayer audioUrl={article.audioUrl} title={article.title} />
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-accent">
          {article.content ? (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            <p className="text-slate-400">Contenu non disponible.</p>
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <span key={t.id} className="px-3 py-1 rounded-full text-xs bg-slate-100 text-slate-500 font-medium">#{t.name}</span>
            ))}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link href="/" className="inline-flex items-center gap-2 text-accent hover:text-accent-light font-medium transition-colors">
            ← Voir tous les articles
          </Link>
        </div>
      </div>
    </article>
  )
}
