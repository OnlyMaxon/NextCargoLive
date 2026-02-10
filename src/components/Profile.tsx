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
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <h2 className="text-sm font-medium text-muted-foreground">Profile</h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border">
              <AvatarFallback className="bg-primary text-white text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-semibold truncate">{user.firstName} {user.lastName}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Customer</p>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <UserIcon size={18} className="text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Envelope size={18} className="text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium text-sm truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Barcode size={18} className="text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">FIN Code</p>
              <p className="font-mono font-semibold text-primary">{user.finCode}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardContent className="pt-4">
          <Button
            variant="destructive"
            className="w-full h-10"
            onClick={onLogout}
          >
            <SignOut size={18} className="mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
