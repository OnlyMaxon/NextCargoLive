import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { validateFINCode, validatePassword, validateName } from '@/lib/validation'
import { ADMIN_CREDENTIALS } from '@/lib/constants'
import { User } from '@/lib/types'
import { Package } from '@phosphor-icons/react'

interface AuthProps {
  onLogin: (user: User) => void
  users: User[]
  onRegister: (user: User) => void
  onAdminLogin: () => void
}

export function Auth({ onLogin, users, onRegister, onAdminLogin }: AuthProps) {
  const [loginFin, setLoginFin] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerFirstName, setRegisterFirstName] = useState('')
  const [registerLastName, setRegisterLastName] = useState('')
  const [registerFin, setRegisterFin] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('login')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (loginFin === ADMIN_CREDENTIALS.username && loginPassword === ADMIN_CREDENTIALS.password) {
      onAdminLogin()
      return
    }

    if (!validateFINCode(loginFin)) {
      setError('Invalid FIN code format (7 characters required)')
      return
    }

    if (!validatePassword(loginPassword)) {
      setError('Password must be at least 6 characters')
      return
    }

    const user = users.find(u => u.finCode.toUpperCase() === loginFin.toUpperCase() && u.password === loginPassword)
    
    if (!user) {
      setError('Invalid FIN code or password')
      return
    }

    onLogin(user)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateName(registerFirstName)) {
      setError('First name must be at least 2 characters')
      return
    }

    if (!validateName(registerLastName)) {
      setError('Last name must be at least 2 characters')
      return
    }

    if (!validateFINCode(registerFin)) {
      setError('Invalid FIN code format (7 characters required)')
      return
    }

    if (!validatePassword(registerPassword)) {
      setError('Password must be at least 6 characters')
      return
    }

    const existingUser = users.find(u => u.finCode.toUpperCase() === registerFin.toUpperCase())
    if (existingUser) {
      setError('This FIN code is already registered')
      return
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      firstName: registerFirstName.trim(),
      lastName: registerLastName.trim(),
      finCode: registerFin.toUpperCase(),
      password: registerPassword,
      isAdmin: false
    }

    onRegister(newUser)
    onLogin(newUser)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-5">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <Package size={40} weight="bold" className="text-primary-foreground" />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">NextCargo</CardTitle>
            <CardDescription className="text-base mt-3 leading-relaxed">
              Track your shipments from Poland to Azerbaijan
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6 h-11">
              <TabsTrigger value="login" className="text-base">Login</TabsTrigger>
              <TabsTrigger value="register" className="text-base">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2.5">
                  <Label htmlFor="login-fin" className="text-base">FIN Code / Username</Label>
                  <Input
                    id="login-fin"
                    placeholder="Enter FIN code or admin username"
                    value={loginFin}
                    onChange={(e) => setLoginFin(e.target.value)}
                    required
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
                    className="h-12 text-base"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-base">{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full h-12 text-base">
                  Login
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
                    className="h-12 text-base"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-base">{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full h-12 text-base">
                  Register
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
