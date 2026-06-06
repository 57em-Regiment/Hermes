import { krangItemApi } from '@/lib/api-client';
import { HttpError } from '@/lib/http-error';
import { ItemFactory } from '@/lib/tanstack/queryFactory';
import { useQuery } from '@tanstack/react-query';

export function useItemsQuery(search?: string) {
  const trimmed = search?.trim() ?? '';
  const enabled = trimmed.length >= 2;

  return useQuery({
    queryKey: [...ItemFactory.all, trimmed],
    queryFn: async () => {
      const res = await krangItemApi.getAll({
        query: { search: trimmed, limit: 25 },
      });
      if (res.status !== 200)
        throw new HttpError(res.status, 'Failed to fetch items');
      return res.body;
    },
    enabled,
    staleTime: 30 * 1000,
  });
}
