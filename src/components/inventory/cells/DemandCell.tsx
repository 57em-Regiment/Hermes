import type { ICellRendererParams } from 'ag-grid-community'
import { Progress } from '@/components/ui/progress'
import type { InventoryItem } from '@/types/inventory'

export function DemandCell({ data }: ICellRendererParams<InventoryItem>) {
  if (!data) return null
  const pct = data.demand > 0 ? Math.min(100, (data.quantity / data.demand) * 100) : 100

  return (
    <div className="flex flex-col justify-center h-full w-full gap-1.5 py-2">
      <div className="flex justify-between text-xs">
        <span className="tabular-nums">{data.demand.toLocaleString()}</span>
        <span className={pct >= 100 ? 'text-green-500' : 'text-amber-500'}>
          {pct.toFixed(0)}%
        </span>
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  )
}
