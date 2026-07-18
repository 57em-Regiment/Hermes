import { InventoryBreadcrumbLabel } from '@/components/layout/breadcrumb/InventoryBreadcrumbLabel';
import { LINKS } from '@/features/navigation/links';
import { accessClient } from '@/lib/access';
import { authClient } from '@/lib/auth';
import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/inventory/$id')({
  staticData: {
    link: LINKS.Inventory.detail,
    BreadcrumbLabel: InventoryBreadcrumbLabel,
  },
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session) throw redirect({ to: '/unauthenticated' });

    const access = await accessClient.getMyAccess();
    if (!accessClient.hasPermission(access, PERMISSIONS.RENENUTET_INVENTORIES_READ)) {
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
