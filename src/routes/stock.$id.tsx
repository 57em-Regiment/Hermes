import { accessClient } from '@/lib/access';
import { authClient } from '@/lib/auth';
import { useInventoryStore } from '@/store/inventory';
import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import { createFileRoute, notFound, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/stock/$id')({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session) throw redirect({ to: '/unauthenticated' });

    const access = await accessClient.getMyAccess();
    if (!accessClient.hasPermission(access, PERMISSIONS.STOCK_INVENTORY_READ)) {
      throw redirect({ to: '/forbidden' });
    }
    return { access };
  },
  loader: async ({ params }) => {
    if (!useInventoryStore.getState().isLoaded) {
      await new Promise<void>(resolve => {
        const unsub = useInventoryStore.subscribe(s => {
          if (s.isLoaded) {
            unsub();
            resolve();
          }
        });
      });
    }

    const stock = useInventoryStore
      .getState()
      .stocks.find(s => s.id === params.id);

    if (!stock) throw notFound();
  },

  pendingComponent: () => (
    <div
      className="flex flex-col space-y-4"
      style={{ height: 'calc(100vh - 130px)' }}>
      <div className="h-10 w-64 rounded bg-muted animate-pulse shrink-0" />
      <div className="h-6 w-48 rounded bg-muted animate-pulse shrink-0" />
      <div className="flex-1 rounded-lg bg-muted animate-pulse" />
    </div>
  ),
});
