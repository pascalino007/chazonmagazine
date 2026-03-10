'use client'

import Link from 'next/link'

const categories = [
  { href: '/category/education', label: 'Éducation' },
  { href: '/category/sante', label: 'Santé' },
  { href: '/category/solidarite', label: 'Solidarité' },
  { href: '/category/environnement', label: 'Environnement' },
  { href: '/category/refugies', label: 'Réfugiés' },
  { href: '/category/autonomisation', label: 'Autonomisation' },
]

const aboutLinks = [
  { href: '/mission', label: 'Notre mission' },
  { href: '/contact', label: 'Contact' },
  { href: '/partenaires', label: 'Partenaires' },
  { href: '/don', label: 'Faire un don' },
]

export function Footer() {
  return (
    <footer className="bg-primary mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14 mb-12">
          {/* Brand & mission */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <span className="text-accent transition-transform duration-300 group-hover:scale-110">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </span>
              <span className="font-bold text-white tracking-wider">
                HUMANITÉ<span className="text-accent">+</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              Des récits inspirants sur l&apos;action sociale, l&apos;humanitaire et la solidarité dans le monde.
            </p>
            <div className="flex gap-3">
              {['🌍', '❤️', '✊'].map((emoji, i) => (
                <span key={i} className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-sm hover:bg-accent/20 transition-colors cursor-default">
                  {emoji}
                </span>
              ))}
            </div>
          </div>

          {/* Catégories */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-5">Catégories</h3>
            <ul className="space-y-2.5">
              {categories.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/50 hover:text-accent text-sm transition-colors underline-animate">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* À propos */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-5">À propos</h3>
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/50 hover:text-accent text-sm transition-colors underline-animate">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-5">Newsletter</h3>
            <p className="text-white/50 text-sm mb-4 leading-relaxed">
              Recevez nos dernières histoires directement dans votre boîte mail.
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full px-4 py-2.5 rounded-xl bg-white/8 border border-white/12 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 text-sm transition-all"
              />
              <button
                type="submit"
                className="w-full px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-light text-white font-semibold transition-colors text-sm"
              >
                S&apos;abonner ✨
              </button>
            </form>
          </div>
        </div>

        <div className="pt-6 border-t border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-white/30 text-xs">© 2025 Humanité+. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-5">
            {[
              { href: '/confidentialite', label: 'Confidentialité' },
              { href: '/conditions', label: 'Conditions' },
              { href: '/cookies', label: 'Cookies' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-white/30 hover:text-white/70 text-xs transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
