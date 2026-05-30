/* eslint-disable react-refresh/only-export-components */
import { authClient } from '@/lib/auth';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { IconLogin } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (session) throw redirect({ to: '/' });
  },
  component: LoginPage,
});

function LoginPage() {
  const handleLogin = () => {
    authClient.signIn.social({ provider: 'wanshitong', callbackURL: '/' });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Connexion</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Accès réservé au personnel autorisé.
          </p>
        </div>
        <Button className="w-full" onClick={handleLogin}>
          <IconLogin className="mr-2 h-4 w-4" />
          Se connecter via SSO
        </Button>
      </div>
    </div>
  );
}
