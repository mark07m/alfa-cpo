import Layout from '@/components/layout/Layout';
import { 
  HeroSection, 
  AboutPreview, 
  NewsSection, 
  QuickLinksSection 
} from '@/components/sections';

export default function Home() {
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
          defaultCover="/assets/news_cover_beige.png"
        />
      </div>
    </Layout>
  );
}
