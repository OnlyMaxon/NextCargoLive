import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Package, MapPin, Shield, Clock, CreditCard, ChevronDown, MessageCircle, Phone, Mail, Check } from 'lucide-react';
import { useTranslation, LanguageSelector, Language } from '@/lib/i18n';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

// Translations for landing page content
const landingContent = {
  // Promo
  promo: {
    ru: '🎉 Первый заказ — скидка 50%!',
    en: '🎉 First order — 50% discount!',
    az: '🎉 İlk sifariş — 50% endirim!'
  },
  // Header
  login: {
    ru: 'Войти',
    en: 'Login',
    az: 'Giriş'
  },
  register: {
    ru: 'Регистрация',
    en: 'Register',
    az: 'Qeydiyyat'
  },
  // Hero
  heroTitle: {
    ru: 'Доставка из Европы\nв Азербайджан',
    en: 'Delivery from Europe\nto Azerbaijan',
    az: 'Avropadan Azərbaycana\nçatdırılma'
  },
  heroSubtitle: {
    ru: 'Покупайте в любых европейских магазинах. Мы доставим ваши заказы из Польши в Баку за 7-14 дней.',
    en: 'Shop at any European stores. We will deliver your orders from Poland to Baku in 7-14 days.',
    az: 'İstənilən Avropa mağazalarından alış-veriş edin. Sifarişlərinizi Polşadan Bakıya 7-14 günə çatdıracağıq.'
  },
  startFree: {
    ru: 'Начать бесплатно',
    en: 'Start for free',
    az: 'Pulsuz başla'
  },
  writeWhatsApp: {
    ru: 'Написать в WhatsApp',
    en: 'Write on WhatsApp',
    az: 'WhatsApp-da yazın'
  },
  freeRegistration: {
    ru: 'Регистрация бесплатная • Оплата при получении',
    en: 'Free registration • Pay on delivery',
    az: 'Pulsuz qeydiyyat • Çatdırılmada ödəniş'
  },
  // Why us
  whyUs: {
    ru: 'Почему выбирают нас',
    en: 'Why choose us',
    az: 'Niyə bizi seçirlər'
  },
  // How it works
  howItWorks: {
    ru: 'Как это работает',
    en: 'How it works',
    az: 'Necə işləyir'
  },
  // Pricing
  pricing: {
    ru: 'Тарифы',
    en: 'Pricing',
    az: 'Tariflər'
  },
  pricingSubtitle: {
    ru: 'Простые и понятные цены. Чем больше вес — тем выгоднее.',
    en: 'Simple and clear prices. The more weight — the better the deal.',
    az: 'Sadə və aydın qiymətlər. Çəki nə qədər çox - bir o qədər sərfəli.'
  },
  minPayment: {
    ru: 'Минимальная оплата — $7.',
    en: 'Minimum payment — $7.',
    az: 'Minimum ödəniş — $7.'
  },
  firstOrderDiscount: {
    ru: 'Первый заказ — скидка 50%!',
    en: 'First order — 50% discount!',
    az: 'İlk sifariş — 50% endirim!'
  },
  // FAQ
  faq: {
    ru: 'Частые вопросы',
    en: 'FAQ',
    az: 'Tez-tez verilən suallar'
  },
  // Warehouse
  warehouseTitle: {
    ru: 'Адрес склада в Польше',
    en: 'Warehouse address in Poland',
    az: 'Polşada anbar ünvanı'
  },
  warehouseSubtitle: {
    ru: 'Укажите этот адрес при оформлении заказа в европейских магазинах',
    en: 'Use this address when ordering from European stores',
    az: 'Avropa mağazalarından sifariş edərkən bu ünvanı göstərin'
  },
  yourId: {
    ru: 'Ваш ID:',
    en: 'Your ID:',
    az: 'Sizin ID:'
  },
  afterRegistration: {
    ru: 'получите после регистрации',
    en: 'get after registration',
    az: 'qeydiyyatdan sonra alacaqsınız'
  },
  // CTA
  firstRegistrationFree: {
    ru: 'Первая регистрация — бесплатно!',
    en: 'First registration — free!',
    az: 'İlk qeydiyyat — pulsuz!'
  },
  readyToStart: {
    ru: 'Готовы начать?',
    en: 'Ready to start?',
    az: 'Başlamağa hazırsınız?'
  },
  ctaSubtitle: {
    ru: 'Зарегистрируйтесь сейчас и получите персональный адрес склада в Польше. Первый заказ — со скидкой 50%.',
    en: 'Register now and get a personal warehouse address in Poland. First order — 50% off.',
    az: 'İndi qeydiyyatdan keçin və Polşada şəxsi anbar ünvanı alın. İlk sifariş — 50% endirimlə.'
  },
  registerNow: {
    ru: 'Зарегистрироваться',
    en: 'Register',
    az: 'Qeydiyyatdan keçin'
  },
  askQuestion: {
    ru: 'Задать вопрос',
    en: 'Ask a question',
    az: 'Sual verin'
  },
  // Footer
  footerDescription: {
    ru: 'Доставка товаров из Европы в Азербайджан. Надёжно, быстро, выгодно.',
    en: 'Delivery from Europe to Azerbaijan. Reliable, fast, affordable.',
    az: 'Avropadan Azərbaycana çatdırılma. Etibarlı, sürətli, sərfəli.'
  },
  contacts: {
    ru: 'Контакты',
    en: 'Contacts',
    az: 'Əlaqə'
  },
  workingHours: {
    ru: 'Режим работы',
    en: 'Working hours',
    az: 'İş saatları'
  },
  monFri: {
    ru: 'Пн-Пт: 09:00 — 18:00',
    en: 'Mon-Fri: 09:00 — 18:00',
    az: 'B.e.-Cümə: 09:00 — 18:00'
  },
  sat: {
    ru: 'Сб: 10:00 — 15:00',
    en: 'Sat: 10:00 — 15:00',
    az: 'Şənbə: 10:00 — 15:00'
  },
  sun: {
    ru: 'Вс: выходной',
    en: 'Sun: closed',
    az: 'Bazar: qeyri-iş günü'
  },
  copyright: {
    ru: '© 2025 NextCargo. Все права защищены.',
    en: '© 2025 NextCargo. All rights reserved.',
    az: '© 2025 NextCargo. Bütün hüquqlar qorunur.'
  }
};

// Advantages
const getAdvantages = (lang: Language) => [
  {
    icon: Shield,
    title: { ru: 'Надёжно', en: 'Reliable', az: 'Etibarlı' }[lang],
    description: { 
      ru: 'Все посылки застрахованы. Гарантируем сохранность товара',
      en: 'All packages are insured. We guarantee product safety',
      az: 'Bütün bağlamalar sığortalanıb. Malın salamatlığına zəmanət veririk'
    }[lang]
  },
  {
    icon: Clock,
    title: { ru: 'Быстро', en: 'Fast', az: 'Sürətli' }[lang],
    description: { 
      ru: 'Доставка 7-14 дней. Отправки каждую неделю',
      en: 'Delivery 7-14 days. Weekly shipments',
      az: 'Çatdırılma 7-14 gün. Həftəlik göndərmələr'
    }[lang]
  },
  {
    icon: CreditCard,
    title: { ru: 'Выгодно', en: 'Affordable', az: 'Sərfəli' }[lang],
    description: { 
      ru: 'Честные цены без скрытых комиссий. Оплата при получении',
      en: 'Fair prices without hidden fees. Pay on delivery',
      az: 'Gizli ödənişlər olmadan ədalətli qiymətlər. Çatdırılmada ödəniş'
    }[lang]
  },
  {
    icon: MapPin,
    title: { ru: 'Удобно', en: 'Convenient', az: 'Rahat' }[lang],
    description: { 
      ru: 'Доставка до двери. Отслеживание в личном кабинете',
      en: 'Door-to-door delivery. Tracking in your account',
      az: 'Qapıya çatdırılma. Hesabınızda izləmə'
    }[lang]
  }
];

// Steps
const getSteps = (lang: Language) => [
  {
    number: "1",
    title: { ru: 'Укажите наш адрес', en: 'Use our address', az: 'Ünvanımızı göstərin' }[lang],
    description: { 
      ru: 'При заказе укажите адрес нашего склада в Польше + ваше имя и FIN код для идентификации',
      en: 'When ordering, use our warehouse address in Poland + your name and FIN code for identification',
      az: 'Sifariş edərkən Polşadakı anbar ünvanımızı + identifikasiya üçün adınızı və FIN kodunu göstərin'
    }[lang]
  },
  {
    number: "2",
    title: { ru: 'Мы получаем посылку', en: 'We receive package', az: 'Bağlamanı alırıq' }[lang],
    description: { 
      ru: 'Принимаем вашу посылку на складе и определяем владельца по указанным данным',
      en: 'We receive your package at the warehouse and identify the owner by the provided details',
      az: 'Bağlamanızı anbarda qəbul edirik və göstərilən məlumatlara görə sahibini müəyyən edirik'
    }[lang]
  },
  {
    number: "3",
    title: { ru: 'Email уведомление', en: 'Email notification', az: 'E-poçt bildirişi' }[lang],
    description: { 
      ru: 'Отправляем вам email со статусом, весом посылки и реквизитами для оплаты',
      en: 'We send you an email with status, package weight and payment details',
      az: 'Sizə status, bağlama çəkisi və ödəniş detalları ilə e-poçt göndəririk'
    }[lang]
  },
  {
    number: "4",
    title: { ru: 'Оплата и доставка', en: 'Payment & Delivery', az: 'Ödəniş və Çatdırılma' }[lang],
    description: { 
      ru: 'Оплачиваете на польскую карту — мы доставляем посылку в Азербайджан',
      en: 'Pay to our Polish card — we deliver the package to Azerbaijan',
      az: 'Polşa kartımıza ödəniş edin — bağlamanı Azərbaycana çatdırırıq'
    }[lang]
  }
];

// Pricing tiers
const getPricingTiers = (lang: Language) => [
  {
    weight: { ru: 'Документы', en: 'Documents', az: 'Sənədlər' }[lang],
    price: "23€",
    perKg: { ru: 'до 500 г', en: 'up to 500g', az: '500 q-a qədər' }[lang],
    popular: false,
    features: [
      { ru: 'Стандартная упаковка', en: 'Standard packaging', az: 'Standart qablaşdırma' }[lang],
      { ru: 'Отслеживание', en: 'Tracking', az: 'İzləmə' }[lang],
      { ru: 'Страховка', en: 'Insurance', az: 'Sığorta' }[lang]
    ]
  },
  {
    weight: { ru: '0-5 кг', en: '0-5 kg', az: '0-5 kq' }[lang],
    price: "47€",
    perKg: { ru: 'фикс. цена', en: 'fixed price', az: 'sabit qiymət' }[lang],
    popular: true,
    features: [
      { ru: 'Усиленная упаковка', en: 'Enhanced packaging', az: 'Gücləndirilmiş qablaşdırma' }[lang],
      { ru: 'Приоритетная отправка', en: 'Priority shipping', az: 'Prioritet göndərmə' }[lang],
      { ru: 'Отслеживание', en: 'Tracking', az: 'İzləmə' }[lang],
      { ru: 'Страховка', en: 'Insurance', az: 'Sığorta' }[lang]
    ]
  },
  {
    weight: { ru: '5-10 кг', en: '5-10 kg', az: '5-10 kq' }[lang],
    price: "70€",
    perKg: { ru: 'фикс. цена', en: 'fixed price', az: 'sabit qiymət' }[lang],
    popular: false,
    features: [
      { ru: 'Усиленная упаковка', en: 'Enhanced packaging', az: 'Gücləndirilmiş qablaşdırma' }[lang],
      { ru: 'Приоритетная отправка', en: 'Priority shipping', az: 'Prioritet göndərmə' }[lang],
      { ru: 'Отслеживание', en: 'Tracking', az: 'İzləmə' }[lang],
      { ru: 'Полная страховка', en: 'Full insurance', az: 'Tam sığorta' }[lang]
    ]
  },
  {
    weight: { ru: '10-23 кг', en: '10-23 kg', az: '10-23 kq' }[lang],
    price: "140€",
    perKg: { ru: 'фикс. цена', en: 'fixed price', az: 'sabit qiymət' }[lang],
    popular: false,
    features: [
      { ru: 'Усиленная упаковка', en: 'Enhanced packaging', az: 'Gücləndirilmiş qablaşdırma' }[lang],
      { ru: 'Приоритетная отправка', en: 'Priority shipping', az: 'Prioritet göndərmə' }[lang],
      { ru: 'Отслеживание', en: 'Tracking', az: 'İzləmə' }[lang],
      { ru: 'Полная страховка', en: 'Full insurance', az: 'Tam sığorta' }[lang]
    ]
  }
];

// FAQs
const getFaqs = (lang: Language) => [
  {
    question: { 
      ru: 'Как работает доставка из Польши?',
      en: 'How does delivery from Poland work?',
      az: 'Polşadan çatdırılma necə işləyir?'
    }[lang],
    answer: { 
      ru: 'Вы покупаете товар в любом европейском магазине, указываете наш склад в Польше как адрес доставки. Мы принимаем посылку и доставляем её в Азербайджан.',
      en: 'You buy products at any European store, specify our warehouse in Poland as the delivery address. We receive the package and deliver it to Azerbaijan.',
      az: 'Siz istənilən Avropa mağazasından məhsul alırsınız, çatdırılma ünvanı olaraq Polşadakı anbarımızı göstərirsiniz. Bağlamanı qəbul edir və Azərbaycana çatdırırıq.'
    }[lang]
  },
  {
    question: { 
      ru: 'Сколько времени занимает доставка?',
      en: 'How long does delivery take?',
      az: 'Çatdırılma nə qədər vaxt aparır?'
    }[lang],
    answer: { 
      ru: 'Стандартная доставка занимает 7-14 рабочих дней с момента поступления товара на наш склад в Польше.',
      en: 'Standard delivery takes 7-14 business days from the moment the goods arrive at our warehouse in Poland.',
      az: 'Standart çatdırılma malların Polşadakı anbarımıza çatdığı andan 7-14 iş günü çəkir.'
    }[lang]
  },
  {
    question: { 
      ru: 'Как рассчитывается стоимость?',
      en: 'How is the cost calculated?',
      az: 'Dəyər necə hesablanır?'
    }[lang],
    answer: { 
      ru: 'Стоимость рассчитывается по весу посылки. От 1 кг — $7 за кг, от 5 кг — $6 за кг, от 10 кг — $5 за кг. Минимальная оплата — $7.',
      en: 'The cost is calculated by the weight of the package. From 1 kg — $7 per kg, from 5 kg — $6 per kg, from 10 kg — $5 per kg. Minimum payment — $7.',
      az: 'Dəyər bağlamanın çəkisinə görə hesablanır. 1 kq-dan — kq üçün $7, 5 kq-dan — kq üçün $6, 10 kq-dan — kq üçün $5. Minimum ödəniş — $7.'
    }[lang]
  },
  {
    question: { 
      ru: 'Какие товары можно заказывать?',
      en: 'What products can I order?',
      az: 'Hansı məhsulları sifariş edə bilərəm?'
    }[lang],
    answer: { 
      ru: 'Можно заказывать одежду, электронику, косметику, детские товары и многое другое. Запрещены: опасные грузы, оружие, контрафакт.',
      en: 'You can order clothes, electronics, cosmetics, children\'s products and much more. Prohibited: dangerous goods, weapons, counterfeits.',
      az: 'Geyim, elektronika, kosmetika, uşaq məhsulları və daha çox şey sifariş edə bilərsiniz. Qadağandır: təhlükəli yüklər, silah, saxta mallar.'
    }[lang]
  },
  {
    question: { 
      ru: 'Как отслеживать посылку?',
      en: 'How to track a package?',
      az: 'Bağlamanı necə izləmək olar?'
    }[lang],
    answer: { 
      ru: 'После регистрации вы получаете личный кабинет, где видите статус всех ваших посылок в режиме реального времени.',
      en: 'After registration, you get a personal account where you can see the status of all your packages in real time.',
      az: 'Qeydiyyatdan sonra bütün bağlamalarınızın statusunu real vaxtda görə biləcəyiniz şəxsi hesab alırsınız.'
    }[lang]
  },
  {
    question: { 
      ru: 'Есть ли страховка?',
      en: 'Is there insurance?',
      az: 'Sığorta varmı?'
    }[lang],
    answer: { 
      ru: 'Да, все посылки застрахованы. В случае утери или повреждения мы компенсируем стоимость товара.',
      en: 'Yes, all packages are insured. In case of loss or damage, we will compensate the cost of the goods.',
      az: 'Bəli, bütün bağlamalar sığortalanıb. İtki və ya zədə halında malların dəyərini ödəyəcəyik.'
    }[lang]
  }
];

// Best choice label
const bestChoice = {
  ru: 'ЛУЧШИЙ ВЫБОР',
  en: 'BEST CHOICE',
  az: 'ƏN YAXŞI SEÇİM'
};

export default function LandingPage({ onLoginClick, onRegisterClick }: LandingPageProps) {
  const { language } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const advantages = getAdvantages(language);
  const steps = getSteps(language);
  const pricingTiers = getPricingTiers(language);
  const faqs = getFaqs(language);
  const txt = landingContent;

  const handleWhatsApp = () => {
    const message = {
      ru: 'Здравствуйте! Хочу узнать о доставке из Европы',
      en: 'Hello! I want to learn about delivery from Europe',
      az: 'Salam! Avropadan çatdırılma haqqında məlumat almaq istəyirəm'
    }[language];
    window.open(`https://wa.me/994508700969?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center py-2.5 px-4 text-sm font-medium">
        {txt.promo[language]}
      </div>

      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">nextcargo.eu</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector className="hidden sm:flex" />
            <button 
              onClick={handleWhatsApp}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
            <Button 
              onClick={onLoginClick} 
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              {txt.login[language]}
            </Button>
            <Button 
              onClick={onRegisterClick}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {txt.register[language]}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Language Selector */}
      <div className="sm:hidden flex justify-center py-2 bg-gray-50 border-b">
        <LanguageSelector />
      </div>

      {/* Hero Section with Blue Gradient */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white whitespace-pre-line">
            {txt.heroTitle[language]}
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {txt.heroSubtitle[language]}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={onRegisterClick} 
              className="bg-white text-blue-600 hover:bg-gray-100 text-base px-8 font-semibold"
            >
              {txt.startFree[language]}
            </Button>
            <button 
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              {txt.writeWhatsApp[language]}
            </button>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            {txt.freeRegistration[language]}
          </p>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
            {txt.whyUs[language]}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {advantages.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
            {txt.howItWorks[language]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg shadow-blue-600/30">
                    {step.number}
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-[2px] bg-blue-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-900">
            {txt.pricing[language]}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {txt.pricingSubtitle[language]}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`p-6 relative ${tier.popular ? 'border-2 border-blue-600 shadow-xl shadow-blue-600/10' : 'border border-gray-200'}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-blue-900 text-xs font-bold px-4 py-1 rounded-full">
                    {bestChoice[language]}
                  </div>
                )}
                <div className="text-center pt-2">
                  <div className="text-sm text-gray-500 mb-2">{tier.weight}</div>
                  <div className="text-4xl font-bold text-gray-900 mb-1">{tier.price}</div>
                  <div className="text-sm text-gray-500 mb-6">{tier.perKg}</div>
                  <div className="space-y-3 text-left">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            {txt.minPayment[language]} <span className="text-blue-600 font-medium">{txt.firstOrderDiscount[language]}</span>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
            {txt.faq[language]}
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warehouse Address */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
            {txt.warehouseTitle[language]}
          </h2>
          <p className="text-gray-600 mb-6">
            {txt.warehouseSubtitle[language]}
          </p>
          <Card className="p-6 inline-block text-left border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold mb-2 text-gray-900">NextCargo Warehouse</div>
                <div className="text-gray-600 text-sm space-y-1">
                  <div>Wierchow 25</div>
                  <div>04-653 Warszawa, Polska</div>
                  <div className="pt-2 text-blue-600 font-medium">
                    {txt.yourId[language]} <span className="font-mono">{txt.afterRegistration[language]}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section with Blue Gradient */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block bg-yellow-400 text-blue-900 text-sm font-bold px-4 py-1.5 rounded-full mb-6">
            {txt.firstRegistrationFree[language]}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            {txt.readyToStart[language]}
          </h2>
          <p className="text-blue-100 mb-8">
            {txt.ctaSubtitle[language]}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={onRegisterClick} 
              className="bg-white text-blue-600 hover:bg-gray-100 text-base px-8 font-semibold"
            >
              {txt.registerNow[language]}
            </Button>
            <button 
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              {txt.askQuestion[language]}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo & Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900">nextcargo.eu</span>
              </div>
              <p className="text-sm text-gray-600">
                {txt.footerDescription[language]}
              </p>
            </div>

            {/* Contacts */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">{txt.contacts[language]}</h4>
              <div className="space-y-3 text-sm">
                <a 
                  href="https://wa.me/994508700969" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp: +994 50 870 09 69
                </a>
                <a 
                  href="tel:+994508700969"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  AZ: +994 50 870 09 69
                </a>
                <a 
                  href="tel:+48576925110"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  PL: +48 787 372 555
                </a>
                <a 
                  href="mailto:info@nextcargo.eu"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  info@nextcargo.eu
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">{txt.workingHours[language]}</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>{txt.monFri[language]}</div>
                <div>{txt.sat[language]}</div>
                <div>{txt.sun[language]}</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            {txt.copyright[language]}
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center transition-colors z-50"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
}
