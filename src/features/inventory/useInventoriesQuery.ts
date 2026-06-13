import { inventoryApi } from '@/lib/api-client';
import { HttpError } from '@/lib/http-error';
import { InventoryFactory } from '@/lib/tanstack/queryFactory';
import { useQuery } from '@tanstack/react-query';

export function useInventoriesQuery() {
  return useQuery({
    queryKey: [...InventoryFactory.all, 'full'],
    queryFn: async () => {
      const res = await inventoryApi.inventory.getAll();
      if (res.status !== 200)
        throw new HttpError(res.status, 'Failed to fetch inventories');
      return res.body;
    },
  });
}
