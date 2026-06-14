import { authClient } from '@/lib/auth';
import { IconLockQuestion } from '@tabler/icons-react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/unauthenticated')({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (session.data?.session) throw redirect({ to: '/' });
  },
  component: UnauthenticatedPage,
});

function UnauthenticatedPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="flex flex-col items-center gap-4 text-center">
        <IconLockQuestion className="h-12 w-12 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('Pages.Unauthenticated.title')}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {t('Pages.Unauthenticated.description')}
          </p>
        </div>
      </div>
    </div>
  );
}
