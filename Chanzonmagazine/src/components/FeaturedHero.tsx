import { getPublishedArticles, formatArticleDate } from '@/lib/cms-api'
import { FeaturedHeroClient } from './FeaturedHeroClient'
import type { HeroSlide } from './FeaturedHeroClient'

export async function FeaturedHero() {
  const { data: articles } = await getPublishedArticles({ limit: 5 })

  const slides: HeroSlide[] = articles.map((a) => ({
    src: a.imageUrl || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=85',
    alt: a.title,
    tag: a.category?.name ?? 'Actualité',
    title: a.title,
    description: a.shortDescription,
    author: a.author,
    date: formatArticleDate(a.createdAt),
    readTime: a.readTime ?? '',
    href: `/article/${a.slug}`,
  }))

  return <FeaturedHeroClient slides={slides} />
}
