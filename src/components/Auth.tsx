import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { validateFINCode, validateEmail, validatePassword, validateName } from '@/lib/validation'
import { User, AuthTab } from '@/lib/types'
import { Package, ArrowLeft } from '@phosphor-icons/react'
import { authService } from '@/lib/firebase-services'
import { toast } from 'sonner'
import { useTranslation, LanguageSelector, Language } from '@/lib/i18n'

// Auth translations
const authTxt = {
  back: { ru: 'Назад', en: 'Back', az: 'Geri' },
  subtitle: { ru: 'Отслеживайте посылки из Польши в Азербайджан', en: 'Track your shipments from Poland to Azerbaijan', az: 'Polşadan Azərbaycana bağlamalarınızı izləyin' },
  login: { ru: 'Вход', en: 'Login', az: 'Giriş' },
  register: { ru: 'Регистрация', en: 'Register', az: 'Qeydiyyat' },
  email: { ru: 'Электронная почта', en: 'Email', az: 'E-poçt' },
  emailPlaceholder: { ru: 'your.email@example.com', en: 'your.email@example.com', az: 'your.email@example.com' },
  password: { ru: 'Пароль', en: 'Password', az: 'Şifrə' },
  passwordPlaceholder: { ru: 'Введите пароль', en: 'Enter your password', az: 'Şifrənizi daxil edin' },
  loggingIn: { ru: 'Входим...', en: 'Logging in...', az: 'Daxil olunur...' },
  firstName: { ru: 'Имя', en: 'First Name', az: 'Ad' },
  firstNamePlaceholder: { ru: 'Ваше имя', en: 'Your first name', az: 'Adınız' },
  lastName: { ru: 'Фамилия', en: 'Last Name', az: 'Soyad' },
  lastNamePlaceholder: { ru: 'Ваша фамилия', en: 'Your last name', az: 'Soyadınız' },
  finCode: { ru: 'FIN код', en: 'FIN Code', az: 'FIN kodu' },
  finCodePlaceholder: { ru: '7 символов', en: '7 characters', az: '7 simvol' },
  passwordMin: { ru: 'Минимум 6 символов', en: 'At least 6 characters', az: 'Ən azı 6 simvol' },
  registering: { ru: 'Регистрация...', en: 'Registering...', az: 'Qeydiyyat...' },
  // Errors
  invalidEmail: { ru: 'Введите корректный email', en: 'Please enter a valid email address', az: 'Düzgün e-poçt ünvanı daxil edin' },
  passwordTooShort: { ru: 'Пароль должен быть минимум 6 символов', en: 'Password must be at least 6 characters', az: 'Şifrə ən azı 6 simvol olmalıdır' },
  invalidCredentials: { ru: 'Неверный email или пароль', en: 'Invalid email or password', az: 'Yanlış e-poçt və ya şifrə' },
  tooManyRequests: { ru: 'Слишком много попыток. Попробуйте позже', en: 'Too many attempts. Please try again later', az: 'Çox sayda cəhd. Sonra yenidən cəhd edin' },
  loginFailed: { ru: 'Ошибка входа. Попробуйте снова', en: 'Login failed. Please try again', az: 'Giriş uğursuz oldu. Yenidən cəhd edin' },
  firstNameTooShort: { ru: 'Имя должно быть минимум 2 символа', en: 'First name must be at least 2 characters', az: 'Ad ən azı 2 simvol olmalıdır' },
  lastNameTooShort: { ru: 'Фамилия должна быть минимум 2 символа', en: 'Last name must be at least 2 characters', az: 'Soyad ən azı 2 simvol olmalıdır' },
  invalidFinFormat: { ru: 'Неверный формат FIN кода (требуется 7 символов)', en: 'Invalid FIN code format (7 characters required)', az: 'Yanlış FIN kod formatı (7 simvol tələb olunur)' },
  finAlreadyRegistered: { ru: 'Этот FIN код уже зарегистрирован', en: 'This FIN code is already registered', az: 'Bu FIN kodu artıq qeydiyyatdan keçib' },
  weakPassword: { ru: 'Пароль слишком слабый', en: 'Password is too weak', az: 'Şifrə çox zəifdir' },
  registrationFailed: { ru: 'Ошибка регистрации. Попробуйте снова', en: 'Registration failed. Please try again', az: 'Qeydiyyat uğursuz oldu. Yenidən cəhd edin' },
  loginSuccess: { ru: 'Успешный вход!', en: 'Login successful', az: 'Uğurlu giriş!' },
  registerSuccess: { ru: 'Регистрация успешна!', en: 'Registration successful', az: 'Qeydiyyat uğurlu oldu!' }
}

interface AuthProps {
  onLogin: (user: User) => void
  users: User[]
  onRegister: (user: User) => void
  onAdminLogin: () => void
  defaultTab?: AuthTab
  onBackClick?: () => void
}

export function Auth({ onLogin, users, onRegister, onAdminLogin, defaultTab = 'login', onBackClick }: AuthProps) {
  const { language } = useTranslation()
  const txt = authTxt
  
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerFirstName, setRegisterFirstName] = useState('')
  const [registerLastName, setRegisterLastName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerFin, setRegisterFin] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setActiveTab(defaultTab)
  }, [defaultTab])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!validateEmail(loginEmail)) {
        setError(txt.invalidEmail[language])
        setLoading(false)
        return
      }

      if (!validatePassword(loginPassword)) {
        setError(txt.passwordTooShort[language])
        setLoading(false)
        return
      }

      const firebaseUser = await authService.login(loginEmail.trim().toLowerCase(), loginPassword)
      
      const userData = await authService.getUserData(firebaseUser.uid)
      
      if (userData) {
        // Check if user is admin and redirect accordingly
        if (userData.isAdmin) {
          onLogin(userData)
          onAdminLogin()
        } else {
          onLogin(userData)
        }
        toast.success(txt.loginSuccess[language])
      } else {
        setError(txt.loginFailed[language])
      }
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        setError(txt.invalidCredentials[language])
      } else if (error.code === 'auth/too-many-requests') {
        setError(txt.tooManyRequests[language])
      } else {
        setError(txt.loginFailed[language])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!validateName(registerFirstName)) {
        setError(txt.firstNameTooShort[language])
        setLoading(false)
        return
      }

      if (!validateName(registerLastName)) {
        setError(txt.lastNameTooShort[language])
        setLoading(false)
        return
      }

      if (!validateEmail(registerEmail)) {
        setError(txt.invalidEmail[language])
        setLoading(false)
        return
      }

      if (!validateFINCode(registerFin)) {
        setError(txt.invalidFinFormat[language])
        setLoading(false)
        return
      }

      if (!validatePassword(registerPassword)) {
        setError(txt.passwordTooShort[language])
        setLoading(false)
        return
      }

      const existingUser = await authService.getUserByFinCode(registerFin)
      if (existingUser) {
        setError(txt.finAlreadyRegistered[language])
        setLoading(false)
        return
      }

      const email = registerEmail.trim().toLowerCase()
      
      const userData: Omit<User, 'id'> = {
        firstName: registerFirstName.trim(),
        lastName: registerLastName.trim(),
        email: email,
        finCode: registerFin.toUpperCase(),
        password: '',
        isAdmin: false
      }

      const userId = await authService.register(email, registerPassword, userData)

      const newUser: User = {
        id: userId,
        ...userData
      }

      onRegister(newUser)
      onLogin(newUser)
      toast.success(txt.registerSuccess[language])
    } catch (error: any) {
      console.error('Registration error:', error)
      if (error.code === 'auth/email-already-in-use') {
        setError(txt.finAlreadyRegistered[language])
      } else if (error.code === 'auth/weak-password') {
        setError(txt.weakPassword[language])
      } else {
        setError(txt.registrationFailed[language])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 w-full overflow-x-hidden">
      <Card className="w-full max-w-sm border border-gray-200 shadow-sm bg-white">
        <CardHeader className="space-y-3 pb-4">
          <div className="flex items-center justify-between">
            {onBackClick ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackClick}
                className="w-fit -ml-2 gap-1.5 text-gray-500 hover:text-gray-900 text-sm"
              >
                <ArrowLeft size={16} />
                {txt.back[language]}
              </Button>
            ) : <div />}
            <LanguageSelector />
          </div>
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
              <Package size={28} weight="bold" className="text-white" />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-xl font-semibold tracking-tight text-gray-900">NextCargo</CardTitle>
            <CardDescription className="text-xs mt-1.5 text-gray-500">
              {txt.subtitle[language]}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-5 h-9 bg-gray-100">
              <TabsTrigger value="login" className="text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600">{txt.login[language]}</TabsTrigger>
              <TabsTrigger value="register" className="text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600">{txt.register[language]}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm">{txt.email[language]}</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm">{txt.password[language]}</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder={txt.passwordPlaceholder[language]}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-10"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                  {loading ? txt.loggingIn[language] : txt.login[language]}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-firstname" className="text-sm text-gray-700">{txt.firstName[language]}</Label>
                  <Input
                    id="register-firstname"
                    placeholder={txt.firstNamePlaceholder[language]}
                    value={registerFirstName}
                    onChange={(e) => setRegisterFirstName(e.target.value)}
                    required
                    disabled={loading}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-lastname" className="text-sm">{txt.lastName[language]}</Label>
                  <Input
                    id="register-lastname"
                    placeholder={txt.lastNamePlaceholder[language]}
                    value={registerLastName}
                    onChange={(e) => setRegisterLastName(e.target.value)}
                    required
                    disabled={loading}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-sm">{txt.email[language]}</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder={txt.emailPlaceholder[language]}
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-fin" className="text-sm">{txt.finCode[language]}</Label>
                  <Input
                    id="register-fin"
                    placeholder={txt.finCodePlaceholder[language]}
                    value={registerFin}
                    onChange={(e) => setRegisterFin(e.target.value.toUpperCase())}
                    maxLength={7}
                    required
                    disabled={loading}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-sm">{txt.password[language]}</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder={txt.passwordMin[language]}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-10"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                  {loading ? txt.registering[language] : txt.register[language]}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
