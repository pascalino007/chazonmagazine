import { Suspense } from 'react'
import { FeaturedHero } from '@/components/FeaturedHero'
import { ReportagesSection } from '@/components/ReportagesSection'
import { ArticlesSection } from '@/components/ArticlesSection'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { CommunityCTA } from '@/components/CommunityCTA'
import { CmsBanner } from '@/components/CmsBanner'

export default function HomePage() {
  return (
    <>
      <FeaturedHero />
      <ReportagesSection />
      <CmsBanner position="inline-1" fallbackVariant="impact" />
      <Suspense fallback={<div className="flex flex-wrap gap-2 p-4" />}>
        <ArticlesSection />
      </Suspense>
      <CmsBanner position="inline-2" fallbackVariant="mission" />
      <TestimonialsSection />
      <CommunityCTA />
    </>
  )
}
