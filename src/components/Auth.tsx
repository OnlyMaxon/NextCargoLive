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

interface AuthProps {
  onLogin: (user: User) => void
  users: User[]
  onRegister: (user: User) => void
  onAdminLogin: () => void
  defaultTab?: AuthTab
  onBackClick?: () => void
}

export function Auth({ onLogin, users, onRegister, onAdminLogin, defaultTab = 'login', onBackClick }: AuthProps) {
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
        setError('Please enter a valid email address')
        setLoading(false)
        return
      }

      if (!validatePassword(loginPassword)) {
        setError('Password must be at least 6 characters')
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
        toast.success('Login successful')
      } else {
        setError('User data not found')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        setError('Invalid email or password')
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later')
      } else {
        setError('Login failed. Please try again')
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
        setError('First name must be at least 2 characters')
        setLoading(false)
        return
      }

      if (!validateName(registerLastName)) {
        setError('Last name must be at least 2 characters')
        setLoading(false)
        return
      }

      if (!validateEmail(registerEmail)) {
        setError('Please enter a valid email address')
        setLoading(false)
        return
      }

      if (!validateFINCode(registerFin)) {
        setError('Invalid FIN code format (7 characters required)')
        setLoading(false)
        return
      }

      if (!validatePassword(registerPassword)) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      const existingUser = await authService.getUserByFinCode(registerFin)
      if (existingUser) {
        setError('This FIN code is already registered')
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
      toast.success('Registration successful')
    } catch (error: any) {
      console.error('Registration error:', error)
      if (error.code === 'auth/email-already-in-use') {
        setError('This FIN code is already registered')
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak')
      } else {
        setError('Registration failed. Please try again')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-5">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>
      
      <Card className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border-white/50 shadow-2xl shadow-primary/10">
        <CardHeader className="space-y-4 pb-4">
          {onBackClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="w-fit -ml-2 gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Button>
          )}
          <div className="flex justify-center">
            <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 pulse-glow">
              <Package size={40} weight="bold" className="text-white" />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-3xl font-bold tracking-tight gradient-text">NextCargo</CardTitle>
            <CardDescription className="text-base mt-3 leading-relaxed">
              Track your shipments from Poland to Azerbaijan
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-muted/50 p-1">
              <TabsTrigger value="login" className="text-base data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">Login</TabsTrigger>
              <TabsTrigger value="register" className="text-base data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2.5">
                  <Label htmlFor="login-email" className="text-base">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="login-password" className="text-base">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 text-base"
                  />
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertDescription className="text-base">{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full h-12 text-base gradient-bg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2.5">
                  <Label htmlFor="register-firstname" className="text-base">First Name</Label>
                  <Input
                    id="register-firstname"
                    placeholder="Your first name"
                    value={registerFirstName}
                    onChange={(e) => setRegisterFirstName(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="register-lastname" className="text-base">Last Name</Label>
                  <Input
                    id="register-lastname"
                    placeholder="Your last name"
                    value={registerLastName}
                    onChange={(e) => setRegisterLastName(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="register-email" className="text-base">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="register-fin" className="text-base">FIN Code</Label>
                  <Input
                    id="register-fin"
                    placeholder="7 characters"
                    value={registerFin}
                    onChange={(e) => setRegisterFin(e.target.value.toUpperCase())}
                    maxLength={7}
                    required
                    disabled={loading}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="register-password" className="text-base">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 text-base"
                  />
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertDescription className="text-base">{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full h-12 text-base gradient-bg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
