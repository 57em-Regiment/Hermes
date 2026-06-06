import { DecrementItemStock } from '@/components/stock/DecrementItemStock';
import { IncrementItemStock } from '@/components/stock/IncrementItemStock';
import type { StockDetails } from '@57eme-regiment/renenutet-api-contract';
import type { ICellRendererParams } from 'ag-grid-community';

export function ActionsCell({ data }: ICellRendererParams<StockDetails>) {
  if (!data) return null;

  return (
    <div className="flex items-center justify-end gap-2 h-full">
      <IncrementItemStock item={data} />
      <DecrementItemStock item={data} />
    </div>
  );
}
