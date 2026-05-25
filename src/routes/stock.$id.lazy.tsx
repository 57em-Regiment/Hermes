import { createLazyFileRoute } from '@tanstack/react-router'
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
  AllCommunityModule,
  themeQuartz,
  colorSchemeDark,
  colorSchemeLight,
} from 'ag-grid-community'
import type { ColDef, RowClassParams } from 'ag-grid-community'
import { useInventoryStore } from '@/store/inventory'
import { useLanguage } from '@/components/language-provider'
import { useTheme } from '@/components/theme-provider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ResourceCell } from '@/components/inventory/cells/ResourceCell'
import { StockCell } from '@/components/inventory/cells/StockCell'
import { DemandCell } from '@/components/inventory/cells/DemandCell'
import { ProductionCell } from '@/components/inventory/cells/ProductionCell'
import { ActionsCell } from '@/components/inventory/cells/ActionsCell'
import type { InventoryItem } from '@/types/inventory'

export const Route = createLazyFileRoute('/stock/$id')({
  component: StockView,
})

function StockView() {
  const { id } = Route.useParams()
  const { t } = useLanguage()
  const { theme } = useTheme()
  const stock = useInventoryStore(state => state.stocks.find(s => s.id === id))
  const gridRef = useRef<AgGridReact<InventoryItem>>(null)

  const [search, setSearch] = useState('')
  const [colorEnabled, setColorEnabled] = useState(true)

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const agTheme = useMemo(
    () =>
      isDark
        ? themeQuartz.withPart(colorSchemeDark)
        : themeQuartz.withPart(colorSchemeLight),
    [isDark],
  )

  const getRowStyle = useCallback(
    ({ data }: RowClassParams<InventoryItem>) => {
      if (!colorEnabled || !data) return undefined
      const req = data.demand > 0 ? data.demand : data.maxCapacity
      const hue = Math.max(0, Math.min(1, data.quantity / req)) * 120
      return { backgroundColor: `hsla(${hue}, 70%, 50%, 0.1)` }
    },
    [colorEnabled],
  )

  useEffect(() => {
    gridRef.current?.api?.redrawRows()
  }, [colorEnabled])

  const colDefs = useMemo<ColDef<InventoryItem>[]>(
    () => [
      {
        headerName: t('v1.resource'),
        field: 'name',
        cellRenderer: ResourceCell,
        flex: 2,
        minWidth: 220,
      },
      {
        headerName: t('v1.stock'),
        field: 'quantity',
        cellRenderer: StockCell,
        flex: 2,
        minWidth: 230,
        getQuickFilterText: () => '',
      },
      {
        headerName: t('v1.demand'),
        field: 'demand',
        cellRenderer: DemandCell,
        flex: 2,
        minWidth: 200,
        getQuickFilterText: () => '',
        comparator: (_a, _b, nodeA, nodeB) => {
          const a = nodeA.data!
          const b = nodeB.data!
          const aReq = a.demand > 0 ? a.demand : a.maxCapacity
          const bReq = b.demand > 0 ? b.demand : b.maxCapacity
          return a.quantity / aReq - b.quantity / bReq
        },
      },
      {
        headerName: t('v1.production'),
        field: 'productionNeed',
        cellRenderer: ProductionCell,
        flex: 1,
        minWidth: 160,
        getQuickFilterText: () => '',
      },
      {
        headerName: t('v1.actions'),
        cellRenderer: ActionsCell,
        cellRendererParams: { stockId: stock?.id ?? '' },
        sortable: false,
        suppressHeaderMenuButton: true,
        flex: 1.5,
        minWidth: 180,
        getQuickFilterText: () => '',
      },
    ],
    [t, stock?.id],
  )

  if (!stock) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        {t('stock.not_found')}
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-4" style={{ height: 'calc(100vh - 130px)' }}>
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold">{stock.name}</h2>
          <p className="text-muted-foreground">
            {stock.city} • {stock.type} • {stock.items.length} {t('stock.items')}
          </p>
        </div>
        <Button variant="outline" onClick={() => setColorEnabled(prev => !prev)}>
          {colorEnabled ? t('v1.colors.disable') : t('v1.colors.enable')}
        </Button>
      </div>

      <Input
        placeholder={t('v1.search')}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="max-w-md shrink-0"
      />

      <div className="flex-1 min-h-0">
        <AgGridReact<InventoryItem>
          ref={gridRef}
          modules={[AllCommunityModule]}
          theme={agTheme}
          rowData={stock.items}
          columnDefs={colDefs}
          quickFilterText={search}
          getRowStyle={getRowStyle}
          rowHeight={60}
          defaultColDef={{ sortable: true, resizable: true }}
          suppressMovableColumns
        />
      </div>
    </div>
  )
}
