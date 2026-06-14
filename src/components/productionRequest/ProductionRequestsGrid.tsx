import { useGetProductionRequestsQuery } from '@/features/productionRequests/useGetProductionRequests.query';
import { useUpdateProductionRequestMutation } from '@/features/productionRequests/useUpdateProductionRequest.mutation';
import { defautGridOption } from '@57eme-regiment/nabu-frontend-utils';
import { useTheme, type FilterHeaderParams } from '@57eme-regiment/nabu-ui';
import type { ProductionRequestDetail } from '@57eme-regiment/renenutet-api-contract';
import {
  colorSchemeDark,
  colorSchemeLight,
  themeQuartz,
  type ColDef,
  type GridOptions,
  type NewValueParams,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceCell } from '../inventory/cells/ResourceCell';
import { ActionsCell } from './cells/ActionsCell';
import { StockCell } from './cells/StockCell';

export const ProductionRequestsGrid = () => {
  const gridRef = useRef<AgGridReact<ProductionRequestDetail>>(null);

  const { data: prs } = useGetProductionRequestsQuery();
  const { mutateAsync } = useUpdateProductionRequestMutation();

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

  const onCellValueChanged = async (
    e: NewValueParams<ProductionRequestDetail>,
  ) => {
    mutateAsync({
      prParams: {
        id: e.data.id,
      },
      formValues: {
        quantity: e.newValue,
      },
    });
  };

  const columnDefs = useMemo<ColDef<ProductionRequestDetail>[]>(() => {
    return [
      {
        headerName: t('Global.Aggrid.resource'),
        cellRenderer: ResourceCell,
        flex: 2,
        minWidth: 220,
        filterValueGetter: ({ data }) =>
          `${data?.item.name} ${data?.item.shortName}`,
        valueGetter: ({ data }) => data?.item.name,
      },
      {
        headerName: 'Inventory',
        flex: 2,
        minWidth: 230,
        valueGetter: ({ data }) =>
          data?.inventoryId
            ? data.stocks?.find(s => s.inventoryId == data.inventoryId)
                ?.inventoryFullName
            : null,
        sort: 'asc',
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
        headerName: t('Global.Aggrid.demand'),
        field: 'quantity',
        flex: 2,
        minWidth: 200,
        editable: true,
        filter: false,
        singleClickEdit: true,
        onCellValueChanged,
      },
      {
        headerName: t('Global.Aggrid.actions'),
        cellRenderer: ActionsCell,
        headerComponentParams: {
          className: 'text-right',
        } satisfies Partial<FilterHeaderParams>,
        sortable: false,
        filter: false,
        flex: 1,
        minWidth: 180,
      },
    ];
  }, [t, onCellValueChanged]);

  const gridOption = useMemo<GridOptions<ProductionRequestDetail>>(
    () => ({
      ...defautGridOption,
      columnDefs,
    }),
    [columnDefs],
  );

  return (
    <div className="h-[calc(100vh-10rem)]">
      <AgGridReact<ProductionRequestDetail>
        ref={gridRef}
        gridOptions={gridOption}
        theme={agTheme}
        rowData={prs}
      />
    </div>
  );
};
