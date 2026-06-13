import { prApi } from '@/lib/api-client';
import { HttpError } from '@/lib/http-error';
import { ProductionRequestFactory } from '@/lib/tanstack/queryFactory';
import { type ProductionRequestDetail } from '@57eme-regiment/renenutet-api-contract';

import { useQuery } from '@tanstack/react-query';

export function useGetProductionRequestsQuery() {
  return useQuery<ProductionRequestDetail[]>({
    queryKey: ProductionRequestFactory.all,
    queryFn: async () => {
      const res = await prApi.getAll({});
      if (res.status !== 200)
        throw new HttpError(res.status, 'Failed to fetch inventories');
      return res.body.map(pr => ({
        ...pr,
        stocks: !pr.inventoryId
          ? pr.stocks
          : pr.stocks?.filter(s => s.inventoryId == pr.inventoryId),
      }));
    },
  });
}
