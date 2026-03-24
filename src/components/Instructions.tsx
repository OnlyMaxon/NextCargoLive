import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Phone, 
  EnvelopeSimple, 
  Clock, 
  Copy, 
  CheckCircle, 
  Package, 
  CreditCard,
  ChatCircle 
} from '@phosphor-icons/react'
import { useTranslation, translations } from '@/lib/i18n'
import { toast } from 'sonner'

const commonTxt = translations.common

export function Instructions() {
  const { language } = useTranslation()
  const [copied, setCopied] = useState(false)

  const warehouseData = {
    name: 'NextCargo Logistics',
    address: 'Wierchow 25, 04-653 Warsaw, Poland',
    phone1: '+48 787 372 555',
    phone2: '+48 783 456 789',
    email: 'warehouse@nextcargo.com',
    workHours: '08:00 - 18:00 (Pon - Pt)',
    openingHours: 'Monday - Friday: 08:00 - 18:00 (GMT+1)'
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success(language === 'ru' ? 'Скопировано!' : language === 'az' ? 'Kopyalandı!' : 'Copied!')
  }

  const instructions = [
    {
      step: 1,
      titleRu: '📧 Отправьте ссылки',
      titleEn: '📧 Send Links',
      titleAz: '📧 Keçidləri göndərin',
      descRu: 'Отправьте нам ссылки на товары, которые вы хотите заказать из магазинов (Allegro, Amazon, IKEA и т.д.)',
      descEn: 'Send us links to the items you want to order from online shops (Allegro, Amazon, IKEA, etc.)',
      descAz: 'İsmarlayıcağınız əşyaların keçidlərini bizə göndərin (Allegro, Amazon, IKEA və s.)',
      icon: ChatCircle
    },
    {
      step: 2,
      titleRu: '💰 Получите цену',
      titleEn: '💰 Get Price Estimate',
      titleAz: '💰 Qiymət əldə edin',
      descRu: 'Мы проверим цены, добавим стоимость доставки до нашего склада и отправим вам итоговую сумму',
      descEn: 'We will check prices, add shipping cost to our warehouse, and send you the total amount',
      descAz: 'Biz qiymətləri yoxlayacağıq, bizim anbarımıza çatdırılma xərclərini əlavə edəcəyik və sizə cəmi məbləği göndərəcəyik',
      icon: CreditCard
    },
    {
      step: 3,
      titleRu: '📦 Доставьте на наш склад',
      titleEn: '📦 Deliver to Our Warehouse',
      titleAz: '📦 Bizim anbarımıza çatdırın',
      descRu: 'Закажите товар в магазине и отправьте на адрес нашего склада (смотри данные ниже)',
      descEn: 'Order the items from the shop and have them shipped to our warehouse address below',
      descAz: 'Mağazadan əşya sifariş edin və bizim anbar ünvanına göndərin (aşağıya baxın)',
      icon: Package
    },
    {
      step: 4,
      titleRu: '✅ Получаем и подтверждаем',
      titleEn: '✅ We Receive & Confirm',
      titleAz: '✅ Alırıq və təsdiq edirik',
      descRu: 'Когда ваш товар поступает на склад, мы делаем фотограф и отправляем вам подтверждение получения',
      descEn: 'When your items arrive at our warehouse, we take photos and send you confirmation of receipt',
      descAz: 'Əşyalarınız anbarımıza gələndə, biz foto çəkirik və sizə qəbul təsdiqi göndəririk',
      icon: CheckCircle
    },
    {
      step: 5,
      titleRu: '💳 Обсуждаем оплату',
      titleEn: '💳 Discuss Payment',
      titleAz: '💳 Ödənişi müzakirə edirik',
      descRu: 'Обсуждаем стоимость отправки в Азербайджан и способ оплаты через WhatsApp или Email',
      descEn: 'We discuss the cost of shipping to Azerbaijan and payment method via WhatsApp or Email',
      descAz: 'Azərbaycana çatdırılma xərclərini və ödəniş üsulunu WhatsApp və ya Email vasitəsilə müzakirə edirik',
      icon: CreditCard
    },
    {
      step: 6,
      titleRu: '🚀 Отправляем в Азербайджан',
      titleEn: '🚀 Ship to Azerbaijan',
      titleAz: '🚀 Azərbaycana göndəririk',
      descRu: 'После оплаты мы отправляем вашу посылку в Азербайджан. Вы получаете трек-номер и отслеживаете доставку',
      descEn: 'After payment, we ship your package to Azerbaijan. You receive a tracking number to monitor delivery',
      descAz: 'Ödəmədən sonra biz sizin bağlamanızı Azərbaycana göndəririk. Çatdırılmanı nəzarət etmək üçün izləmə nömrəsi alırsınız',
      icon: Package
    }
  ]

  const getTitleByLanguage = (titleRu: string, titleEn: string, titleAz: string) => {
    return language === 'ru' ? titleRu : language === 'az' ? titleAz : titleEn
  }

  const getDescByLanguage = (descRu: string, descEn: string, descAz: string) => {
    return language === 'ru' ? descRu : language === 'az' ? descAz : descEn
  }

  return (
    <div className="space-y-6 pb-4">
      {/* Warehouse Information Card */}
      <div className="px-4 pt-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" weight="fill" />
              {language === 'ru' ? 'Данные нашего склада' : language === 'az' ? 'Bizim anbarın məlumatları' : 'Our Warehouse'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Address Card */}
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-600 flex-shrink-0 mt-1" weight="fill" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{warehouseData.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{warehouseData.address}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-7 px-2 text-xs text-blue-600 hover:text-blue-700"
                    onClick={() => copyToClipboard(warehouseData.address)}
                  >
                    <Copy size={14} className="mr-1" />
                    {copied ? (language === 'ru' ? 'Скопировано' : 'Copied') : (language === 'ru' ? 'Копировать' : 'Copy')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              {/* Phone 1 */}
              <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-blue-100">
                <Phone size={18} className="text-blue-600 flex-shrink-0" weight="fill" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600">{language === 'ru' ? 'Основной телефон' : 'Main Phone'}</p>
                  <p className="font-semibold text-gray-900">{warehouseData.phone1}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => copyToClipboard(warehouseData.phone1)}
                >
                  <Copy size={14} />
                </Button>
              </div>

              {/* Phone 2 */}
              <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-blue-100">
                <Phone size={18} className="text-blue-600 flex-shrink-0" weight="fill" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600">{language === 'ru' ? 'Дополнительный телефон' : 'Alternative Phone'}</p>
                  <p className="font-semibold text-gray-900">{warehouseData.phone2}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => copyToClipboard(warehouseData.phone2)}
                >
                  <Copy size={14} />
                </Button>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-blue-100">
                <EnvelopeSimple size={18} className="text-blue-600 flex-shrink-0" weight="fill" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600">{language === 'ru' ? 'Email' : 'Email'}</p>
                  <p className="font-semibold text-gray-900 break-all">{warehouseData.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => copyToClipboard(warehouseData.email)}
                >
                  <Copy size={14} />
                </Button>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-blue-100">
                <Clock size={18} className="text-blue-600 flex-shrink-0 mt-0.5" weight="fill" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{language === 'ru' ? 'Режим работы' : 'Working Hours'}</p>
                  <p className="font-semibold text-gray-900 text-sm">{warehouseData.workHours}</p>
                  <Badge variant="outline" className="mt-2 text-xs">GMT+1</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions Steps */}
      <div className="px-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'ru' ? 'Как это работает?' : language === 'az' ? 'Necə işləyir?' : 'How It Works?'}
        </h2>
        <div className="space-y-3">
          {instructions.map((instruction) => {
            const Icon = instruction.icon
            return (
              <Card key={instruction.step} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Icon size={20} className="text-blue-600" weight="fill" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {getTitleByLanguage(instruction.titleRu, instruction.titleEn, instruction.titleAz)}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {getDescByLanguage(instruction.descRu, instruction.descEn, instruction.descAz)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
