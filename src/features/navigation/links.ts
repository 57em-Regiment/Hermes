import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import type {
  GenericLinkSchema,
  NavigationLink,
} from '@57eme-regiment/nabu-frontend-utils';
import { IconArrowUpRightCircle, IconHome } from '@tabler/icons-react';

const link = (
  to: NavigationLink['to'],
  label: string,
  options?: Partial<Omit<NavigationLink, 'to' | 'label'>>,
): NavigationLink => ({ to, label, ...options });

export const LINKS = {
  index: link('/', 'Links.index', {
    Icon: IconHome,
    permission: PERMISSIONS.STOCK_ITEM_READ, //ADMIN_FOXWATCHER_ACCESS
  }),
  forbidden: link('/forbidden', 'Forbidden', {
    hidden: true,
  }),
  unauthenticated: link('/unauthenticated', 'Unauthenticated', {
    hidden: true,
  }),

  Inventory: {
    detail: link('/inventory/$id', 'Links.Inventory.detail', {
      permission: PERMISSIONS.STOCK_INVENTORY_READ,
    }),
  },
  ProductionRequest: {
    index: link('/productionRequests', 'Links.ProductionRequest.index', {
      Icon: IconArrowUpRightCircle,
      permission: PERMISSIONS.STOCK_INVENTORY_READ, //TODO STOCK_PRODUCTIONREQUEST_READ
    }),
  },
} satisfies GenericLinkSchema;
