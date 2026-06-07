import { Progress } from '@57eme-regiment/nabu-ui';
import type { StockDetails } from '@57eme-regiment/renenutet-api-contract';
import type { ICellRendererParams } from 'ag-grid-community';

type StockCellProps = {
  disableCapacity?: boolean;
} & ICellRendererParams<StockDetails>;

export function StockCell({ data, disableCapacity }: StockCellProps) {
  if (!data) return null;
  const DEFAULT_MAX_CAP = 100;
  const caseMaxQuantity = data.item?.maxQuantity || DEFAULT_MAX_CAP;

  return (
    <div className="flex flex-col justify-center h-full w-full gap-1.5 py-2">
      <div className="flex justify-between text-xs">
        {disableCapacity ? (
          <span className="tabular-nums">{data.quantity.toLocaleString()}</span>
        ) : (
          <>
            <span className="tabular-nums">
              {data.quantity.toLocaleString()} /{' '}
              {caseMaxQuantity.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              {data.quantity.toFixed(0)}%
            </span>
          </>
        )}
      </div>
      <Progress value={data.quantity} max={caseMaxQuantity} className="h-1.5" />
    </div>
  );
}
