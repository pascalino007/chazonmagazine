import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AnnouncementBanner } from '@/components/AnnouncementBanner'
import { getActiveCategories } from '@/lib/cms-api'

export const metadata: Metadata = {
  title: 'HUMANITÉ+ | Récits inspirants sur l\'action humanitaire',
  description: 'Des récits inspirants sur l\'action sociale, l\'humanitaire et la solidarité dans le monde.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getActiveCategories()

  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <AnnouncementBanner />
        <Header categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
