import { defautGridOption } from '@57eme-regiment/nabu-frontend-utils';
import { useTheme, type FilterHeaderParams } from '@57eme-regiment/nabu-ui';
import type { StockDetails } from '@57eme-regiment/renenutet-api-contract';
import { useParams } from '@tanstack/react-router';
import {
  colorSchemeDark,
  colorSchemeLight,
  themeQuartz,
  type ColDef,
  type GridOptions,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionsCell } from '../inventory/cells/ActionsCell';
import { DemandCell } from '../inventory/cells/DemandCell';
import { ProductionCell } from '../inventory/cells/ProductionCell';
import { ResourceCell } from '../inventory/cells/ResourceCell';
import { StockCell } from '../inventory/cells/StockCell';
import { AddNewStockDialog } from './addNewStock';

type StockGridProps = {
  stocks: StockDetails[];
};

export const StockGrid = ({ stocks }: StockGridProps) => {
  const { id: inventoryId } = useParams({
    from: '/_authenticated/inventory/$id',
  });
  const gridRef = useRef<AgGridReact<StockDetails>>(null);

  const { t } = useTranslation();
  const { theme } = useTheme();

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const agTheme = useMemo(
    () =>
      isDark
        ? themeQuartz.withPart(colorSchemeDark).withParams({
            backgroundColor: 'transparent',
            headerBackgroundColor: 'transparent',
          })
        : themeQuartz.withPart(colorSchemeLight).withParams({
            backgroundColor: 'transparent',
            headerBackgroundColor: 'transparent',
          }),
    [isDark],
  );

  const columnDefs = useMemo<ColDef<StockDetails>[]>(
    () => [
      {
        headerName: t('Global.Aggrid.resource'),
        cellRenderer: ResourceCell,
        flex: 2,
        minWidth: 220,
        filterValueGetter: ({ data }) => data?.item.name,
        valueGetter: ({ data }) => data?.item.name,
      },
      {
        headerName: t('Global.Aggrid.stock'),
        cellRenderer: StockCell,
        flex: 2,
        minWidth: 230,
        valueGetter: ({ data }) => data?.quantity,
        filter: false,
        sort: 'desc',
      },
      {
        headerName: t('Global.Aggrid.production'),
        cellRenderer: ProductionCell,
        flex: 1,
        minWidth: 160,
        filter: false,
        sortable: false,
      },
      {
        headerName: t('Global.Aggrid.demand'),
        cellRenderer: DemandCell,
        flex: 2,
        filter: false,
        minWidth: 200,
        sortable: false,
      },
      {
        headerName: t('Global.Aggrid.actions'),
        headerComponentParams: {
          className: 'text-right',
        } satisfies Partial<FilterHeaderParams>,
        cellRenderer: ActionsCell,
        cellRendererParams: { inventoryId: inventoryId },
        sortable: false,
        suppressHeaderMenuButton: true,
        filter: false,
        flex: 1.5,
        minWidth: 180,
      },
    ],
    [t, inventoryId],
  );

  const gridOption = useMemo<GridOptions<StockDetails>>(
    () => ({
      ...defautGridOption,
      columnDefs,
    }),
    [columnDefs],
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-4">
        <div className="space-x-4">
          <AddNewStockDialog inventoryId={inventoryId} />
        </div>
      </div>

      <div className="h-[calc(100vh-18rem)]">
        <AgGridReact<StockDetails>
          ref={gridRef}
          gridOptions={gridOption}
          theme={agTheme}
          rowData={stocks}
        />
      </div>
    </div>
  );
};
