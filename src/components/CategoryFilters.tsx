'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const CATEGORIES = [
  { id: 'education', label: 'Éducation' },
  { id: 'sante', label: 'Santé' },
  { id: 'solidarite', label: 'Solidarité' },
  { id: 'refugies', label: 'Réfugiés' },
  { id: 'eau-sante', label: 'Eau & Santé' },
  { id: 'environnement', label: 'Environnement' },
  { id: 'autonomisation', label: 'Autonomisation' },
  { id: 'action-humanitaire', label: 'Action Humanitaire' },
]

export function CategoryFilters() {
  const pathname = usePathname()
  const currentCategory = pathname.startsWith('/category/')
    ? pathname.split('/category/')[1]?.split('/')[0] ?? null
    : null

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/"
        className={
          !currentCategory
            ? 'px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white transition-colors'
            : 'px-4 py-2 rounded-lg text-sm font-medium bg-navy-600/80 text-gray-300 border border-gray-600 hover:border-gray-500 hover:text-white transition-colors'
        }
      >
        Tous
      </Link>
      {CATEGORIES.map((cat) => {
        const isActive = currentCategory === cat.id
        return (
          <Link
            key={cat.id}
            href={`/category/${cat.id}`}
            className={
              isActive
                ? 'px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white transition-colors'
                : 'px-4 py-2 rounded-lg text-sm font-medium bg-navy-600/80 text-gray-300 border border-gray-600 hover:border-gray-500 hover:text-white transition-colors'
            }
          >
            {cat.label}
          </Link>
        )
      })}
    </div>
  )
}
