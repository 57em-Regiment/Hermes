import { stockApi } from '@/lib/api-client';
import { HttpError } from '@/lib/http-error';
import { InventoryFactory } from '@/lib/tanstack/queryFactory';
import { useQuery } from '@tanstack/react-query';

export function useGetStockByInventoryId(inventoryId: string) {
  return useQuery({
    queryKey: InventoryFactory.StockInInventory(inventoryId),
    queryFn: async () => {
      const res = await stockApi.getByInventory({
        params: {
          inventoryId,
          itemId: '',
        },
      });
      if (res.status !== 200)
        throw new HttpError(res.status, 'Failed to fetch inventory stock');
      return res.body;
    },
  });
}
