import { User } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { User as UserIcon, SignOut, Barcode, Envelope, Globe } from '@phosphor-icons/react'
import { useTranslation, LanguageSelector, Language } from '@/lib/i18n'

interface ProfileProps {
  user: User
  onLogout: () => void
}

// Profile translations
const profileTxt = {
  profile: { ru: 'Профиль', en: 'Profile', az: 'Profil' },
  customer: { ru: 'Клиент', en: 'Customer', az: 'Müştəri' },
  fullName: { ru: 'Полное имя', en: 'Full Name', az: 'Tam ad' },
  email: { ru: 'Электронная почта', en: 'Email', az: 'E-poçt' },
  finCode: { ru: 'FIN код', en: 'FIN Code', az: 'FIN kodu' },
  signOut: { ru: 'Выйти', en: 'Sign Out', az: 'Çıxış' },
  language: { ru: 'Язык', en: 'Language', az: 'Dil' }
}

export function Profile({ user, onLogout }: ProfileProps) {
  const { language } = useTranslation()
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  const txt = profileTxt

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
