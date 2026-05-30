import { UserDropdown } from '@/components/auth/UserDropdown'
import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { Link } from '@tanstack/react-router'
import { useLanguage } from '@/components/language-provider'
import { AuthButton } from '../auth/authButton'

export function Header() {
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-8">
        <Link to="/" className="font-bold text-lg tracking-tight">
          {t('nav.title')}
        </Link>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  )
}
