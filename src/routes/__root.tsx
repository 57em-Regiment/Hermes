import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/components/language-provider'
import { Header } from '@/components/layout/Header'

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="dark" storageKey="hermes-theme">
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-8 py-6">
            <Outlet />
          </main>
          {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  ),
})
