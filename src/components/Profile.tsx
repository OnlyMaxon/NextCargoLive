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
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Profile</h2>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{user.firstName} {user.lastName}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Customer Account</p>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-start gap-3">
            <UserIcon size={20} className="text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">First Name</p>
              <p className="font-medium">{user.firstName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <UserIcon size={20} className="text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Last Name</p>
              <p className="font-medium">{user.lastName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Barcode size={20} className="text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">FIN Code</p>
              <p className="font-mono font-semibold text-lg">{user.finCode}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Button
            variant="destructive"
            className="w-full"
            onClick={onLogout}
          >
            <SignOut size={20} weight="bold" className="mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
