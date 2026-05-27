import { useEffect } from 'react'
import { useInventoriesQuery } from '@/hooks/useInventoriesQuery'
import { useAllStocksQuery } from '@/hooks/useAllStocksQuery'
import { useInventoryStore } from '@/store/inventory'
import type { Inventory } from '@57eme-regiment/renenutet-api-contract'
import type { StockSchema } from '@57eme-regiment/renenutet-api-contract/dist/schemas/stock.schema'
import type { Stock } from '@/types/inventory'

const ITEM_ICONS = [
  'IconBox',
  'IconServer',
  'IconCpu',
  'IconDroplet',
  'IconBolt',
  'IconFlask',
  'IconMountain',
  'IconStar',
]

function hashUUID(uuid: string): number {
  let h = 0
  for (let i = 0; i < uuid.length; i++) {
    h = ((h * 31) + uuid.charCodeAt(i)) >>> 0
  }
  return h
}

function buildStocks(inventories: Inventory[], apiStocks: StockSchema[]): Stock[] {
  return inventories.map((inv) => ({
    id: inv.id,
    name: inv.name,
    city: inv.locationId,
    type: 'Depot' as const,
    items: apiStocks
      .filter((s) => s.inventoryId === inv.id)
      .map((s) => ({
        id: s.itemId,
        name: `#${s.itemId.slice(0, 8)}`,
        icon: ITEM_ICONS[hashUUID(s.itemId) % ITEM_ICONS.length],
        quantity: s.quantity,
        maxCapacity: 10000,
        demand: 0,
        productionNeed: 0,
      })),
  }))
}

export function DataLoader() {
  const { data: inventories, isError: invError } = useInventoriesQuery()
  const { data: apiStocks, isError: stocksError } = useAllStocksQuery()
  const setStocks = useInventoryStore((state) => state.setStocks)
  const setError = useInventoryStore((state) => state.setError)

  useEffect(() => {
    if (invError || stocksError) {
      setError('Erreur de connexion au serveur API')
      return
    }
    if (inventories && apiStocks) {
      setStocks(buildStocks(inventories, apiStocks))
    }
  }, [inventories, apiStocks, invError, stocksError, setStocks, setError])

  return null
}
