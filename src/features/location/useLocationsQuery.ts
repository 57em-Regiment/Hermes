import { krangLocationApi, locationApi } from '@/lib/api-client';
import { HttpError } from '@/lib/http-error';
import { LocationFactory } from '@/lib/tanstack/queryFactory';
import type { LocationNames } from '@57eme-regiment/krang-api-contract';
import { useQuery } from '@tanstack/react-query';

export function useLocationsQuery(search?: string) {
  const trimmed = search?.trim() ?? '';
  const enabled = trimmed.length >= 2;

  return useQuery({
    queryKey: LocationFactory.Search(trimmed),
    queryFn: async () => {
      const res = await locationApi.search({
        query: { search: trimmed, limit: 25 },
      });
      if (res.status !== 200)
        throw new HttpError(res.status, 'Failed to fetch locations');
      return res.body;
    },
    enabled,
    staleTime: 30 * 1000,
  });
}

export function useLocationByIdQuery(id?: string) {
  return useQuery<LocationNames>({
    queryKey: LocationFactory.ById(id ?? 'NoId'),
    queryFn: async () => {
      const res = await krangLocationApi.getNames({ params: { id: id! } });
      if (res.status !== 200)
        throw new HttpError(res.status, 'Failed to fetch location');
      return res.body;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
