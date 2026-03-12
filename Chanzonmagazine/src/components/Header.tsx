'use client'



import Link from 'next/link'

import { useState, useEffect, useRef } from 'react'

import { usePathname } from 'next/navigation'

import type { CmsCategory } from '@/lib/cms-api'



const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.chazonmagazine.com/api'



interface NavLink { href: string; label: string }



function buildNavLinks(categories: CmsCategory[]): NavLink[] {

  const catLinks = categories.slice(0, 5).map((c) => ({

    href: `/category/${c.slug}`,

    label: c.name,

  }))

  return [

    { href: '/', label: 'Accueil' },

    ...catLinks,

    { href: '/projets', label: 'Projets' },

  ]

}



function SearchOverlay({ onClose }: { onClose: () => void }) {

  const [query, setQuery] = useState('')

  const [results, setResults] = useState<any[]>([])

  const [searching, setSearching] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)



  useEffect(() => {

    inputRef.current?.focus()

    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }

    window.addEventListener('keydown', handleKey)

    return () => window.removeEventListener('keydown', handleKey)

  }, [onClose])



  useEffect(() => {

    document.body.style.overflow = 'hidden'

    return () => { document.body.style.overflow = '' }

  }, [])



  useEffect(() => {

    if (timerRef.current) clearTimeout(timerRef.current)

    if (query.trim().length < 2) { setResults([]); return }

    timerRef.current = setTimeout(async () => {

      setSearching(true)

      try {

        const res = await fetch(`${API_BASE}/search/articles?q=${encodeURIComponent(query)}&limit=6`)

        if (res.ok) {

          const data = await res.json()

          setResults(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [])

        }

      } catch { setResults([]) }

      finally { setSearching(false) }

    }, 300)

  }, [query])



  return (

    <div className="fixed inset-0 z-[60] flex flex-col animate-fade-in">

      <div className="absolute inset-0 bg-[#0d2137]/96 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 flex flex-col h-full max-w-3xl mx-auto w-full px-4 pt-8 pb-10">

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-2xl px-5 py-4 border border-white/15 mb-6">

          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50 flex-shrink-0">

            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />

          </svg>

          <input

            ref={inputRef}

            type="text"

            value={query}

            onChange={(e) => setQuery(e.target.value)}

            placeholder="Rechercher un article, une catégorie, un auteur…"

            className="flex-1 bg-transparent text-white text-lg placeholder-white/35 outline-none"

          />

          {query && (

            <button onClick={() => setQuery('')} className="text-white/40 hover:text-white/80 transition-colors">

              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>

            </button>

          )}

          <button

            onClick={onClose}

            className="ml-2 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white text-sm transition-all"

          >

            Échap

          </button>

        </div>



        {searching && (

          <div className="text-center py-8 text-white/40 text-sm">Recherche en cours…</div>

        )}



        {!searching && query.trim().length > 1 && results.length === 0 && (

          <div className="text-center py-16">

            <p className="text-white/30 text-4xl mb-4">🔍</p>

            <p className="text-white/50 text-lg">Aucun résultat pour <span className="text-white/80">&ldquo;{query}&rdquo;</span></p>

          </div>

        )}



        {!searching && results.length > 0 && (

          <div className="space-y-2">

            <p className="text-white/35 text-xs uppercase tracking-widest font-semibold px-1 mb-3">

              {results.length} résultat{results.length > 1 ? 's' : ''}

            </p>

            {results.map((article: any, i: number) => (

              <Link

                key={article.slug}

                href={`/article/${article.slug}`}

                onClick={onClose}

                className="flex items-center gap-4 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all group animate-fade-in-up"

                style={{ animationDelay: `${i * 60}ms` }}

              >

                <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 img-zoom">

                  {article.imageUrl

                    ? <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />

                    : <div className="w-full h-full bg-white/10" />}

                </div>

                <div className="flex-1 min-w-0">

                  <span className="inline-block text-accent text-xs font-semibold uppercase tracking-wide mb-0.5">

                    {article.category?.name ?? article.category ?? 'Actualité'}

                  </span>

                  <h3 className="text-white group-hover:text-accent transition-colors font-semibold line-clamp-1 leading-snug">{article.title}</h3>

                  <p className="text-white/40 text-sm line-clamp-1 mt-0.5">

                    {article.author} · {article.createdAt ? new Date(article.createdAt).toLocaleDateString('fr-FR') : ''}

                  </p>

                </div>

                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20 group-hover:text-accent transition-colors flex-shrink-0">

                  <path d="M5 12h14M12 5l7 7-7 7"/>

                </svg>

              </Link>

            ))}

          </div>

        )}



        {query.trim().length <= 1 && (

          <div className="text-center py-16">

            <p className="text-5xl mb-4 animate-float">✨</p>

            <p className="text-white/40 text-lg">Commencez à taper pour rechercher…</p>

            <p className="text-white/25 text-sm mt-2">Articles, catégories, auteurs</p>

          </div>

        )}

      </div>

    </div>

  )

}



function MobileMenu({ onClose, navLinks, pathname }: { onClose: () => void; navLinks: NavLink[]; pathname: string }) {

  useEffect(() => {

    document.body.style.overflow = 'hidden'

    return () => { document.body.style.overflow = '' }

  }, [])



  return (

    <div className="fixed inset-0 z-[60] flex flex-col animate-fade-in md:hidden">

      <div className="absolute inset-0 bg-[#0d2137]/96 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 flex flex-col h-full max-w-sm mx-auto w-full px-4 pt-8 pb-10">

        <button

          onClick={onClose}

          className="self-end mb-6 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"

          aria-label="Fermer le menu"

        >

          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">

            <path d="M18 6L6 18M6 6l12 12"/>

          </svg>

        </button>

        <nav className="flex flex-col gap-2">

          {navLinks.map((link) => {

            const isActive = pathname === link.href

            return (

              <Link

                key={link.href}

                href={link.href}

                onClick={onClose}

                className={`px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${

                  isActive

                    ? 'text-accent bg-accent/10 border border-accent/20'

                    : 'text-white hover:text-accent hover:bg-white/10'

                }`}

              >

                {link.label}

              </Link>

            )

          })}

        </nav>

      </div>

    </div>

  )

}



interface HeaderProps {

  categories?: CmsCategory[]

}



export function Header({ categories = [] }: HeaderProps) {

  const [searchOpen, setSearchOpen] = useState(false)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [scrolled, setScrolled] = useState(false)

  const pathname = usePathname()

  const navLinks = buildNavLinks(categories)



  useEffect(() => {

    const onScroll = () => setScrolled(window.scrollY > 20)

    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)

  }, [])



  return (

    <>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      {mobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} navLinks={navLinks} pathname={pathname} />}

      <header

        className={`sticky top-0 z-40 transition-all duration-300 ${

          scrolled

            ? 'bg-white/97 backdrop-blur-md shadow-sm shadow-primary/5 border-b border-slate-200/80'

            : 'bg-white/95 backdrop-blur border-b border-slate-200/60'

        }`}

      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between h-16">

            <Link href="/" className="flex items-center group">

              <img

                src="/olo.jpeg"

                alt="Logo"

                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"

              />

            </Link>



            <nav className="hidden md:flex items-center gap-1">

              {navLinks.map((link) => {

                const isActive = pathname === link.href

                return (

                  <Link

                    key={link.href}

                    href={link.href}

                    className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 underline-animate ${

                      isActive

                        ? 'text-accent bg-accent/8'

                        : 'text-primary/70 hover:text-primary hover:bg-slate-100/70'

                    }`}

                  >

                    {link.label}

                    {isActive && (

                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />

                    )}

                  </Link>

                )

              })}

            </nav>



            <div className="flex items-center gap-2">

              <button

                type="button"

                onClick={() => setSearchOpen(true)}

                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-500 hover:text-primary transition-all duration-200 text-sm group"

                aria-label="Rechercher"

              >

                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">

                  <line x1="3" y1="12" x2="21" y2="12"></line>

                </svg>

                <span className="hidden sm:inline text-xs text-slate-400 group-hover:text-slate-500 transition-colors">Rechercher…</span>

              </button>

              <button

                type="button"

                onClick={() => setMobileMenuOpen(true)}

                className="md:hidden flex items-center px-3 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-500 hover:text-primary transition-all duration-200"

                aria-label="Menu"

              >

                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">

                  <line x1="3" y1="12" x2="21" y2="12"></line>

                </svg>

              </button>

            </div>

          </div>

        </div>

      </header>

    </>

  )

}

