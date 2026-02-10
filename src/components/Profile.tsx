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
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <h2 className="text-xs font-medium text-muted-foreground">Profile</h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base font-semibold truncate">{user.firstName} {user.lastName}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Customer</p>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-3 space-y-2">
          <div className="flex items-center gap-2.5 p-2.5 bg-muted/30 rounded-lg">
            <UserIcon size={16} className="text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground">Full Name</p>
              <p className="font-medium text-sm truncate">{user.firstName} {user.lastName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 bg-muted/30 rounded-lg">
            <Envelope size={16} className="text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground">Email</p>
              <p className="font-medium text-sm truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 bg-muted/30 rounded-lg">
            <Barcode size={16} className="text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground">FIN Code</p>
              <p className="font-mono font-semibold text-primary text-sm">{user.finCode}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardContent className="pt-3 pb-3">
          <Button
            variant="destructive"
            className="w-full h-9 text-sm"
            onClick={onLogout}
          >
            <SignOut size={16} className="mr-1.5" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
