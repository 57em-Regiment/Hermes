import { LINKS } from '@/features/navigation/links';
import { accessClient } from '@/lib/access';
import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/productionRequests/')({
  staticData: { link: LINKS.ProductionRequest.index },
  beforeLoad: async () => {
    const access = await accessClient.getMyAccess();
    if (!accessClient.hasPermission(access, LINKS.ProductionRequest.index.permission)) {
      //TODO STOCK_PRODUCTIONREQUEST_READ
      throw redirect({ to: '/forbidden' });
    }
    return { access };
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
