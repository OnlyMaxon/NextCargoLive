import { User } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { User as UserIcon, SignOut, Barcode, Envelope, Star } from '@phosphor-icons/react'

interface ProfileProps {
  user: User
  onLogout: () => void
}

export function Profile({ user, onLogout }: ProfileProps) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-muted-foreground">Profile</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-border via-transparent to-transparent" />
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-xl shadow-primary/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <CardHeader className="relative pb-4">
          <div className="flex items-center gap-4 sm:gap-5">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 ring-4 ring-white shadow-xl">
              <AvatarFallback className="gradient-bg text-white text-2xl sm:text-3xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-xl sm:text-2xl font-bold truncate">{user.firstName} {user.lastName}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                  <Star size={14} weight="fill" />
                  Premium Customer
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <Separator className="bg-primary/10" />
        <CardContent className="relative pt-5 sm:pt-6 space-y-4 sm:space-y-5">
          <div className="grid gap-4">
            <div className="flex items-center gap-4 p-3 bg-white/60 backdrop-blur rounded-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <UserIcon size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="font-semibold text-sm sm:text-base">{user.firstName} {user.lastName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-white/60 backdrop-blur rounded-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Envelope size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-semibold text-sm sm:text-base truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-white/60 backdrop-blur rounded-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Barcode size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">FIN Code</p>
                <p className="font-mono font-bold text-base sm:text-lg text-primary">{user.finCode}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur border-white/50 shadow-lg overflow-hidden">
        <CardContent className="pt-5 sm:pt-6">
          <Button
            variant="destructive"
            className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-0.5"
            onClick={onLogout}
          >
            <SignOut size={20} weight="bold" className="mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
