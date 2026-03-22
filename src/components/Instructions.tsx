import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { 
  MapPin, 
  Phone, 
  EnvelopeSimple, 
  Clock, 
  Copy, 
  CheckCircle, 
  Package, 
  CreditCard,
  FileText,
  ChatCircle 
} from '@phosphor-icons/react'
import { useTranslation, translations } from '@/lib/i18n'
import { toast } from 'sonner'

const commonTxt = translations.common

export function Instructions() {
  const { language } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [showAddressDialog, setShowAddressDialog] = useState(false)
  const [message, setMessage] = useState('')

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
      titleRu: '✉️ Напишите нам',
      titleEn: '✉️ Notify Us',
      titleAz: '✉️ Bizə xəbər verin',
      descRu: 'После отправки товара на склад, сообщите нам о доставке и предоставьте информацию о посылке',
      descEn: 'After shipping items to our warehouse, notify us and provide package information',
      descAz: 'Anbarımıza göndərdikdən sonra bizə xəbər verin və bağlamanın məlumatını təqdim edin',
      icon: FileText
    },
    {
      step: 5,
      titleRu: '✅ Подтверждение',
      titleEn: '✅ Confirmation',
      titleAz: '✅ Təsdiq',
      descRu: 'Мы подтверждаем получение с фотографией товара и готов к отправке в Азербайджан',
      descEn: 'We confirm receipt with photos and the package is ready for shipping to Azerbaijan',
      descAz: 'Biz fotolarla qəbulu təsdiq edirik və baxış Azərbaycana göndərmək üçün hazırdır',
      icon: CheckCircle
    },
    {
      step: 6,
      titleRu: '💳 Оплата',
      titleEn: '💳 Payment',
      titleAz: '💳 Ödəniş',
      descRu: 'Произведите оплату за услугу доставки Азербайджан, и мы отправляем вашу посылку',
      descEn: 'Make payment for Azerbaijan delivery and we ship your package',
      descAz: 'Azərbaycan çatdırılması üçün ödəniş edin və biz bağlamanızı göndəririk',
      icon: CreditCard
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

      {/* Contact Form */}
      <div className="px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {language === 'ru' ? 'Начать заказ' : language === 'az' ? 'Sifariş başlat' : 'Start Order'}
            </CardTitle>
            <CardDescription>
              {language === 'ru' 
                ? 'Отправьте нам ссылки или информацию о товарах, которые вы хотите заказать' 
                : language === 'az'
                ? 'Sifariş etmək istədiyiniz əşyaların keçidlərini və ya məlumatını bizə göndərin'
                : 'Send us links or information about items you want to order'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={language === 'ru' 
                ? 'Вставьте ссылки или опишите товары...' 
                : language === 'az'
                ? 'Keçidləri yapışdırın və ya əşyaları təsvir edin...'
                : 'Paste links or describe items...'}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-32 resize-none"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setMessage('')}
              >
                {language === 'ru' ? 'Очистить' : language === 'az' ? 'Təmizlə' : 'Clear'}
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  if (!message.trim()) {
                    toast.error(language === 'ru' ? 'Введите сообщение' : 'Please enter a message')
                    return
                  }
                  setShowAddressDialog(true)
                }}
              >
                {language === 'ru' ? 'Отправить' : language === 'az' ? 'Göndər' : 'Send'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>
              {language === 'ru' ? 'Подтверждение' : language === 'az' ? 'Təsdiq' : 'Confirmation'}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {language === 'ru'
                ? 'Ваше сообщение будет отправлено нашей команде. Мы свяжемся с вами в течение часа с расчетом стоимости.'
                : language === 'az'
                ? 'Sizin mesajınız bizim komandaya göndəriləcək. Biz bir saatda sizinlə qiymət hesablaması ilə əlaqə saxlayacağıq.'
                : 'Your message will be sent to our team. We will contact you within an hour with a price estimate.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-gray-600 font-medium mb-2">
                {language === 'ru' ? 'Отправить на:' : 'Send to:'}
              </p>
              <p className="text-sm font-semibold text-gray-900">{warehouseData.email}</p>
              <p className="text-sm text-gray-600 mt-1">{warehouseData.phone1}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddressDialog(false)}
              >
                {language === 'ru' ? 'Отмена' : 'Cancel'}
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  toast.success(
                    language === 'ru'
                      ? 'Сообщение отправлено! Ожидайте нашего ответа.'
                      : language === 'az'
                      ? 'Mesaj göndərildi! Bizim cavabımızı gözləyin.'
                      : 'Message sent! Await our response.'
                  )
                  setMessage('')
                  setShowAddressDialog(false)
                  // Here you would send the message to Firebase
                  // await supportService.sendMessage({...})
                }}
              >
                {language === 'ru' ? 'Отправить' : 'Send'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
