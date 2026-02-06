import Link from 'next/link'

export interface ArticleCardProps {
  slug: string
  category: string
  title: string
  description: string
  author: string
  date: string
  readTime: string
  imageUrl: string
}

export function ArticleCard({
  slug,
  category,
  title,
  description,
  author,
  date,
  readTime,
  imageUrl,
}: ArticleCardProps) {
  return (
    <Link href={`/article/${slug}`} className="group block">
      <article className="bg-navy-600/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600 transition-colors h-full flex flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-accent text-white text-xs font-medium">
            {category}
          </span>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-white group-hover:text-accent transition-colors line-clamp-2 mb-2">
            {title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">{description}</p>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>{author}</span>
            <span>•</span>
            <span>{date}</span>
            <span>•</span>
            <span>{readTime}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
