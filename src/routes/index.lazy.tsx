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
import { StockCard } from '@/components/inventory/StockCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ResourceCell } from '@/components/inventory/cells/ResourceCell'
import { StockCell } from '@/components/inventory/cells/StockCell'
import { DemandCell } from '@/components/inventory/cells/DemandCell'
import { ProductionCell } from '@/components/inventory/cells/ProductionCell'
import { ActionsCell } from '@/components/inventory/cells/ActionsCell'
import type { InventoryItem } from '@/types/inventory'
// import { contract as db_contract } from '@57em-regiment/renenutet-api-contract';
// import { initClient } from '@ts-rest/core'

export const Route = createLazyFileRoute('/')({
	component: Index,
})

// type MegaInventoryItem = InventoryItem & { stockId: string; stockName: string }

function Index() {
	const { t } = useLanguage()
	const { theme } = useTheme()
	const stocks = useInventoryStore(state => state.stocks)
	const gridRef = useRef<AgGridReact<InventoryItem>>(null)

	const [search, setSearch] = useState('')
	const [colorEnabled, setColorEnabled] = useState(true)

	const isDark =
		theme === 'dark' ||
		(theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

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
			// {
			// 	headerName: t('v1.stock'),
			// 	field: 'stockName',
			// 	flex: 1.5,
			// 	minWidth: 150,
			// },
			{
				headerName: t('v1.resource'),
				field: 'name',
				cellRenderer: (props: any) => <ResourceCell {...props} />,
				flex: 2,
				minWidth: 220,
			},
			{
				headerName: t('v1.stock'),
				field: 'quantity',
				cellRenderer: (props: any) => <StockCell {...props} />,
				flex: 2,
				minWidth: 230,
				getQuickFilterText: () => '',
			},
			{
				headerName: t('v1.demand'),
				field: 'demand',
				cellRenderer: (props: any) => <DemandCell {...props} />,
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
				cellRenderer: (props: any) => <ProductionCell {...props} />,
				flex: 1,
				minWidth: 160,
				getQuickFilterText: () => '',
			},
			// {
			// 	headerName: t('v1.actions'),
			// 	cellRenderer: (props: any) => <ActionsCell {...props} stockId={props.data.stockId} />,
			// 	headerClass: '[&_.ag-header-cell-label]:justify-end',
			// 	sortable: false,
			// 	suppressHeaderMenuButton: true,
			// 	flex: 1.5,
			// 	minWidth: 180,
			// 	getQuickFilterText: () => '',
			// },
		],
		[t],
	)

	// const dbAPI = initClient(db_contract, { baseUrl: 'http://57eme.fr:5000' })

	const megaItems = useMemo(() => {
		// const invs = dbAPI.inventory.
		// return stocks.flatMap(stock => 
		// 	stock.items.map(item => ({ ...item, stockId: stock.id, stockName: stock.name }))
		// )
		const result: Map<string, InventoryItem> = new Map()
		stocks.forEach(stock => {
			stock.items.forEach(item => {
				result.has(item.id) ? result.set(item.id, { ...item, quantity: result.get(item.id)!.quantity + item.quantity }) :
				result.set(item.id, { ...item })
			})
		})
		return Array.from(result.values())
	}, [stocks])

	const filteredItems = useMemo(() => {
		if (!search.trim()) return megaItems
		
		const searchChars = search.toLowerCase().replace(/\s+/g, '').split('')
		return megaItems.filter(item => {
			const textToSearch = (item.name).toLowerCase()
			let searchIdx = 0
			for (let i = 0; i < textToSearch.length; i++) {
				if (textToSearch[i] === searchChars[searchIdx]) {
					searchIdx++
					if (searchIdx === searchChars.length) return true
				}
			}
			return false
		})
	}, [megaItems, search])

	return (
		<div className="flex flex-col space-y-8 pb-8 min-h-[calc(100vh-80px)]">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">{t('nav.title')}</h1>
				<p className="text-muted-foreground mt-2">{t('nav.select_stock')}</p>
			</div>
			
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
				{stocks.map((stock, i) => (
					<StockCard key={stock.id} stock={stock} index={i} />
				))}
			</div>

			<div className="pt-4 border-t border-border flex flex-col space-y-4" style={{ height: '700px' }}>
				<div className="flex items-center justify-between shrink-0">
					<h2 className="text-2xl font-bold">{t('v1.all_items') || 'All Items'}</h2>
					<Button variant="outline" onClick={() => setColorEnabled(prev => !prev)}>
						{colorEnabled ? t('v1.colors.disable') : t('v1.colors.enable')}
					</Button>
				</div>
				
				<Input
					placeholder={t('v1.search') + "..."}
					value={search}
					onChange={e => setSearch(e.target.value)}
					className="max-w-md shrink-0"
				/>
				
				<div className="flex-1 min-h-0">
					<AgGridReact<InventoryItem>
						ref={gridRef}
						modules={[AllCommunityModule]}
						theme={agTheme}
						rowData={filteredItems}
						columnDefs={colDefs}
						getRowStyle={getRowStyle}
						rowHeight={60}
						defaultColDef={{ sortable: true, resizable: false }}
						suppressMovableColumns
					/>
				</div>
			</div>
		</div>
	)
}

