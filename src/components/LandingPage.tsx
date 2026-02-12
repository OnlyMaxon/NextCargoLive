import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Package, Truck, MapPin, Shield, Clock, CreditCard, ChevronDown, MessageCircle, Phone, Mail } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
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
    popular: false
  },
  {
    weight: "5-10 кг",
    price: "$6",
    perKg: "за кг",
    popular: true
  },
  {
    weight: "от 10 кг",
    price: "$5",
    perKg: "за кг",
    popular: false
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

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleWhatsApp = () => {
    window.open('https://wa.me/994501234567?text=Здравствуйте! Хочу узнать о доставке из Европы', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Promo Banner */}
      <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-sm font-medium">
        🎉 Первый заказ — скидка 50%! Используйте код: <span className="font-bold">FIRST50</span>
      </div>

      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">nextcargo.eu</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleWhatsApp} className="hidden sm:flex">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button onClick={onGetStarted} size="sm">
              Войти
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Доставка из Европы<br />в Азербайджан
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Покупайте в любых европейских магазинах. Мы доставим ваши заказы из Польши в Баку за 7-14 дней.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onGetStarted} className="text-base px-8">
              Начать бесплатно
            </Button>
            <Button size="lg" variant="outline" onClick={handleWhatsApp} className="text-base px-8">
              <MessageCircle className="w-5 h-5 mr-2" />
              Написать в WhatsApp
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Регистрация бесплатная • Оплата при получении
          </p>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Почему выбирают нас
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {advantages.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Как это работает
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-[2px] bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Тарифы
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Простые и понятные цены. Чем больше вес — тем выгоднее.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`p-6 text-center ${tier.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}
              >
                {tier.popular && (
                  <div className="text-xs font-semibold text-primary mb-2">ПОПУЛЯРНЫЙ</div>
                )}
                <div className="text-sm text-muted-foreground mb-2">{tier.weight}</div>
                <div className="text-4xl font-bold mb-1">{tier.price}</div>
                <div className="text-sm text-muted-foreground">{tier.perKg}</div>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Минимальная оплата — $7. Первый заказ — скидка 50%.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Частые вопросы
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warehouse Address */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Адрес склада в Польше
          </h2>
          <p className="text-muted-foreground mb-6">
            Укажите этот адрес при оформлении заказа в европейских магазинах
          </p>
          <Card className="p-6 inline-block text-left">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold mb-2">NextCargo Warehouse</div>
                <div className="text-muted-foreground text-sm space-y-1">
                  <div>ul. Magazynowa 15/7</div>
                  <div>05-090 Raszyn, Polska</div>
                  <div className="pt-2 text-primary font-medium">
                    Ваш ID: <span className="font-mono">получите после регистрации</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Готовы начать?
          </h2>
          <p className="text-muted-foreground mb-8">
            Зарегистрируйтесь сейчас и получите персональный адрес склада в Польше. Первый заказ — со скидкой 50%.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onGetStarted} className="text-base px-8">
              Зарегистрироваться
            </Button>
            <Button size="lg" variant="outline" onClick={handleWhatsApp} className="text-base px-8">
              <MessageCircle className="w-5 h-5 mr-2" />
              Задать вопрос
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo & Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">nextcargo.eu</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Доставка товаров из Европы в Азербайджан. Надёжно, быстро, выгодно.
              </p>
            </div>

            {/* Contacts */}
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-3 text-sm">
                <a 
                  href="https://wa.me/994501234567" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp: +994 50 123 45 67
                </a>
                <a 
                  href="tel:+994501234567"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +994 50 123 45 67
                </a>
                <a 
                  href="mailto:info@nextcargo.eu"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  info@nextcargo.eu
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div>
              <h4 className="font-semibold mb-4">Режим работы</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Пн-Пт: 09:00 — 18:00</div>
                <div>Сб: 10:00 — 15:00</div>
                <div>Вс: выходной</div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2025 NextCargo. Все права защищены.
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
}
