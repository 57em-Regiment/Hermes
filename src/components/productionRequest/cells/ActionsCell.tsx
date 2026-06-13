import type { ProductionRequestDetail } from '@57eme-regiment/renenutet-api-contract';
import type { ICellRendererParams } from 'ag-grid-community';
import { DeleteProductionRequest } from '../DeleteProductionRequest';

export function ActionsCell({
  data,
}: ICellRendererParams<ProductionRequestDetail>) {
  if (!data) return null;

  return (
    <div className="flex items-center justify-end gap-2 h-full">
      <DeleteProductionRequest id={data.id} />
    </div>
  );
}
