import { authClient } from '@/lib/auth';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data?.session) throw redirect({ to: '/unauthenticated' });
  },
});
