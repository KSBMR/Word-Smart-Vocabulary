import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useSearchStore } from '@/store/searchStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu, Sun, Moon, Search } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Header() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const { query, setQuery } = useSearchStore()
  const [localQuery, setLocalQuery] = useState(query)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value)
    setQuery(e.target.value)
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold tracking-tight">Word Smart</h1>
        </div>

        <div className="hidden md:flex md:flex-1 md:max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search words..."
              className="pl-8"
              value={localQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarFallback>WS</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}