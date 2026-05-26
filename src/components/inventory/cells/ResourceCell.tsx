import type { ICellRendererParams } from 'ag-grid-community'
import * as Icons from '@tabler/icons-react'
import type { InventoryItem } from '@/types/inventory'

export function ResourceCell({ data }: ICellRendererParams<InventoryItem>) {
  if (!data) return null
  const Icon = (Icons as unknown as Record<string, React.ElementType>)[data.icon]

  return (
    <div className="flex items-center gap-2 h-full">
      <div className="p-1.5 border rounded-md bg-muted/50 shrink-0">
        {Icon && <Icon className="h-4 w-4" />}
      </div>
      <span className="font-medium truncate">{data.name}</span>
    </div>
  )
}
