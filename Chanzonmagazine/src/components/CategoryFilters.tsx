'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { CmsCategory } from '@/lib/cms-api'

interface CategoryFiltersProps {
  categories: CmsCategory[]
}

export function CategoryFilters({ categories }: CategoryFiltersProps) {
  const pathname = usePathname()
  const currentCategory = pathname.startsWith('/category/')
    ? pathname.split('/category/')[1]?.split('/')[0] ?? null
    : null

  const activeClass = 'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide bg-accent text-white shadow-md shadow-accent/25 transition-all'
  const inactiveClass = 'px-4 py-2 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:border-accent hover:text-accent transition-all duration-200'

  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/" className={!currentCategory ? activeClass : inactiveClass}>
        Tous
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/category/${cat.slug}`}
          className={currentCategory === cat.slug ? activeClass : inactiveClass}
          style={currentCategory === cat.slug && cat.color ? { background: cat.color, boxShadow: `0 4px 12px ${cat.color}44` } : undefined}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}
