/* eslint-disable react-refresh/only-export-components */
import { DemandCell } from '@/components/inventory/cells/DemandCell';
import { ProductionCell } from '@/components/inventory/cells/ProductionCell';
import { ResourceCell } from '@/components/inventory/cells/ResourceCell';
import { StockCell } from '@/components/inventory/cells/StockCell';
import { StockCard } from '@/components/inventory/StockCard';
import { useLanguage } from '@/components/language-provider';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InventoryDialog } from '@/features/inventory/InventoryDialog';
import { useInventoryStore } from '@/store/inventory';
import type { InventoryItem } from '@/types/inventory';
import { createLazyFileRoute } from '@tanstack/react-router';
import type { ColDef, RowClassParams } from 'ag-grid-community';
import {
  AllCommunityModule,
  colorSchemeDark,
  colorSchemeLight,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const Route = createLazyFileRoute('/_authenticated/')({
  component: Index,
});

function Index() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const stocks = useInventoryStore(state => state.stocks);
  const isLoaded = useInventoryStore(state => state.isLoaded);
  const error = useInventoryStore(state => state.error);
  const gridRef = useRef<AgGridReact<InventoryItem>>(null);

  const [search, setSearch] = useState('');
  const [colorEnabled, setColorEnabled] = useState(true);

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

  const getRowStyle = useCallback(
    ({ data }: RowClassParams<InventoryItem>) => {
      if (!colorEnabled || !data) return undefined;
      const req = data.demand > 0 ? data.demand : data.maxCapacity;
      const hue = Math.max(0, Math.min(1, data.quantity / req)) * 120;
      return { backgroundColor: `hsla(${hue}, 70%, 50%, 0.1)` };
    },
    [colorEnabled],
  );

  useEffect(() => {
    gridRef.current?.api?.redrawRows();
  }, [colorEnabled]);

  const colDefs = useMemo<ColDef<InventoryItem>[]>(
    () => [
      {
        headerName: t('v1.resource'),
        field: 'name',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (props: any) => <ResourceCell {...props} />,
        flex: 2,
        minWidth: 220,
      },
      {
        headerName: t('v1.stock'),
        field: 'quantity',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (props: any) => <StockCell {...props} />,
        flex: 2,
        minWidth: 230,
        getQuickFilterText: () => '',
      },
      {
        headerName: t('v1.demand'),
        field: 'demand',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (props: any) => <DemandCell {...props} />,
        flex: 2,
        minWidth: 200,
        getQuickFilterText: () => '',
        comparator: (_a, _b, nodeA, nodeB) => {
          const a = nodeA.data!;
          const b = nodeB.data!;
          const aReq = a.demand > 0 ? a.demand : a.maxCapacity;
          const bReq = b.demand > 0 ? b.demand : b.maxCapacity;
          return a.quantity / aReq - b.quantity / bReq;
        },
      },
      {
        headerName: t('v1.production'),
        field: 'productionNeed',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (props: any) => <ProductionCell {...props} />,
        flex: 1,
        minWidth: 160,
        getQuickFilterText: () => '',
      },
    ],
    [t],
  );

  const megaItems = useMemo(() => {
    const result: Map<string, InventoryItem> = new Map();
    stocks.forEach(stock => {
      stock.items.forEach(item => {
        if (result.has(item.id)) {
          result.set(item.id, {
            ...item,
            quantity: result.get(item.id)!.quantity + item.quantity,
          });
        } else {
          result.set(item.id, { ...item });
        }
      });
    });
    return Array.from(result.values());
  }, [stocks]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return megaItems;

    const searchChars = search.toLowerCase().replace(/\s+/g, '').split('');
    return megaItems.filter(item => {
      const textToSearch = item.name.toLowerCase();
      let searchIdx = 0;
      for (let i = 0; i < textToSearch.length; i++) {
        if (textToSearch[i] === searchChars[searchIdx]) {
          searchIdx++;
          if (searchIdx === searchChars.length) return true;
        }
      }
      return false;
    });
  }, [megaItems, search]);

  return (
    <div className="flex flex-col space-y-8 pb-8 min-h-[calc(100vh-80px)]">
      <div className="flex">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('nav.title')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('nav.select_stock')}</p>
        </div>
        <div className="flex">
          <InventoryDialog />
        </div>
      </div>

      {error && (
        <div className="text-sm p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
          {error}
        </div>
      )}

      {!isLoaded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
          {stocks.map((stock, i) => (
            <StockCard key={stock.id} stock={stock} index={i} />
          ))}
        </div>
      )}

      <div
        className="pt-4 border-t border-border flex flex-col space-y-4"
        style={{ height: '700px' }}>
        <div className="flex items-center justify-between shrink-0">
          <h2 className="text-2xl font-bold">
            {t('v1.all_items') || 'All Items'}
          </h2>
          <Button
            variant="outline"
            onClick={() => setColorEnabled(prev => !prev)}>
            {colorEnabled ? t('v1.colors.disable') : t('v1.colors.enable')}
          </Button>
        </div>

        <Input
          placeholder={t('v1.search') + '...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-md shrink-0"
        />

        <div className="flex-1 min-h-0">
          <AgGridReact<InventoryItem>
            ref={gridRef}
            modules={[AllCommunityModule]}
            theme={agTheme}
            rowData={isLoaded ? filteredItems : null}
            columnDefs={colDefs}
            getRowStyle={getRowStyle}
            rowHeight={60}
            defaultColDef={{ sortable: true, resizable: false }}
            suppressMovableColumns
          />
        </div>
      </div>
    </div>
  );
}
