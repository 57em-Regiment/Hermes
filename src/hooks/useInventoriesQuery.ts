import { useQuery } from '@tanstack/react-query'
import { inventoryApi } from '@/lib/api-client'

export function useInventoriesQuery() {
  return useQuery({
    queryKey: ['inventories'],
    queryFn: async () => {
      const res = await inventoryApi.inventory.getAll()
      if (res.status !== 200) throw new Error('Failed to fetch inventories')
      return res.body
    },
  })
}
