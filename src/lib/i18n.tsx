import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { STATUS_TRANSLATION_KEY } from './constants'
import { OrderStatus } from './types'

export type Language = 'ru' | 'en' | 'az'

// Translations object
export const translations = {
  // Landing Page
  landing: {
    heroTitle: {
      ru: 'Доставка товаров\nпо региону',
      en: 'Goods Delivery\nThroughout the Region',
      az: 'Malların çatdırılması\nregion üzrə'
    },
    heroSubtitle: {
      ru: 'Мы доставляем товары по региону.',
      en: 'We deliver goods throughout the region.',
      az: 'Biz malları region üzrə çatdırırıq.'
    },
    getStarted: {
      ru: 'Начать',
      en: 'Get Started',
      az: 'Başla'
    },
    learnMore: {
      ru: 'Узнать больше',
      en: 'Learn More',
      az: 'Daha çox öyrən'
    },
    whyChooseUs: {
      ru: 'Почему выбирают нас',
      en: 'Why Choose Us',
      az: 'Niyə bizi seçməlisiniz'
    },
    fastDelivery: {
      ru: 'Быстрая доставка',
      en: 'Fast Delivery',
      az: 'Sürətli çatdırılma'
    },
    fastDeliveryDesc: {
      ru: 'Доставка от 7 до 14 рабочих дней из Польши в Азербайджан',
      en: 'Delivery from 7 to 14 business days from Poland to Azerbaijan',
      az: 'Polşadan Azərbaycana 7-14 iş günü ərzində çatdırılma'
    },
    realTimeTracking: {
      ru: 'Отслеживание в реальном времени',
      en: 'Real-Time Tracking',
      az: 'Real vaxt izləmə'
    },
    realTimeTrackingDesc: {
      ru: 'Следите за вашим грузом на каждом этапе доставки',
      en: 'Track your cargo at every stage of delivery',
      az: 'Çatdırılmanın hər mərhələsində yükünüzü izləyin'
    },
    securePackaging: {
      ru: 'Надежная упаковка',
      en: 'Secure Packaging',
      az: 'Təhlükəsiz qablaşdırma'
    },
    securePackagingDesc: {
      ru: 'Ваши товары защищены на протяжении всего пути',
      en: 'Your goods are protected throughout the journey',
      az: 'Mallarınız bütün yol boyu qorunur'
    },
    support247: {
      ru: 'Поддержка 24/7',
      en: '24/7 Support',
      az: '24/7 Dəstək'
    },
    support247Desc: {
      ru: 'Наша команда всегда готова помочь вам',
      en: 'Our team is always ready to help you',
      az: 'Komandamız həmişə sizə kömək etməyə hazırdır'
    },
    howItWorks: {
      ru: 'Как это работает',
      en: 'How It Works',
      az: 'Necə işləyir'
    },
    step1: {
      ru: 'Зарегистрируйтесь',
      en: 'Register',
      az: 'Qeydiyyatdan keçin'
    },
    step1Desc: {
      ru: 'Создайте аккаунт за несколько минут',
      en: 'Create an account in minutes',
      az: 'Bir neçə dəqiqə ərzində hesab yaradın'
    },
    step2: {
      ru: 'Получите FIN код',
      en: 'Get FIN Code',
      az: 'FIN kodu alın'
    },
    step2Desc: {
      ru: 'Уникальный код для отслеживания ваших заказов',
      en: 'Unique code to track your orders',
      az: 'Sifarişlərinizi izləmək üçün unikal kod'
    },
    step3: {
      ru: 'Заказывайте товары',
      en: 'Order Products',
      az: 'Məhsul sifariş edin'
    },
    step3Desc: {
      ru: 'Покупайте в любых интернет-магазинах Польши',
      en: 'Shop at any Polish online stores',
      az: 'Polşanın istənilən onlayn mağazalarından alış-veriş edin'
    },
    step4: {
      ru: 'Отслеживайте доставку',
      en: 'Track Delivery',
      az: 'Çatdırılmanı izləyin'
    },
    step4Desc: {
      ru: 'Следите за статусом в личном кабинете',
      en: 'Monitor status in your account',
      az: 'Hesabınızda statusu izləyin'
    },
    pricing: {
      ru: 'Тарифы',
      en: 'Pricing',
      az: 'Tariflər'
    },
    pricePerKg: {
      ru: 'за кг',
      en: 'per kg',
      az: 'kq üçün'
    },
    minWeight: {
      ru: 'Минимальный вес',
      en: 'Minimum weight',
      az: 'Minimum çəki'
    },
    deliveryTime: {
      ru: 'Срок доставки',
      en: 'Delivery time',
      az: 'Çatdırılma müddəti'
    },
    days: {
      ru: 'дней',
      en: 'days',
      az: 'gün'
    },
    freePackaging: {
      ru: 'Бесплатная упаковка',
      en: 'Free packaging',
      az: 'Pulsuz qablaşdırma'
    },
    insurance: {
      ru: 'Страховка груза',
      en: 'Cargo insurance',
      az: 'Yük sığortası'
    },
    discount: {
      ru: 'скидка',
      en: 'discount',
      az: 'endirim'
    },
    faq: {
      ru: 'Часто задаваемые вопросы',
      en: 'Frequently Asked Questions',
      az: 'Tez-tez verilən suallar'
    },
    faqQuestion1: {
      ru: 'Как долго занимает доставка?',
      en: 'How long does delivery take?',
      az: 'Çatdırılma nə qədər vaxt aparır?'
    },
    faqAnswer1: {
      ru: 'Стандартная доставка занимает от 7 до 14 рабочих дней. Срок зависит от типа товара и таможенного оформления.',
      en: 'Standard delivery takes 7 to 14 business days. The term depends on the type of goods and customs clearance.',
      az: 'Standart çatdırılma 7-14 iş günü çəkir. Müddət mal növü və gömrük rəsmiləşdirməsindən asılıdır.'
    },
    faqQuestion2: {
      ru: 'Какие товары можно заказывать?',
      en: 'What products can I order?',
      az: 'Hansı məhsulları sifariş edə bilərəm?'
    },
    faqAnswer2: {
      ru: 'Вы можете заказывать любые товары, кроме запрещенных к пересылке (оружие, взрывчатые вещества, наркотики и т.д.).',
      en: 'You can order any products except prohibited items (weapons, explosives, drugs, etc.).',
      az: 'Qadağan olunmuş əşyalar (silah, partlayıcı maddələr, narkotiklər və s.) istisna olmaqla istənilən məhsulu sifariş edə bilərsiniz.'
    },
    faqQuestion3: {
      ru: 'Как рассчитывается стоимость?',
      en: 'How is the cost calculated?',
      az: 'Dəyər necə hesablanır?'
    },
    faqAnswer3: {
      ru: 'Стоимость зависит только от веса посылки и фиксирована: документы до 500 г — 23€, 0-5 кг — 47€, 5-10 кг — 70€, 10-23 кг — 140€. Доплат по весу внутри тарифа нет.',
      en: 'The cost depends only on the weight of the package and is fixed: documents up to 500 g — 23€, 0-5 kg — 47€, 5-10 kg — 70€, 10-23 kg — 140€. There are no per-kilogram surcharges within a tier.',
      az: 'Dəyər yalnız bağlamanın çəkisindən asılıdır və sabitdir: 500 q-a qədər sənədlər — 23€, 0-5 kq — 47€, 5-10 kq — 70€, 10-23 kq — 140€. Tarif daxilində kiloqrama görə əlavə ödəniş yoxdur.'
    },
    faqQuestion4: {
      ru: 'Есть ли страховка?',
      en: 'Is there insurance?',
      az: 'Sığorta varmı?'
    },
    faqAnswer4: {
      ru: 'Да, все посылки застрахованы. В случае повреждения или утери груза вы получите полную компенсацию.',
      en: 'Yes, all packages are insured. In case of damage or loss, you will receive full compensation.',
      az: 'Bəli, bütün bağlamalar sığortalanıb. Zədə və ya itki halında tam kompensasiya alacaqsınız.'
    },
    contactUs: {
      ru: 'Свяжитесь с нами',
      en: 'Contact Us',
      az: 'Bizimlə əlaqə'
    },
    writeWhatsApp: {
      ru: 'Написать в WhatsApp',
      en: 'Write on WhatsApp',
      az: 'WhatsApp-da yazın'
    },
    addressLabel: {
      ru: 'Адрес склада:',
      en: 'Warehouse address:',
      az: 'Anbar ünvanı:'
    },
    phoneAzerbaijan: {
      ru: 'Телефон (Азербайджан):',
      en: 'Phone (Azerbaijan):',
      az: 'Telefon (Azərbaycan):'
    },
    phonePoland: {
      ru: 'Телефон (Польша):',
      en: 'Phone (Poland):',
      az: 'Telefon (Polşa):'
    },
    allRightsReserved: {
      ru: 'Все права защищены',
      en: 'All rights reserved',
      az: 'Bütün hüquqlar qorunur'
    }
  },
  
  // Auth
  auth: {
    login: {
      ru: 'Вход',
      en: 'Login',
      az: 'Giriş'
    },
    register: {
      ru: 'Регистрация',
      en: 'Register',
      az: 'Qeydiyyat'
    },
    email: {
      ru: 'Email',
      en: 'Email',
      az: 'Email'
    },
    password: {
      ru: 'Пароль',
      en: 'Password',
      az: 'Şifrə'
    },
    confirmPassword: {
      ru: 'Подтвердите пароль',
      en: 'Confirm Password',
      az: 'Şifrəni təsdiqləyin'
    },
    firstName: {
      ru: 'Имя',
      en: 'First Name',
      az: 'Ad'
    },
    lastName: {
      ru: 'Фамилия',
      en: 'Last Name',
      az: 'Soyad'
    },
    finCode: {
      ru: 'FIN код',
      en: 'FIN Code',
      az: 'FIN kodu'
    },
    loginButton: {
      ru: 'Войти',
      en: 'Sign In',
      az: 'Daxil ol'
    },
    registerButton: {
      ru: 'Зарегистрироваться',
      en: 'Sign Up',
      az: 'Qeydiyyatdan keç'
    },
    noAccount: {
      ru: 'Нет аккаунта?',
      en: "Don't have an account?",
      az: 'Hesabınız yoxdur?'
    },
    hasAccount: {
      ru: 'Уже есть аккаунт?',
      en: 'Already have an account?',
      az: 'Artıq hesabınız var?'
    },
    backToHome: {
      ru: 'На главную',
      en: 'Back to Home',
      az: 'Ana səhifəyə'
    },
    welcomeBack: {
      ru: 'С возвращением!',
      en: 'Welcome back!',
      az: 'Xoş gəldiniz!'
    },
    loginSubtitle: {
      ru: 'Войдите в свой аккаунт',
      en: 'Sign in to your account',
      az: 'Hesabınıza daxil olun'
    },
    createAccount: {
      ru: 'Создать аккаунт',
      en: 'Create Account',
      az: 'Hesab yaradın'
    },
    registerSubtitle: {
      ru: 'Заполните данные для регистрации',
      en: 'Fill in the details to register',
      az: 'Qeydiyyat üçün məlumatları doldurun'
    },
    loginSuccess: {
      ru: 'Успешный вход!',
      en: 'Login successful!',
      az: 'Uğurlu giriş!'
    },
    registerSuccess: {
      ru: 'Регистрация успешна!',
      en: 'Registration successful!',
      az: 'Qeydiyyat uğurlu oldu!'
    },
    loginError: {
      ru: 'Ошибка входа',
      en: 'Login error',
      az: 'Giriş xətası'
    },
    registerError: {
      ru: 'Ошибка регистрации',
      en: 'Registration error',
      az: 'Qeydiyyat xətası'
    }
  },
  
  // Orders / Warehouse
  orders: {
    title: {
      ru: 'Мой склад',
      en: 'My Warehouse',
      az: 'Mənim anbarım'
    },
    myOrders: {
      ru: 'Мои посылки',
      en: 'My Packages',
      az: 'Mənim bağlamalarım'
    },
    warehouseTitle: {
      ru: 'Ваш адрес склада в Польше',
      en: 'Your Warehouse Address in Poland',
      az: 'Polşada anbar ünvanınız'
    },
    warehouseHint: {
      ru: 'Укажите этот адрес при заказе товаров',
      en: 'Use this address when ordering products',
      az: 'Məhsul sifariş edərkən bu ünvanı istifadə edin'
    },
    finCodeHelp: {
      ru: 'Ваш FIN код помогает нам идентифицировать ваши посылки',
      en: 'Your FIN code helps us identify your packages',
      az: 'FIN kodunuz bağlamalarınızı müəyyən etməyə kömək edir'
    },
    copy: {
      ru: 'Копировать',
      en: 'Copy',
      az: 'Kopyala'
    },
    copied: {
      ru: 'Скопировано',
      en: 'Copied',
      az: 'Kopyalandı'
    },
    addressCopied: {
      ru: 'Адрес скопирован в буфер обмена!',
      en: 'Address copied to clipboard!',
      az: 'Ünvan buferə kopyalandı!'
    },
    trackingNumber: {
      ru: 'Трек-номер',
      en: 'Tracking Number',
      az: 'İzləmə nömrəsi'
    },
    status: {
      ru: 'Статус',
      en: 'Status',
      az: 'Status'
    },
    noOrders: {
      ru: 'На вашем складе пока нет посылок. Закажите товары из польских магазинов и укажите адрес нашего склада!',
      en: 'Your warehouse is empty. Order products from Polish stores and use our warehouse address!',
      az: 'Anbarınızda hələ bağlama yoxdur. Polşa mağazalarından sifariş edin və anbar ünvanımızı istifadə edin!'
    },
    orderDetails: {
      ru: 'Детали посылки',
      en: 'Package Details',
      az: 'Bağlama detalları'
    },
    details: {
      ru: 'Детали',
      en: 'Details',
      az: 'Detallar'
    },
    trackingHistory: {
      ru: 'История отслеживания',
      en: 'Tracking History',
      az: 'İzləmə tarixi'
    },
    description: {
      ru: 'Описание',
      en: 'Description',
      az: 'Təsvir'
    },
    origin: {
      ru: 'Откуда',
      en: 'Origin',
      az: 'Haradan'
    },
    destination: {
      ru: 'Куда',
      en: 'Destination',
      az: 'Hara'
    },
    weight: {
      ru: 'Вес',
      en: 'Weight',
      az: 'Çəki'
    },
    created: {
      ru: 'Создан',
      en: 'Created',
      az: 'Yaradıldı'
    },
    lastUpdated: {
      ru: 'Последнее обновление',
      en: 'Last Updated',
      az: 'Son yenilənmə'
    },
    // Pricing section
    pricingTitle: {
      ru: 'Тарифы доставки',
      en: 'Delivery Rates',
      az: 'Çatdırılma tarifləri'
    },
    pricingSubtitle: {
      ru: 'Из Польши в Азербайджан',
      en: 'From Poland to Azerbaijan',
      az: 'Polşadan Azərbaycana'
    },
    documents: {
      ru: 'Документы / 500 г',
      en: 'Documents / 500 g',
      az: 'Sənədlər / 500 q'
    },
    paymentTitle: {
      ru: 'Оплата',
      en: 'Payment',
      az: 'Ödəniş'
    },
    paymentMethod: {
      ru: 'Оплата на польскую карту',
      en: 'Payment to Polish card',
      az: 'Polşa kartına ödəniş'
    },
    paymentNote: {
      ru: 'После поступления посылки на склад, вам придет уведомление на email с суммой и реквизитами для оплаты',
      en: 'After your package arrives at the warehouse, you will receive an email notification with the amount and payment details',
      az: 'Bağlamanız anbara çatdıqdan sonra ödəniş məbləği və detalları ilə e-poçt bildirişi alacaqsınız'
    },
    howItWorks: {
      ru: 'Как это работает',
      en: 'How it works',
      az: 'Necə işləyir'
    },
    step1: {
      ru: 'Укажите адрес склада + ваши данные',
      en: 'Use warehouse address + your details',
      az: 'Anbar ünvanı + məlumatlarınızı göstərin'
    },
    step2: {
      ru: 'Отправьте скриншот заказа на WhatsApp',
      en: 'Send order screenshot to WhatsApp',
      az: 'Sifariş skrinşotunu WhatsApp-a göndərin'
    },
    step3: {
      ru: 'Мы получим посылку и свяжемся с вами',
      en: 'We receive package and contact you',
      az: 'Bağlamanı alırıq və sizinlə əlaqə saxlayırıq'
    },
    step4: {
      ru: 'Доставляем в Азербайджан',
      en: 'We deliver to Azerbaijan',
      az: 'Azərbaycana çatdırırıq'
    },
    whatsappTitle: {
      ru: 'Отправьте скриншот заказа',
      en: 'Send order screenshot',
      az: 'Sifariş skrinşotunu göndərin'
    },
    whatsappHint: {
      ru: 'После покупки отправьте скриншот заказа',
      en: 'After purchase send order screenshot',
      az: 'Alışdan sonra sifariş skrinşotunu göndərin'
    },
    // Discount system
    firstOrderDiscount: {
      ru: '🎉 Скидка 50% на первый заказ!',
      en: '🎉 50% off your first order!',
      az: '🎉 İlk sifarişinizə 50% endirim!'
    },
    discountApplied: {
      ru: 'Ваша скидка',
      en: 'Your discount',
      az: 'Sizin endirim'
    },
    originalPrice: {
      ru: 'Обычная цена',
      en: 'Regular price',
      az: 'Adi qiymət'
    },
    discountedPrice: {
      ru: 'Со скидкой',
      en: 'With discount',
      az: 'Endirimlə'
    },
    newCustomer: {
      ru: 'Новый клиент',
      en: 'New customer',
      az: 'Yeni müştəri'
    },
    discountValidUntil: {
      ru: 'Скидка действует на ваш первый заказ',
      en: 'Discount applies to your first order',
      az: 'Endirim ilk sifarişinizə şamil edilir'
    }
  },
  
  // Profile
  profile: {
    title: {
      ru: 'Профиль',
      en: 'Profile',
      az: 'Profil'
    },
    personalInfo: {
      ru: 'Личная информация',
      en: 'Personal Information',
      az: 'Şəxsi məlumat'
    },
    yourFinCode: {
      ru: 'Ваш FIN код',
      en: 'Your FIN Code',
      az: 'FIN kodunuz'
    },
    finCodeDescription: {
      ru: 'Используйте этот код при заказе товаров',
      en: 'Use this code when ordering products',
      az: 'Məhsul sifariş edərkən bu kodu istifadə edin'
    },
    copyFinCode: {
      ru: 'Копировать FIN код',
      en: 'Copy FIN Code',
      az: 'FIN kodunu kopyala'
    },
    copied: {
      ru: 'Скопировано!',
      en: 'Copied!',
      az: 'Kopyalandı!'
    },
    logout: {
      ru: 'Выйти',
      en: 'Logout',
      az: 'Çıxış'
    },
    language: {
      ru: 'Язык',
      en: 'Language',
      az: 'Dil'
    }
  },
  
  // Admin
  admin: {
    title: {
      ru: 'Панель администратора',
      en: 'Admin Panel',
      az: 'Admin paneli'
    },
    orders: {
      ru: 'Заказы',
      en: 'Orders',
      az: 'Sifarişlər'
    },
    searchByFin: {
      ru: 'Поиск по FIN коду...',
      en: 'Search by FIN code...',
      az: 'FIN kodu ilə axtarış...'
    },
    addOrder: {
      ru: 'Добавить заказ',
      en: 'Add Order',
      az: 'Sifariş əlavə et'
    },
    editOrder: {
      ru: 'Редактировать заказ',
      en: 'Edit Order',
      az: 'Sifarişi redaktə et'
    },
    deleteOrder: {
      ru: 'Удалить заказ',
      en: 'Delete Order',
      az: 'Sifarişi sil'
    },
    customer: {
      ru: 'Клиент',
      en: 'Customer',
      az: 'Müştəri'
    },
    selectCustomer: {
      ru: 'Выберите клиента...',
      en: 'Select customer...',
      az: 'Müştəri seçin...'
    },
    save: {
      ru: 'Сохранить',
      en: 'Save',
      az: 'Yadda saxla'
    },
    cancel: {
      ru: 'Отмена',
      en: 'Cancel',
      az: 'Ləğv et'
    },
    allOrders: {
      ru: 'Все заказы',
      en: 'All Orders',
      az: 'Bütün sifarişlər'
    },
    noOrdersFound: {
      ru: 'Заказы не найдены',
      en: 'No orders found',
      az: 'Sifariş tapılmadı'
    },
    orderAdded: {
      ru: 'Заказ добавлен',
      en: 'Order added',
      az: 'Sifariş əlavə edildi'
    },
    orderUpdated: {
      ru: 'Заказ обновлен',
      en: 'Order updated',
      az: 'Sifariş yeniləndi'
    },
    orderDeleted: {
      ru: 'Заказ удален',
      en: 'Order deleted',
      az: 'Sifariş silindi'
    },
    cargoManagement: {
      ru: 'Управление грузами',
      en: 'Cargo Management',
      az: 'Yük idarəetməsi'
    },
    searchFilter: {
      ru: 'Поиск и фильтр',
      en: 'Search & Filter',
      az: 'Axtar və filtrələ'
    }
  },
  
  // Common
  common: {
    loading: {
      ru: 'Загрузка...',
      en: 'Loading...',
      az: 'Yüklənir...'
    },
    error: {
      ru: 'Ошибка',
      en: 'Error',
      az: 'Xəta'
    },
    success: {
      ru: 'Успешно',
      en: 'Success',
      az: 'Uğurlu'
    },
    close: {
      ru: 'Закрыть',
      en: 'Close',
      az: 'Bağla'
    },
    yes: {
      ru: 'Да',
      en: 'Yes',
      az: 'Bəli'
    },
    no: {
      ru: 'Нет',
      en: 'No',
      az: 'Xeyr'
    }
  },
  
  // Navigation
  nav: {
    orders: {
      ru: 'Склад',
      en: 'Warehouse',
      az: 'Anbar'
    },
    profile: {
      ru: 'Профиль',
      en: 'Profile',
      az: 'Profil'
    },
    apps: {
      ru: 'Магазины',
      en: 'Shops',
      az: 'Mağazalar'
    },
    instructions: {
      ru: 'Инструкция',
      en: 'Instructions',
      az: 'Təlimat'
    }
  },

  // Строки оболочки приложения. Раньше они были инлайн-тернарниками в App.tsx,
  // а тосты вообще не переводились.
  app: {
    welcome: { ru: 'Добро пожаловать', en: 'Welcome', az: 'Xoş gəlmisiniz' },
    loggedOut: {
      ru: 'Вы вышли из аккаунта',
      en: 'Logged out successfully',
      az: 'Hesabdan çıxdınız'
    },
    logoutFailed: {
      ru: 'Не удалось выйти',
      en: 'Failed to log out',
      az: 'Çıxış alınmadı'
    },
    loadFailed: {
      ru: 'Не удалось загрузить данные',
      en: 'Failed to load data',
      az: 'Məlumatlar yüklənmədi'
    },
    profileMissing: {
      ru: 'Профиль не найден. Обратитесь в поддержку.',
      en: 'Profile not found. Please contact support.',
      az: 'Profil tapılmadı. Dəstəyə müraciət edin.'
    },
    orderUpdated: {
      ru: 'Заказ обновлён',
      en: 'Order updated',
      az: 'Sifariş yeniləndi'
    },
    orderUpdateFailed: {
      ru: 'Не удалось обновить заказ',
      en: 'Failed to update order',
      az: 'Sifariş yenilənmədi'
    },
    orderDeleteFailed: {
      ru: 'Не удалось удалить заказ',
      en: 'Failed to delete order',
      az: 'Sifariş silinmədi'
    },
    notificationFailed: {
      ru: 'Не удалось отправить уведомление',
      en: 'Failed to send notification',
      az: 'Bildiriş göndərilmədi'
    },
    completeProfileTitle: {
      ru: 'Заполните данные',
      en: 'Complete Your Profile',
      az: 'Məlumatları doldurun'
    },
    completeProfileBody: {
      ru: 'Для получения посылок необходимо заполнить серийный номер документа и дату рождения в разделе Профиль.',
      en: 'To receive packages, please fill in your document serial number and date of birth in the Profile section.',
      az: 'Bağlamaları almaq üçün Profil bölməsində sənəd seriya nömrəsini və doğum tarixini doldurmalısınız.'
    },
    later: { ru: 'Позже', en: 'Later', az: 'Sonra' },
    fillNow: { ru: 'Заполнить', en: 'Fill Now', az: 'Doldur' }
  },
  
  // Marketplaces
  marketplaces: {
    title: {
      ru: 'Популярные магазины',
      en: 'Popular Stores',
      az: 'Populyar mağazalar'
    },
    subtitle: {
      ru: 'Покупайте товары на этих сайтах и получайте их с помощью NextCargo',
      en: 'Shop at these sites and receive your items with NextCargo',
      az: 'Bu saytlardan alış-veriş edin və NextCargo ilə alın'
    },
    visitStore: {
      ru: 'Перейти',
      en: 'Visit',
      az: 'Keçid'
    }
  },
  
  // Order statuses
  statuses: {
    pending: {
      ru: 'Ожидает',
      en: 'Pending',
      az: 'Gözləyir'
    },
    processing: {
      ru: 'В обработке',
      en: 'Processing',
      az: 'İşlənir'
    },
    shipped: {
      ru: 'Отправлено',
      en: 'Shipped',
      az: 'Göndərildi'
    },
    inTransit: {
      ru: 'В пути',
      en: 'In Transit',
      az: 'Yolda'
    },
    inWarehouse: {
      ru: 'На складе',
      en: 'In Warehouse',
      az: 'Anbarda'
    },
    outForDelivery: {
      ru: 'Доставляется',
      en: 'Out for Delivery',
      az: 'Çatdırılır'
    },
    delivered: {
      ru: 'Доставлено',
      en: 'Delivered',
      az: 'Çatdırıldı'
    },
    cancelled: {
      ru: 'Отменено',
      en: 'Cancelled',
      az: 'Ləğv edildi'
    }
  },

  notifications: {
    title: { ru: 'Уведомления', en: 'Notifications', az: 'Bildirişlər' },
    empty: {
      ru: 'Уведомлений пока нет',
      en: 'No notifications yet',
      az: 'Hələ bildiriş yoxdur'
    },
    markAllRead: {
      ru: 'Отметить все прочитанными',
      en: 'Mark all as read',
      az: 'Hamısını oxunmuş kimi işarələ'
    }
  },

  // Тексты событий трекинга. Раньше описание события писалось админкой в базу
  // по-английски и так же показывалось клиенту при любом выбранном языке.
  tracking: {
    orderCreated: {
      ru: 'Заказ создан, статус: {status}',
      en: 'Order created with status: {status}',
      az: 'Sifariş yaradıldı, status: {status}'
    },
    statusChanged: {
      ru: 'Статус изменён на: {status}',
      en: 'Status changed to: {status}',
      az: 'Status dəyişdirildi: {status}'
    }
  }
}

/**
 * Подпись статуса заказа. Единая точка на всё приложение — ключи берутся из
 * STATUS_TRANSLATION_KEY, поэтому расхождение со OrderStatus невозможно.
 */
export function getStatusLabel(status: OrderStatus, language: Language): string {
  return translations.statuses[STATUS_TRANSLATION_KEY[status]][language]
}

// Language names for selector
export const languageNames: Record<Language, string> = {
  ru: 'Русский',
  en: 'English',
  az: 'Azərbaycan'
}

// Language flags/codes
export const languageFlags: Record<Language, string> = {
  ru: '🇷🇺',
  en: '🇬🇧',
  az: '🇦🇿'
}

// SEO metadata per language. Kept in sync with the static tags in index.html.
export const seoMeta = {
  title: {
    ru: 'NextCargo — доставка товаров по региону',
    en: 'NextCargo — Goods Delivery Throughout the Region',
    az: 'NextCargo — malların region üzrə çatdırılması'
  },
  description: {
    ru: 'NextCargo доставляет товары по региону за 7–14 дней. Бесплатная регистрация, страховка посылок, отслеживание в личном кабинете и оплата при получении. Первый заказ — скидка 50%.',
    en: 'NextCargo delivers goods throughout the region in 7–14 days. Free registration, insured parcels, real-time tracking in your personal account and pay-on-delivery. First order — 50% off.',
    az: 'NextCargo malları region üzrə 7–14 gün ərzində çatdırır. Pulsuz qeydiyyat, sığortalı bağlamalar, şəxsi hesabda izləmə və çatdırılmada ödəniş. İlk sifariş — 50% endirim.'
  },
  ogLocale: {
    ru: 'ru_RU',
    en: 'en_US',
    az: 'az_AZ'
  }
} as const

// Detect language - Always default to English, only use saved preference
export function detectLanguage(): Language {
  // Only check localStorage - if user manually selected a language, use it
  const saved = localStorage.getItem('language') as Language
  if (saved && ['ru', 'en', 'az'].includes(saved)) {
    return saved
  }
  
  // Always default to English
  return 'en'
}

// Context
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (section: keyof typeof translations, key: string) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

// Provider
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => detectLanguage())
  
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }
  
  const t = (section: keyof typeof translations, key: string): string => {
    const sectionData = translations[section]
    if (!sectionData) return key
    
    const keyData = (sectionData as Record<string, Record<Language, string>>)[key]
    if (!keyData) return key
    
    return keyData[language] || keyData['en'] || key
  }
  
  useEffect(() => {
    // Keep the crawlable <head> in sync with the selected language.
    // The static defaults live in index.html; this only overrides them client-side.
    document.documentElement.lang = language

    document.title = seoMeta.title[language]

    const setMeta = (selector: string, content: string) => {
      const el = document.head.querySelector<HTMLMetaElement>(selector)
      if (el) el.content = content
    }

    setMeta('meta[name="description"]', seoMeta.description[language])
    setMeta('meta[property="og:title"]', seoMeta.title[language])
    setMeta('meta[property="og:description"]', seoMeta.description[language])
    setMeta('meta[property="og:locale"]', seoMeta.ogLocale[language])
    setMeta('meta[name="twitter:title"]', seoMeta.title[language])
    setMeta('meta[name="twitter:description"]', seoMeta.description[language])
  }, [language])
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Hook
export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}

// Language Selector Component
export function LanguageSelector({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useTranslation()
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {(['ru', 'en', 'az'] as Language[]).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          aria-label={languageNames[lang]}
          aria-pressed={language === lang}
          className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
            language === lang 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
