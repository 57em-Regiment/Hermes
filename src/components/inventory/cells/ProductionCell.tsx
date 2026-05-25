import type { ICellRendererParams } from 'ag-grid-community'
import type { InventoryItem } from '@/types/inventory'

export function ProductionCell({ data }: ICellRendererParams<InventoryItem>) {
  if (!data) return null

  return (
    <div className="flex items-center h-full">
      <span className="font-semibold tabular-nums">
        {data.productionNeed > 0 ? `+${data.productionNeed.toLocaleString()}` : '—'}
      </span>
    </div>
  )
}
