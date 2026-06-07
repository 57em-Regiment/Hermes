import { useAllStockQuery } from '@/features/stock/useAllStockQuery';
import { useLanguage, useTheme } from '@57eme-regiment/nabu-ui';
import type { StockDetails } from '@57eme-regiment/renenutet-api-contract';
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
import { ResourceCell } from '../inventory/cells/ResourceCell';
import { StockCell } from '../inventory/cells/StockCell';

export const AllStockGrid = () => {
  const gridRef = useRef<AgGridReact<StockDetails>>(null);

  const { data: stocks } = useAllStockQuery();

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
        cellRenderer: StockCell, //TODO Géré la capacity quand on a des items dans + d'un seul stock
        flex: 2,
        minWidth: 230,
        valueGetter: ({ data }) => data?.quantity,
        filter: false,
        sort: 'desc',
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
    ],
    [t],
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
    <div className="h-[calc(100vh-30rem)]">
      <AgGridReact<StockDetails>
        ref={gridRef}
        modules={[AllCommunityModule]}
        gridOptions={gridOption}
        rowData={stocks}
      />
    </div>
  );
};
