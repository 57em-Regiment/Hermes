import type { StockDetails } from '@57eme-regiment/renenutet-api-contract';
import type { ICellRendererParams } from 'ag-grid-community';

export function ProductionCell({ data }: ICellRendererParams<StockDetails>) {
  const productionRequest = data?.productionRequest?.find(
    pr => pr.inventoryId == null,
  );

  if (!data || !productionRequest) return null;

  const productionQuantity =
    Math.max(data.minimumQuantity ?? 0, productionRequest.quantity ?? 0) -
    data.quantity;

  if (productionQuantity <= 0) return null;
  return (
    <div className="flex h-full justify-center">
      <span className="font-semibold tabular-nums">
        {productionQuantity > 0
          ? `+${productionQuantity.toLocaleString()}`
          : '—'}
      </span>
    </div>
  );
}
