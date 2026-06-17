import { Breadcrumb, LanguageToggle, ThemeToggle } from '@57eme-regiment/nabu-ui';
import { AuthButton } from '../auth/authButton';
import { useTranslation } from 'react-i18next';

export function Header() {
  const { i18n, t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <Breadcrumb translate={t} />
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle
            language={i18n.language}
            onToggle={lang => i18n.changeLanguage(lang)}
          />
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
