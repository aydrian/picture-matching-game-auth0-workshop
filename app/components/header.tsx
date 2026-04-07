import Link from 'next/link'
import { Settings, Brain, LogIn, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { auth0 } from '@/lib/auth0'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export async function Header() {
  const session = await auth0.getSession()
  const user = session?.user

  return (
    <header className="flex items-center justify-between border-b border-border bg-background p-4 md:p-6">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Brain className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold">MemoryMatch</span>
      </Link>
      
      <div className="flex items-center gap-2">
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name || 'User'} 
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/auth/logout" className="flex w-full cursor-pointer items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Log out
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <a href="/auth/login">
            <Button variant="outline" size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              Log in
            </Button>
          </a>
        )}
      </div>
    </header>
  )
}
