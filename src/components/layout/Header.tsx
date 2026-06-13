import { LanguageToggle, ThemeToggle } from '@57eme-regiment/nabu-ui';
import { AuthButton } from '../auth/authButton';
import { Breadcrumb } from './breadcrumb/Breadcrumb';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <Breadcrumb />
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
