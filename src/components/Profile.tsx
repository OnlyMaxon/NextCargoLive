import { useState } from 'react'
import { User } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { User as UserIcon, SignOut, Barcode, Envelope, Globe, IdentificationCard, CalendarBlank, FloppyDisk, Warning } from '@phosphor-icons/react'
import { useTranslation, LanguageSelector } from '@/lib/i18n'
import { usersService } from '@/lib/firebase-services'
import { toast } from 'sonner'

interface ProfileProps {
  user: User
  onLogout: () => void
  onUserUpdate?: (user: User) => void
}

// Profile translations
const profileTxt = {
  profile: { ru: 'Профиль', en: 'Profile', az: 'Profil' },
  customer: { ru: 'Клиент', en: 'Customer', az: 'Müştəri' },
  fullName: { ru: 'Полное имя', en: 'Full Name', az: 'Tam ad' },
  email: { ru: 'Электронная почта', en: 'Email', az: 'E-poçt' },
  finCode: { ru: 'FIN код', en: 'FIN Code', az: 'FIN kodu' },
  signOut: { ru: 'Выйти', en: 'Sign Out', az: 'Çıxış' },
  language: { ru: 'Язык', en: 'Language', az: 'Dil' },
  documentSerial: { ru: 'Серийный номер документа', en: 'Document Serial Number', az: 'Sənəd seriya nömrəsi' },
  birthDate: { ru: 'Дата рождения', en: 'Date of Birth', az: 'Doğum tarixi' },
  save: { ru: 'Сохранить', en: 'Save', az: 'Yadda saxla' },
  saving: { ru: 'Сохранение...', en: 'Saving...', az: 'Saxlanılır...' },
  saved: { ru: 'Данные сохранены!', en: 'Data saved!', az: 'Məlumatlar saxlandı!' },
  required: { ru: 'Обязательные данные', en: 'Required Information', az: 'Tələb olunan məlumat' },
  documentHint: { ru: 'Максимум 10 символов', en: 'Maximum 10 characters', az: 'Maksimum 10 simvol' },
  personalData: { ru: 'Личные данные', en: 'Personal Data', az: 'Şəxsi məlumatlar' }
}

export function Profile({ user, onLogout, onUserUpdate }: ProfileProps) {
  const { language } = useTranslation()
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  const txt = profileTxt

  const [documentSerial, setDocumentSerial] = useState(user.documentSerial || '')
  const [birthDate, setBirthDate] = useState(user.birthDate || '')
  const [saving, setSaving] = useState(false)

  const hasChanges = documentSerial !== (user.documentSerial || '') || birthDate !== (user.birthDate || '')
  const isDataComplete = documentSerial.length > 0 && birthDate.length > 0

  const handleSave = async () => {
    if (!documentSerial || !birthDate) {
      toast.error(language === 'ru' ? 'Заполните все поля' : language === 'az' ? 'Bütün sahələri doldurun' : 'Please fill all fields')
      return
    }

    if (documentSerial.length > 10) {
      toast.error(language === 'ru' ? 'Серийный номер макс. 10 символов' : language === 'az' ? 'Seriya nömrəsi maks. 10 simvol' : 'Serial number max 10 characters')
      return
    }

    setSaving(true)
    try {
      const updatedUser = {
        ...user,
        documentSerial,
        birthDate
      }
      await usersService.updateUser(user.id, { documentSerial, birthDate })
      onUserUpdate?.(updatedUser)
      toast.success(txt.saved[language])
    } catch (error) {
      console.error('Failed to save:', error)
      toast.error(language === 'ru' ? 'Ошибка сохранения' : language === 'az' ? 'Saxlama xətası' : 'Save error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <h2 className="text-xs font-medium text-gray-500">{txt.profile[language]}</h2>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border border-gray-200">
              <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base font-semibold truncate text-gray-900">{user.firstName} {user.lastName}</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">{txt.customer[language]}</p>
            </div>
          </div>
        </CardHeader>
        <Separator className="bg-gray-200" />
        <CardContent className="pt-3 space-y-2">
          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg">
            <UserIcon size={16} className="text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-500">{txt.fullName[language]}</p>
              <p className="font-medium text-sm truncate text-gray-900">{user.firstName} {user.lastName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg">
            <Envelope size={16} className="text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-500">{txt.email[language]}</p>
              <p className="font-medium text-sm truncate text-gray-900">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 bg-blue-50 rounded-lg">
            <Barcode size={16} className="text-blue-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-500">{txt.finCode[language]}</p>
              <p className="font-mono font-semibold text-blue-600 text-sm">{user.finCode}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg">
            <Globe size={16} className="text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-500">{txt.language[language]}</p>
              <div className="mt-1">
                <LanguageSelector />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Data Card - Editable */}
      <Card className={`border shadow-sm ${!isDataComplete ? 'border-amber-300 bg-amber-50/50' : 'border-gray-200 bg-white'}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <IdentificationCard size={18} className={!isDataComplete ? 'text-amber-600' : 'text-blue-600'} />
            <CardTitle className="text-sm font-semibold text-gray-900">{txt.personalData[language]}</CardTitle>
            {!isDataComplete && (
              <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                <Warning size={12} weight="fill" />
                {txt.required[language]}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="documentSerial" className="text-xs text-gray-600 flex items-center gap-1">
              <IdentificationCard size={12} />
              {txt.documentSerial[language]}
            </Label>
            <Input
              id="documentSerial"
              value={documentSerial}
              onChange={(e) => setDocumentSerial(e.target.value.toUpperCase().slice(0, 10))}
              placeholder="AA1234567"
              maxLength={10}
              className="h-9 text-sm font-mono uppercase"
            />
            <p className="text-[10px] text-gray-400">{txt.documentHint[language]}</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="birthDate" className="text-xs text-gray-600 flex items-center gap-1">
              <CalendarBlank size={12} />
              {txt.birthDate[language]}
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="h-9 text-sm"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {hasChanges && (
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-9 text-sm bg-blue-600 hover:bg-blue-700"
            >
              <FloppyDisk size={16} className="mr-1.5" />
              {saving ? txt.saving[language] : txt.save[language]}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardContent className="pt-3 pb-3">
          <Button
            variant="destructive"
            className="w-full h-9 text-sm bg-red-500 hover:bg-red-600 text-white"
            onClick={onLogout}
          >
            <SignOut size={16} className="mr-1.5" />
            {txt.signOut[language]}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
