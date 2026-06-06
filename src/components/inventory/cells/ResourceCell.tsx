import { Typography } from '@57eme-regiment/nabu-ui';
import type { StockDetails } from '@57eme-regiment/renenutet-api-contract';
import { IconPackage } from '@tabler/icons-react';
import type { ICellRendererParams } from 'ag-grid-community';

export function ResourceCell({ data }: ICellRendererParams<StockDetails>) {
  if (!data) return null;

  return (
    <div className="flex items-center gap-2 h-full">
      <IconPackage />
      <Typography>
        {data.item.name} {data.item.shortName && data.item.shortName}
      </Typography>
      {data.item.shortName && (
        <Typography variant="muted">({data.item.shortName})</Typography>
      )}
    </div>
  );
}
