import type { ICellRendererParams } from 'ag-grid-community'
import { Progress } from '@/components/ui/progress'
import type { InventoryItem } from '@/types/inventory'

export function StockCell({ data }: ICellRendererParams<InventoryItem>) {
  if (!data) return null
  const pct = (data.quantity / data.maxCapacity) * 100

  return (
    <div className="flex flex-col justify-center h-full w-full gap-1.5 py-2">
      <div className="flex justify-between text-xs">
        <span className="tabular-nums">
          {data.quantity.toLocaleString()} / {data.maxCapacity.toLocaleString()}
        </span>
        <span className="text-muted-foreground">{pct.toFixed(0)}%</span>
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  )
}
