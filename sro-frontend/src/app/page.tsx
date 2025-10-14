"use client";
import Layout from '@/components/layout/Layout';
import { useEffect, useState } from 'react'
import { newsService } from '@/services/news'
import { eventsService } from '@/services/events'
import { settingsService } from '@/services/settings'
import { registryService } from '@/services/registry'
import { 
  HeroSection, 
  AboutPreview, 
  NewsSection, 
  QuickLinksSection,
  AssociationInfo,
  FAQSection
} from '@/components/sections';

export default function Home() {
  const [latestNews, setLatestNews] = useState<any[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [settings, setSettings] = useState<any | null>(null)
  const [registryStats, setRegistryStats] = useState<any | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [newsRes, eventsRes, settingsRes, statsRes] = await Promise.all([
          newsService.list({ status: 'published', page: 1, limit: 3, sortBy: 'publishedAt', sortOrder: 'desc' }),
          eventsService.list({ page: 1, limit: 3, sortBy: 'startDate', sortOrder: 'desc' }),
          settingsService.get(),
          registryService.stats(),
        ])
        if (!cancelled) {
          setLatestNews((newsRes.success ? newsRes.data.data : []).map((n: any) => ({
            id: n.id,
            title: n.title,
            excerpt: n.excerpt || '',
            cover: n.cover,
            href: `/news/${n.id}`,
          })))
          setUpcomingEvents(eventsRes.success ? eventsRes.data.data : [])
          setSettings(settingsRes.success ? settingsRes.data : null)
          setRegistryStats(statsRes.success ? statsRes.data : null)
        }
      } catch (e) {
        // swallow; defaults remain
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <Layout
      title="СРО Арбитражных Управляющих - Главная"
      description="Официальный сайт саморегулируемой организации арбитражных управляющих. Реестр членов, нормативные документы, компенсационный фонд."
      showBreadcrumbs={false}
    >
      {/* Hero Section */}
      <HeroSection
        backgroundSrc="/assets/hero_bg_sro_beige.png"
        title="СРО Арбитражных Управляющих"
        subtitle="Саморегулируемая организация арбитражных управляющих, обеспечивающая высокие стандарты профессиональной деятельности в сфере несостоятельности (банкротства)."
        primaryButtonText="Поиск в реестре"
        primaryButtonHref="/registry"
        secondaryButtonText="Компенсационный фонд"
        secondaryButtonHref="/compensation-fund"
      />

      {/* Quick Links Section */}
      <div className="bg-gradient-to-br from-white via-beige-50 to-amber-50">
        <QuickLinksSection />
      </div>

      {/* About Preview Section */}
      <AboutPreview
        imageSrc="/assets/about_illustration_beige.png"
        title="О нашей организации"
        description="Саморегулируемая организация арбитражных управляющих объединяет профессионалов, работающих в сфере несостоятельности (банкротства). Мы обеспечиваем высокие стандарты профессиональной деятельности и защищаем интересы всех участников процедур банкротства."
        stats={[
          { value: "150+", label: "Арбитражных управляющих" },
          { value: "10+", label: "Лет успешной работы" },
          { value: "100%", label: "Соответствие стандартам" }
        ]}
        buttonText="Подробнее об организации"
        buttonHref="/about"
      />

      {/* News Section */}
      <div className="bg-gradient-to-br from-beige-50 via-white to-amber-50">
        <NewsSection
          title="Последние новости"
          allNewsHref="/news"
          news={latestNews}
          defaultCover="/assets/news_cover_beige.png"
        />
      </div>

      {/* Association Info Section */}
      <AssociationInfo
        title={settings?.siteName || 'О нашей Ассоциации'}
        description={settings?.siteDescription || undefined}
      />

      {/* FAQ Section */}
      <FAQSection />
    </Layout>
  );
}
