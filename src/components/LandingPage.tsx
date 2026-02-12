import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Package, MapPin, Shield, Clock, CreditCard, ChevronDown, MessageCircle, Phone, Mail, Check } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const faqs = [
  {
    question: "Как работает доставка из Польши?",
    answer: "Вы покупаете товар в любом европейском магазине, указываете наш склад в Польше как адрес доставки. Мы принимаем посылку и доставляем её в Азербайджан."
  },
  {
    question: "Сколько времени занимает доставка?",
    answer: "Стандартная доставка занимает 7-14 рабочих дней с момента поступления товара на наш склад в Польше."
  },
  {
    question: "Как рассчитывается стоимость?",
    answer: "Стоимость рассчитывается по весу посылки. От 1 кг — $7 за кг, от 5 кг — $6 за кг, от 10 кг — $5 за кг. Минимальная оплата — $7."
  },
  {
    question: "Какие товары можно заказывать?",
    answer: "Можно заказывать одежду, электронику, косметику, детские товары и многое другое. Запрещены: опасные грузы, оружие, контрафакт."
  },
  {
    question: "Как отслеживать посылку?",
    answer: "После регистрации вы получаете личный кабинет, где видите статус всех ваших посылок в режиме реального времени."
  },
  {
    question: "Есть ли страховка?",
    answer: "Да, все посылки застрахованы. В случае утери или повреждения мы компенсируем стоимость товара."
  }
];

const pricingTiers = [
  {
    weight: "до 5 кг",
    price: "$7",
    perKg: "за кг",
    popular: false,
    features: ["Стандартная упаковка", "Отслеживание", "Страховка"]
  },
  {
    weight: "5-10 кг",
    price: "$6",
    perKg: "за кг",
    popular: true,
    features: ["Усиленная упаковка", "Приоритетная отправка", "Отслеживание", "Страховка"]
  },
  {
    weight: "от 10 кг",
    price: "$5",
    perKg: "за кг",
    popular: false,
    features: ["Усиленная упаковка", "Приоритетная отправка", "Отслеживание", "Полная страховка"]
  }
];

const steps = [
  {
    number: "1",
    title: "Зарегистрируйтесь",
    description: "Создайте аккаунт и получите персональный адрес склада в Польше"
  },
  {
    number: "2",
    title: "Закажите товар",
    description: "Покупайте в любых европейских магазинах, указывая наш склад"
  },
  {
    number: "3",
    title: "Мы примем посылку",
    description: "Получим ваш заказ, проверим и сфотографируем содержимое"
  },
  {
    number: "4",
    title: "Доставим в Баку",
    description: "Отправим посылку и доставим прямо к вашей двери"
  }
];

const advantages = [
  {
    icon: Shield,
    title: "Надёжно",
    description: "Все посылки застрахованы. Гарантируем сохранность товара"
  },
  {
    icon: Clock,
    title: "Быстро",
    description: "Доставка 7-14 дней. Отправки каждую неделю"
  },
  {
    icon: CreditCard,
    title: "Выгодно",
    description: "Честные цены без скрытых комиссий. Оплата при получении"
  },
  {
    icon: MapPin,
    title: "Удобно",
    description: "Доставка до двери. Отслеживание в личном кабинете"
  }
];

export default function LandingPage({ onLoginClick, onRegisterClick }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleWhatsApp = () => {
    window.open('https://wa.me/994508700969?text=Здравствуйте! Хочу узнать о доставке из Европы', '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center py-2.5 px-4 text-sm font-medium">
        🎉 Первый заказ — скидка 50%!
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
              Войти
            </Button>
            <Button 
              onClick={onRegisterClick}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Регистрация
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Blue Gradient */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
            Доставка из Европы<br />в Азербайджан
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Покупайте в любых европейских магазинах. Мы доставим ваши заказы из Польши в Баку за 7-14 дней.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={onRegisterClick} 
              className="bg-white text-blue-600 hover:bg-gray-100 text-base px-8 font-semibold"
            >
              Начать бесплатно
            </Button>
            <button 
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Написать в WhatsApp
            </button>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            Регистрация бесплатная • Оплата при получении
          </p>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
            Почему выбирают нас
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
            Как это работает
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
            Тарифы
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Простые и понятные цены. Чем больше вес — тем выгоднее.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`p-6 relative ${tier.popular ? 'border-2 border-blue-600 shadow-xl shadow-blue-600/10' : 'border border-gray-200'}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-blue-900 text-xs font-bold px-4 py-1 rounded-full">
                    ЛУЧШИЙ ВЫБОР
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
            Минимальная оплата — $7. <span className="text-blue-600 font-medium">Первый заказ — скидка 50%!</span>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
            Частые вопросы
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
            Адрес склада в Польше
          </h2>
          <p className="text-gray-600 mb-6">
            Укажите этот адрес при оформлении заказа в европейских магазинах
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
                    Ваш ID: <span className="font-mono">получите после регистрации</span>
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
            Первая регистрация — бесплатно!
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            Готовы начать?
          </h2>
          <p className="text-blue-100 mb-8">
            Зарегистрируйтесь сейчас и получите персональный адрес склада в Польше. Первый заказ — со скидкой 50%.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={onRegisterClick} 
              className="bg-white text-blue-600 hover:bg-gray-100 text-base px-8 font-semibold"
            >
              Зарегистрироваться
            </Button>
            <button 
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Задать вопрос
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
                Доставка товаров из Европы в Азербайджан. Надёжно, быстро, выгодно.
              </p>
            </div>

            {/* Contacts */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Контакты</h4>
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
                  PL: +48 576 925 110
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
              <h4 className="font-semibold mb-4 text-gray-900">Режим работы</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Пн-Пт: 09:00 — 18:00</div>
                <div>Сб: 10:00 — 15:00</div>
                <div>Вс: выходной</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            © 2025 NextCargo. Все права защищены.
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
