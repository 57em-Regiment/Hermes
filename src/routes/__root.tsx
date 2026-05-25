import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageProvider, useLanguage } from '@/components/language-provider'
import { LanguageToggle } from '@/components/language-toggle'

function RootComponent() {
  const { t } = useLanguage()

  return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between px-8">
            <div className="flex gap-6 items-center">
              <Link to="/" className="font-bold text-lg tracking-tight">{t('nav.title')}</Link>
            </div>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-8 py-6">
          <Outlet />
        </main>
        {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
      </div>
  )
}

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="dark" storageKey="hermes-theme">
      <LanguageProvider>
        <RootComponent />
      </LanguageProvider>
    </ThemeProvider>
  ),
})