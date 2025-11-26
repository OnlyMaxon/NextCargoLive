import { User } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { User as UserIcon, SignOut, Barcode } from '@phosphor-icons/react'

interface ProfileProps {
  user: User
  onLogout: () => void
}

export function Profile({ user, onLogout }: ProfileProps) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Profile</h2>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl sm:text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg sm:text-xl truncate">{user.firstName} {user.lastName}</CardTitle>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">Customer Account</p>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5 sm:pt-6 space-y-4 sm:space-y-5">
          <div className="flex items-start gap-3">
            <UserIcon size={20} className="text-muted-foreground mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">First Name</p>
              <p className="font-medium text-sm sm:text-base">{user.firstName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <UserIcon size={20} className="text-muted-foreground mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Last Name</p>
              <p className="font-medium text-sm sm:text-base">{user.lastName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Barcode size={20} className="text-muted-foreground mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">FIN Code</p>
              <p className="font-mono font-semibold text-base sm:text-lg break-all">{user.finCode}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5 sm:pt-6">
          <Button
            variant="destructive"
            className="w-full h-11 sm:h-12 text-sm sm:text-base"
            onClick={onLogout}
          >
            <SignOut size={20} weight="bold" className="mr-2 sm:w-[22px] sm:h-[22px]" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
