import { Progress } from '@57eme-regiment/nabu-ui';
import type { ProductionRequestDetail } from '@57eme-regiment/renenutet-api-contract';
import type { ICellRendererParams } from 'ag-grid-community';

type StockCellProps = {
  disableCapacity?: boolean;
} & ICellRendererParams<ProductionRequestDetail>;

export function StockCell({ data, disableCapacity }: StockCellProps) {
  if (!data) return null;
  const DEFAULT_MAX_CAP = 100;
  const maxQuantity =
    (data.item?.maxQuantity ?? DEFAULT_MAX_CAP) *
    (data.stocks?.length ? data.stocks?.length : 0);

  const quantityInAllStocks =
    data.stocks?.reduce((acc, s) => acc + s.quantity, 0) ?? 0;
  const pct = (quantityInAllStocks / (maxQuantity ? maxQuantity : 1)) * 100;

  return (
    <div className="flex flex-col justify-center h-full w-full gap-1.5 py-2">
      <div className="flex justify-between text-xs">
        {disableCapacity ? (
          <span className="tabular-nums">
            {quantityInAllStocks.toLocaleString()}
          </span>
        ) : (
          <>
            <span className="tabular-nums">
              {quantityInAllStocks.toLocaleString()} /{' '}
              {maxQuantity.toLocaleString()}
            </span>
            <span className="text-muted-foreground">{pct.toFixed(0)}%</span>
          </>
        )}
      </div>
      <Progress
        value={quantityInAllStocks}
        max={maxQuantity}
        className="h-1.5"
      />
    </div>
  );
}
