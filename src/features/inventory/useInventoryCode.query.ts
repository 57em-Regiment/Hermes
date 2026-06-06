import { inventoryApi } from '@/lib/api-client';
import { HttpError } from '@/lib/http-error';
import { InventoryFactory } from '@/lib/tanstack/queryFactory';
import { useQuery } from '@tanstack/react-query';

export function useInventoryCodeQuery(inventoryId: string) {
  return useQuery({
    queryKey: InventoryFactory.CodeInventory(inventoryId),
    queryFn: async () => {
      const res = await inventoryApi.inventory.getInventoryCode({
        params: { id: inventoryId },
      });
      if (res.status !== 200)
        throw new HttpError(res.status, 'Failed to fetch inventories');
      return res.body;
    },
    enabled: false,
  });
}
