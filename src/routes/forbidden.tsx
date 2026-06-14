/* eslint-disable react-refresh/only-export-components */
import { IconLock } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/forbidden')({
  component: ForbiddenPage,
});

function ForbiddenPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="flex flex-col items-center gap-4 text-center">
        <IconLock className="h-12 w-12 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('Pages.Forbidden.title')}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {t('Pages.Forbidden.description')}
          </p>
        </div>
      </div>
    </div>
  );
}
