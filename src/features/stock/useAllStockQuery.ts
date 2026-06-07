import { stockApi } from '@/lib/api-client';
import { HttpError } from '@/lib/http-error';
import { StockFactory } from '@/lib/tanstack/queryFactory';
import type { StockDetails } from '@57eme-regiment/renenutet-api-contract';
import { useQuery } from '@tanstack/react-query';

export function useAllStockQuery() {
  return useQuery({
    queryKey: StockFactory.all,
    queryFn: async () => {
      const res = await stockApi.getAll();
      if (res.status !== 200)
        throw new HttpError(res.status, 'Failed to all stocks');

      const allItems = new Map<string, StockDetails>();
      for (const s of res.body) {
        if (!allItems.has(s.itemId)) {
          allItems.set(s.itemId, s);
        } else {
          const existing = allItems.get(s.itemId)!;
          allItems.set(s.itemId, {
            ...existing,
            quantity: existing.quantity + s.quantity,
          });
        }
      }

      return Array.from(allItems.values());
    },
  });
}
