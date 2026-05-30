import { useQuery } from '@tanstack/react-query'
import { stockApi } from '@/lib/api-client'

export function useAllStocksQuery() {
  return useQuery({
    queryKey: ['stocks'],
    queryFn: async () => {
      const res = await stockApi.getAll()
      if (res.status !== 200) throw new Error('Failed to fetch stocks')
      return res.body
    },
  })
}
