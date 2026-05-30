import { HttpError } from '@/lib/http-error'
import { inventoryApi } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'

export function useInventoriesQuery() {
  return useQuery({
    queryKey: ['inventories'],
    queryFn: async () => {
      const res = await inventoryApi.inventory.getAll()
      if (res.status !== 200) throw new HttpError(res.status, 'Failed to fetch inventories')
      return res.body
    },
  })
}
