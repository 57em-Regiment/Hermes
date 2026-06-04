import { stockApi } from '@/lib/api-client';
import { HttpError } from '@/lib/http-error';
import { StockFactory } from '@/lib/tanstack/queryFactory';
import { useQuery } from '@tanstack/react-query';

export function useAllStocksQuery() {
  return useQuery({
    queryKey: StockFactory.all,
    queryFn: async () => {
      const res = await stockApi.getAll();
      if (res.status !== 200)
        throw new HttpError(res.status, 'Failed to fetch stocks');
      return res.body;
    },
  });
}
