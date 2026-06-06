import { useLanguage, useTheme } from '@57eme-regiment/nabu-ui';
import type { StockDetails } from '@57eme-regiment/renenutet-api-contract';
import { useParams } from '@tanstack/react-router';
import {
  AllCommunityModule,
  colorSchemeDark,
  colorSchemeLight,
  themeQuartz,
  type ColDef,
  type GridOptions,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemo, useRef } from 'react';
import { ActionsCell } from '../inventory/cells/ActionsCell';
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

  const { t } = useLanguage();
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
        headerName: t('v1.resource'),
        cellRenderer: ResourceCell,
        flex: 2,
        minWidth: 220,
        filterValueGetter: ({ data }) => data?.item.name,
        valueGetter: ({ data }) => data?.item.name,
      },
      {
        headerName: t('v1.stock'),
        cellRenderer: StockCell,
        flex: 2,
        minWidth: 230,
        valueGetter: ({ data }) => data?.quantity,
        filter: false,
      },
      // {
      //   headerName: t('v1.demand'),
      //   field: 'demand',
      //   cellRenderer: DemandCell,
      //   flex: 2,
      //   minWidth: 200,
      //   getQuickFilterText: () => '',
      //   // comparator: (_a, _b, nodeA, nodeB) => {
      //   // const a = nodeA.data!;
      //   // const b = nodeB.data!;
      //   // const aReq = a.demand > 0 ? a.demand : a.maxCapacity;
      //   // const bReq = b.demand > 0 ? b.demand : b.maxCapacity;
      //   // return a.quantity / aReq - b.quantity / bReq;
      //   // },
      // },
      // {
      //   headerName: t('v1.production'),
      //   field: 'productionNeed',
      //   cellRenderer: ProductionCell,
      //   flex: 1,
      //   minWidth: 160,
      //   getQuickFilterText: () => '',
      // },
      {
        headerName: t('v1.actions'),
        cellRenderer: ActionsCell,
        cellRendererParams: { inventoryId: inventoryId },
        headerClass: '[&_.ag-header-cell-label]:justify-end',
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
      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: false,
        suppressFloatingFilterButton: true,
        floatingFilter: true,
      },
      theme: agTheme,
      suppressMovableColumns: true,
      columnDefs,
    }),
    [agTheme, columnDefs],
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
          modules={[AllCommunityModule]}
          gridOptions={gridOption}
          rowData={stocks}
        />
      </div>
    </div>
  );
};
