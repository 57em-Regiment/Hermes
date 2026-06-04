import { LanguageProvider } from '@/components/language-provider';
import { Header } from '@/components/layout/Header';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="dark" storageKey="hermes-theme">
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-8 py-6">
            <Outlet />
          </main>
          <Toaster position="top-right" />
          {import.meta.env.DEV && (
            <>
              <ReactQueryDevtools
                initialIsOpen={false}
                position="bottom"
                buttonPosition="bottom-right"
              />
              <TanStackRouterDevtools position="bottom-left" />
            </>
          )}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  ),
});
