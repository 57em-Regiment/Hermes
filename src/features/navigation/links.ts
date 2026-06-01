import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import { IconForklift } from '@tabler/icons-react';
import type { GenericLinkSchema, NavigationLink } from './navigation.model';

const link = (
  to: NavigationLink['to'],
  label: string,
  options?: Partial<Omit<NavigationLink, 'to' | 'label'>>,
): NavigationLink => ({ to, label, ...options });

export const LINKS = {
  index: link('/', 'Home', {
    permission: PERMISSIONS.STOCK_ITEM_READ, //ADMIN_FOXWATCHER_ACCESS
  }),
  forbidden: link('/forbidden', 'Forbidden', {
    hidden: true,
  }),
  unauthenticated: link('/unauthenticated', 'Unauthenticated', {
    hidden: true,
  }),

  Inventory: {
    detail: link('/inventory/$id', "Detail de l'inventaire", {
      Icon: IconForklift,
      permission: PERMISSIONS.STOCK_INVENTORY_READ,
    }),
  },
} satisfies GenericLinkSchema;
