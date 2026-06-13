import { Progress } from '@57eme-regiment/nabu-ui';
import type { StockDetails } from '@57eme-regiment/renenutet-api-contract';
import type { ICellRendererParams } from 'ag-grid-community';

export function DemandCell({ data }: ICellRendererParams<StockDetails>) {
  if (!data) return null;

  const productionRequest = data?.productionRequest?.find(
    pr => pr.inventoryId == data.inventoryId,
  );

  if (!data || !productionRequest) return null;

  const quantityNeeded = Math.max(
    data.minimumQuantity ?? 0,
    productionRequest.quantity ?? 0,
  );

  const pct = (data.quantity / quantityNeeded) * 100;

  if (pct >= 100) return null;
  return (
    <div className="flex flex-col justify-center h-full w-full gap-1.5 py-2">
      <div className="flex justify-between text-xs">
        <span className="tabular-nums">{quantityNeeded.toLocaleString()}</span>
        <span className="text-muted-foreground">{pct.toFixed(0)}%</span>
      </div>
      <Progress max={quantityNeeded} value={data.quantity} className="h-1.5" />
    </div>
  );
}
