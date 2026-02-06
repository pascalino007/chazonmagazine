import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleBySlug } from '@/lib/articles'

type Props = { params: Promise<{ slug: string }> | { slug: string } }

export async function generateMetadata({ params }: Props) {
  const { slug } = await Promise.resolve(params)
  const article = getArticleBySlug(slug)
  if (!article) return { title: 'Article non trouvé | HUMANITÉ+' }
  return { title: `${article.title} | HUMANITÉ+`, description: article.description }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await Promise.resolve(params)
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  return (
    <article className="min-h-screen">
      <div className="relative bg-navy-800">
        <div className="absolute inset-0 z-0">
          <img src={article.imageUrl} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/90 via-navy-900/70 to-navy-900" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-accent text-sm font-medium mb-8 transition-colors">
            ← Retour aux articles
          </Link>
          <span className="inline-flex px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
            {article.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            {article.title}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">{article.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
            <span className="font-medium text-white">{article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime} de lecture</span>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="prose prose-invert prose-lg max-w-none">
          {article.content.map((paragraph, i) => (
            <p key={i} className="text-gray-300 leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700">
          <Link href="/" className="inline-flex items-center gap-2 text-accent hover:text-accent-light font-medium transition-colors">
            ← Voir tous les articles
          </Link>
        </div>
      </div>
    </article>
  )
}
