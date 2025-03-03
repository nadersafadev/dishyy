import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  Users,
  Heart,
  Utensils,
  Clock,
  Moon,
  Star,
  Sparkles,
  Gift,
  Coffee,
  Scroll,
  Home,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'تنظيم إفطارات رمضان - Dishyy | Ramadan Meal Planning',
  description:
    'نظّم إفطارات رمضان الجماعية بسهولة وفعالية. تطبيق Dishyy يساعدك في تنسيق الوجبات وتنظيم المشاركات لإفطارات رمضانية ناجحة. Organize your Ramadan iftars easily with Dishyy.',
  keywords: [
    'رمضان',
    'إفطار',
    'تنظيم وجبات',
    'Ramadan',
    'Iftar',
    'Meal Planning',
    'تطبيق رمضان',
    'Dishyy',
  ],
  openGraph: {
    title: 'تنظيم إفطارات رمضان - Dishyy | Ramadan Meal Planning',
    description: 'نظّم إفطارات رمضان الجماعية بسهولة وفعالية مع Dishyy',
    type: 'website',
    locale: 'ar',
    alternateLocale: 'en',
    siteName: 'Dishyy',
    images: [
      {
        url: 'https://res.cloudinary.com/daqvjcynu/image/upload/v1740975132/eid-celebration_dumua8.jpg',
        width: 1200,
        height: 630,
        alt: 'مائدة إفطار رمضانية عامرة - Ramadan Iftar Table',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تنظيم إفطارات رمضان - Dishyy',
    description: 'نظّم إفطارات رمضان الجماعية بسهولة وفعالية مع Dishyy',
    images: [
      'https://res.cloudinary.com/daqvjcynu/image/upload/v1740975132/eid-celebration_dumua8.jpg',
    ],
  },
  alternates: {
    canonical: 'https://dishyy.app/ramadan',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  robots: 'index, follow',
  themeColor: '#ffffff',
};

const features = [
  {
    icon: <Utensils className="h-6 w-6 text-primary" />,
    title: 'تنظيم الأطباق',
    description: 'تنسيق سهل للأطباق والمشاركات مع تجنب التكرار في الوجبات',
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: 'إدارة المدعوين',
    description: 'متابعة الحضور والتفضيلات الغذائية بكل سهولة',
  },
  {
    icon: <CalendarDays className="h-6 w-6 text-primary" />,
    title: 'جدولة الإفطارات',
    description: 'تنظيم مواعيد الإفطارات طوال شهر رمضان المبارك',
  },
  {
    icon: <Heart className="h-6 w-6 text-primary" />,
    title: 'روح رمضان',
    description: 'تعزيز قيم المشاركة والتكافل في الشهر الفضيل',
  },
];

const ramadanCategories = [
  {
    icon: <Moon className="h-8 w-8 text-primary" />,
    title: 'المقبلات الرمضانية',
    items: ['شوربة رمضان', 'سمبوسك', 'سلطات متنوعة', 'معجنات'],
  },
  {
    icon: <Star className="h-8 w-8 text-primary" />,
    title: 'الأطباق الرئيسية',
    items: ['أرز بالخلطة', 'دجاج محشي', 'لحم بالفريك', 'مندي'],
  },
  {
    icon: <Coffee className="h-8 w-8 text-primary" />,
    title: 'المشروبات والعصائر',
    items: ['قمر الدين', 'تمر هندي', 'جلاب', 'لبن عيران'],
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: 'الحلويات',
    items: ['قطايف', 'كنافة', 'عيش السرايا', 'بسبوسة'],
  },
];

const ramadanFeatures = [
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: 'مواقيت الصلاة',
    description: 'تنبيهات لمواعيد الإفطار والسحور حسب منطقتك',
  },
  {
    icon: <Gift className="h-6 w-6 text-primary" />,
    title: 'صدقة رمضان',
    description: 'تنظيم وتوزيع صدقات الطعام للمحتاجين',
  },
];

const traditions = [
  {
    icon: <Moon className="h-8 w-8 text-primary" />,
    title: 'هلال رمضان',
    description: 'تقليد رؤية الهلال وإعلان بداية الشهر الفضيل',
  },
  {
    icon: <Home className="h-8 w-8 text-primary" />,
    title: 'صلاة التراويح',
    description: 'الاجتماع في المساجد لأداء صلاة التراويح جماعة',
  },
  {
    icon: <Gift className="h-8 w-8 text-primary" />,
    title: 'زكاة الفطر',
    description: 'توزيع زكاة الفطر على المحتاجين قبل صلاة العيد',
  },
  {
    icon: <Scroll className="h-8 w-8 text-primary" />,
    title: 'ليلة القدر',
    description: 'إحياء العشر الأواخر من رمضان وتحري ليلة القدر',
  },
];

export default function RamadanPage() {
  // Add JSON-LD structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'تنظيم إفطارات رمضان - Dishyy',
    description: 'نظّم إفطارات رمضان الجماعية بسهولة وفعالية مع Dishyy',
    inLanguage: ['ar', 'en'],
    isPartOf: {
      '@type': 'WebSite',
      name: 'Dishyy',
      url: 'https://dishyy.app',
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      contentUrl:
        'https://res.cloudinary.com/daqvjcynu/image/upload/v1740975132/eid-celebration_dumua8.jpg',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="flex flex-col min-h-screen" dir="rtl">
        {/* Hero Section - Mobile Optimized */}
        <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden bg-black">
          {/* Background Image with responsive sizing */}
          <div className="absolute inset-0">
            <Image
              src="https://res.cloudinary.com/daqvjcynu/image/upload/v1740975132/eid-celebration_dumua8.jpg"
              alt="مائدة إفطار رمضانية عامرة"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </div>

          {/* Content - Mobile Optimized */}
          <div className="container relative z-10 py-12 md:py-20 px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
              <h1
                className="text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-tight"
                lang="ar"
              >
                نظّم إفطارات رمضان
                <span className="block text-primary mt-2">بكل يسر وبركة</span>
              </h1>
              <p
                className="text-lg md:text-xl text-zinc-200 max-w-2xl mx-auto leading-relaxed"
                lang="ar"
              >
                مع Dishyy، اجعل تنظيم إفطارات رمضان الجماعية تجربة سهلة وممتعة.
                نساعدك في تنسيق الوجبات وتنظيم المشاركات لإفطارات ناجحة تجمع
                العائلة والأصدقاء.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 h-12 bg-primary hover:bg-primary/90 text-white"
                >
                  <Link href="/sign-up" lang="ar">
                    ابدأ مجاناً
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-8 h-12 text-white border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <Link href="#features" lang="ar">
                    اكتشف المزيد
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Mobile Optimized */}
        <section id="features" className="py-16 md:py-24 bg-white text-center">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4" lang="ar">
                ميزات خاصة لشهر رمضان المبارك
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground" lang="ar">
                كل ما تحتاجه لتنظيم إفطارات رمضانية ناجحة
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {features.map(feature => (
                <div
                  key={feature.title}
                  className="p-4 md:p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    {feature.icon}
                  </div>
                  <h3
                    className="text-lg md:text-xl font-semibold mb-2"
                    lang="ar"
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm md:text-base text-muted-foreground"
                    lang="ar"
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ramadan Categories Section */}
        <section className="py-24 bg-primary/5 text-center">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4" lang="ar">
                أصناف الإفطار الرمضاني
              </h2>
              <p className="text-xl text-muted-foreground" lang="ar">
                تصنيفات مخصصة لتنظيم مائدة رمضان بشكل متكامل
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {ramadanCategories.map(category => (
                <div
                  key={category.title}
                  className="p-6 rounded-2xl bg-white border hover:shadow-lg transition-shadow"
                >
                  <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4" lang="ar">
                    {category.title}
                  </h3>
                  <ul className="space-y-2 text-muted-foreground" lang="ar">
                    {category.items.map(item => (
                      <li key={item} className="flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/60 ml-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ramadan Traditions Section */}
        <section className="py-24 bg-white text-center">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4" lang="ar">
                تقاليد رمضانية أصيلة
              </h2>
              <p className="text-xl text-muted-foreground" lang="ar">
                عادات وتقاليد تميز الشهر الكريم وتزيده بركة
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {traditions.map(tradition => (
                <div
                  key={tradition.title}
                  className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border hover:shadow-lg transition-all duration-300"
                >
                  <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto transform transition-transform duration-300 group-hover:scale-110">
                    {tradition.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3" lang="ar">
                    {tradition.title}
                  </h3>
                  <p
                    className="text-muted-foreground leading-relaxed"
                    lang="ar"
                  >
                    {tradition.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Ramadan Features */}
        <section className="py-24 bg-primary/5 text-center">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4" lang="ar">
                ميزات رمضانية إضافية
              </h2>
              <p className="text-xl text-muted-foreground" lang="ar">
                خدمات خاصة لتعزيز روحانية الشهر الفضيل
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {ramadanFeatures.map(feature => (
                <div
                  key={feature.title}
                  className="p-8 rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-shadow"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2" lang="ar">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground" lang="ar">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ramadan Tips Section */}
        <section className="py-24 bg-[url('/pattern.png')] bg-repeat bg-primary/5 text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center space-y-8">
              <h2 className="text-3xl font-bold" lang="ar">
                نصائح لإفطار صحي
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-primary" lang="ar">
                    قبل الإفطار
                  </p>
                  <ul className="space-y-2 text-muted-foreground" lang="ar">
                    <li className="flex items-center gap-2 justify-center">
                      <span className="h-2 w-2 rounded-full bg-primary/60" />
                      ابدأ بالتمر والماء
                    </li>
                    <li className="flex items-center gap-2 justify-center">
                      <span className="h-2 w-2 rounded-full bg-primary/60" />
                      تناول الشوربة الساخنة
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-primary" lang="ar">
                    خلال الإفطار
                  </p>
                  <ul className="space-y-2 text-muted-foreground" lang="ar">
                    <li className="flex items-center gap-2 justify-center">
                      <span className="h-2 w-2 rounded-full bg-primary/60" />
                      تجنب الإفراط في الطعام
                    </li>
                    <li className="flex items-center gap-2 justify-center">
                      <span className="h-2 w-2 rounded-full bg-primary/60" />
                      تنويع المأكولات بشكل متوازن
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Updated with bilingual support */}
        <section className="py-20 bg-gradient-to-b from-white to-primary/5 text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl font-bold" lang="ar">
                استعد لرمضان مع Dishyy
              </h2>
              <div className="space-y-4">
                <p className="text-xl text-muted-foreground" lang="ar">
                  اجعل إفطاراتك الرمضانية أكثر تنظيماً وبركة
                </p>
                <p className="text-xl text-muted-foreground" lang="ar">
                  Join Dishyy community today
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-12 h-14 bg-primary hover:bg-primary/90 text-white"
                >
                  <Link href="/sign-up" lang="ar">
                    ابدأ تنظيم إفطاراتك الآن
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14"
                >
                  <Link href="/contact" lang="ar">
                    تواصل معنا
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
