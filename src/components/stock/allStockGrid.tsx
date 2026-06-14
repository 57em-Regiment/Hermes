import { ProductionCell } from '@/components/stock/aggrid/ProductionCell';
import { useAllStockQuery } from '@/features/stock/useAllStockQuery';
import { defautGridOption } from '@57eme-regiment/nabu-frontend-utils';
import { useTheme } from '@57eme-regiment/nabu-ui';
import { useTranslation } from 'react-i18next';
import type { StockDetails } from '@57eme-regiment/renenutet-api-contract';
import {
  colorSchemeDark,
  colorSchemeLight,
  themeQuartz,
  type ColDef,
  type GridOptions,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemo, useRef } from 'react';
import { ResourceCell } from '../inventory/cells/ResourceCell';
import { DemandCell } from './aggrid/DemandCell';
import { StockCell } from './aggrid/StockCell';

export const AllStockGrid = () => {
  const gridRef = useRef<AgGridReact<StockDetails>>(null);

  const { data: stocks } = useAllStockQuery();

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
        headerName: t('Global.Aggrid.globalDemandPR'),
        cellRenderer: DemandCell,
        flex: 2,
        filter: false,
        minWidth: 200,
      },
      {
        headerName: t('Global.Aggrid.production'),
        cellRenderer: ProductionCell,
        flex: 1,
        filter: false,
        minWidth: 160,
      },
    ],
    [t],
  );

  const gridOption = useMemo<GridOptions<StockDetails>>(
    () => ({
      ...defautGridOption,
      columnDefs,
    }),
    [columnDefs],
  );

  return (
    <div className="h-[calc(100vh-22.1rem)]">
      <AgGridReact<StockDetails>
        ref={gridRef}
        gridOptions={gridOption}
        theme={agTheme}
        rowData={stocks}
      />
    </div>
  );
};
