import { inventoryApi } from '@/lib/api-client';
import { HttpError } from '@/lib/http-error';
import { InventoryFactory } from '@/lib/tanstack/queryFactory';
import { type InventoryDetails } from '@57eme-regiment/renenutet-api-contract';

import { useQuery } from '@tanstack/react-query';

export function useInventoryDetailsQuery(inventoryId: string) {
  return useQuery<InventoryDetails>({
    queryKey: InventoryFactory.ById(inventoryId),
    queryFn: async () => {
      const res = await inventoryApi.inventory.getInventoryDetails({
        params: { id: inventoryId },
      });
      if (res.status !== 200)
        throw new HttpError(res.status, 'Failed to fetch inventories');
      return {
        ...res.body,
        stocks: res.body.stocks.map(s => ({
          ...s,
          productionRequest: s.productionRequest?.filter(
            pr => pr.inventoryId == res.body.id,
          ),
        })),
      };
    },
  });
}
