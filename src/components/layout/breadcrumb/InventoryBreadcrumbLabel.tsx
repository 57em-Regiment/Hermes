import { useInventoryDetailsQuery } from '@/features/inventory/useInventoryDetails.query';
import { IconShip } from '@tabler/icons-react';

type Props = { params: Record<string, string> };

export function InventoryBreadcrumbLabel({ params }: Props) {
  const { data: inventory } = useInventoryDetailsQuery(params.id);
  return (
    <div className="flex gap-2">
      {inventory?.location.icon ? (
        <img src={inventory.location.icon} className="size-6 object-cover" />
      ) : (
        <IconShip className="size-4 shrink-0 text-muted-foreground" />
      )}
      {inventory?.name ?? params.id}
    </div>
  );
}
