import { useInventoriesListQuery } from '@/features/inventory/useInventoriesList.query';
import { InventoryCard } from './InventoryCard';

export const InventoryMenu = () => {
  const { data: inventories, error, isPending } = useInventoriesListQuery();

  if (error)
    return (
      <div className="text-sm p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
        {error.message}
      </div>
    );

  if (isPending)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );

  if (!inventories.length)
    return (
      <div className="text-sm p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
        No existing inventory
      </div>
    );

  return (
    <div className="flex gap-6">
      {(inventories ?? []).map(({ id: inventoryId }) => (
        <InventoryCard key={inventoryId} inventoryId={inventoryId} />
      ))}
    </div>
  );
};
