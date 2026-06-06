import { Progress } from '@57eme-regiment/nabu-ui';
import type { StockDetails } from '@57eme-regiment/renenutet-api-contract';
import type { ICellRendererParams } from 'ag-grid-community';

export function StockCell({ data }: ICellRendererParams<StockDetails>) {
  if (!data) return null;
  const DEFAULT_MAX_CAP = 100;
  const caseMaxQuantity = data.item?.maxQuantity || DEFAULT_MAX_CAP;
  const pct = (data.quantity / caseMaxQuantity) * 100;

  return (
    <div className="flex flex-col justify-center h-full w-full gap-1.5 py-2">
      <div className="flex justify-between text-xs">
        <span className="tabular-nums">
          {data.quantity.toLocaleString()} / {caseMaxQuantity.toLocaleString()}
        </span>
        <span className="text-muted-foreground">{pct.toFixed(0)}%</span>
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  );
}
