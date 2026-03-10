'use client'

import Link from 'next/link'
import { AudioPlayer } from './AudioPlayer'
import { LikeShareButtons } from './LikeShareButtons'

export interface ArticleCardProps {
  slug: string
  category: string
  title: string
  description: string
  author: string
  date: string
  readTime: string
  imageUrl: string
  audioUrl?: string
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
  audioUrl,
}: ArticleCardProps) {
  return (
    <div className="group block card-lift h-full">
      <article className="bg-white rounded-2xl overflow-hidden border border-slate-200/70 h-full flex flex-col shadow-sm">
        {/* Clickable image area */}
        <Link href={`/article/${slug}`} className="relative aspect-[16/10] img-zoom block">
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-accent text-white text-xs font-bold uppercase tracking-wide shadow-md">
            {category}
          </span>
        </Link>

        <div className="p-5 flex-1 flex flex-col">
          {/* Clickable title + description */}
          <Link href={`/article/${slug}`} className="flex-1 flex flex-col">
            <h3 className="font-bold text-primary group-hover:text-accent transition-colors duration-200 line-clamp-2 mb-2 text-base leading-snug">
              {title}
            </h3>
            <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">{description}</p>
          </Link>

          {/* Author meta */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mb-0">
            <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-xs flex-shrink-0">
              {author[0]}
            </div>
            <span className="text-slate-600 text-xs font-medium">{author}</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-400 text-xs">{date}</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-400 text-xs">{readTime}</span>
          </div>

          {/* Audio player */}
          {audioUrl && (
            <div className="mt-3">
              <AudioPlayer audioUrl={audioUrl} title={title} />
            </div>
          )}

          {/* Like & Share */}
          <div className="mt-3">
            <LikeShareButtons slug={slug} title={title} />
          </div>
        </div>
      </article>
    </div>
  )
}
