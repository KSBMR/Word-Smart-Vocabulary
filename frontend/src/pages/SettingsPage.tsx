import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">Current: {theme}</p>
          <div className="flex gap-2">
            <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>
              Light
            </Button>
            <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>
              Dark
            </Button>
            <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')}>
              System
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}