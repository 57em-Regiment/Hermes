import type { ICellRendererParams } from 'ag-grid-community'
import type { InventoryItem } from '@/types/inventory'
import { ItemActionsDialog } from '@/components/inventory/ItemActionsDialog'

export interface ActionsCellParams extends ICellRendererParams<InventoryItem> {
  stockId: string
}

export function ActionsCell({ data, stockId }: ActionsCellParams) {
  if (!data) return null

  return (
    <div className="flex items-center h-full">
      <ItemActionsDialog item={data} stockId={stockId} />
    </div>
  )
}
