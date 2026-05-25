import { createLazyFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import { useInventoryStore, type InventoryItem } from '@/store/inventory'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { ItemActionsDialog } from '@/components/inventory/ItemActionsDialog'
import { useLanguage } from '@/components/language-provider'
import * as Icons from '@tabler/icons-react'

export const Route = createLazyFileRoute('/stock/$id')({
  component: StockView,
})

type SortKey = 'name' | 'quantity' | 'demand' | 'productionNeed'

function StockView() {
  const { id } = Route.useParams()
  const { t } = useLanguage()
  const stock = useInventoryStore(state => state.stocks.find(s => s.id === id))
  
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [colorEnabled, setColorEnabled] = useState(true)

  if (!stock) {
    return <div className="text-center py-20 text-muted-foreground">{t('stock.not_found')}</div>
  }

  const items = stock.items

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const processedItems = useMemo(() => {
    let result = items
    if (search) {
      const fuse = new Fuse(items, { keys: ['name'] })
      result = fuse.search(search).map(r => r.item)
    }

    return [...result].sort((a, b) => {
      // Modify demand sorting to sort by fulfillment percentage instead of flat demand integer
      if (sortKey === 'demand') {
        const aReq = a.demand > 0 ? a.demand : a.maxCapacity
        const bReq = b.demand > 0 ? b.demand : b.maxCapacity
        const aPct = a.quantity / aReq
        const bPct = b.quantity / bReq

        if (aPct < bPct) return sortOrder === 'asc' ? -1 : 1
        if (aPct > bPct) return sortOrder === 'asc' ? 1 : -1
        return 0
      }

      let aVal = a[sortKey]
      let bVal = b[sortKey]

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [items, search, sortKey, sortOrder])

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <Icons.IconSelector className="w-4 h-4 inline-block ml-1 opacity-50" />
    return sortOrder === 'asc' 
      ? <Icons.IconChevronUp className="w-4 h-4 inline-block ml-1" />
      : <Icons.IconChevronDown className="w-4 h-4 inline-block ml-1" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{stock.name}</h2>
          <p className="text-muted-foreground">{stock.city} • {stock.type} • {stock.items.length} {t('stock.items')}</p>
        </div>
        <Button variant="outline" onClick={() => setColorEnabled(!colorEnabled)}>
          {colorEnabled ? t('v1.colors.disable') : t('v1.colors.enable')}
        </Button>
      </div>

      <Input 
        placeholder={t('v1.search')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] cursor-pointer hover:bg-muted/50 select-none" onClick={() => handleSort('name')}>
                {t('v1.resource')} <SortIcon column="name" />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 select-none" onClick={() => handleSort('quantity')}>
                {t('v1.stock')} <SortIcon column="quantity" />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 select-none" onClick={() => handleSort('demand')}>
                {t('v1.demand')} <SortIcon column="demand" />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 select-none" onClick={() => handleSort('productionNeed')}>
                {t('v1.production')} <SortIcon column="productionNeed" />
              </TableHead>
              <TableHead className="text-right">{t('v1.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedItems.map(item => {
              const Icon = (Icons as any)[item.icon]
              const stockPct = (item.quantity / item.maxCapacity) * 100
              const demandPct = item.demand > 0 ? Math.min(100, (item.quantity / item.demand) * 100) : 100
              
              const req = item.demand > 0 ? item.demand : item.maxCapacity;
              const ratio = Math.max(0, Math.min(1, item.quantity / req));
              const hue = ratio * 120; // 0 (Red) to 120 (Green)
              const rowStyle = colorEnabled ? { backgroundColor: `hsla(${hue}, 70%, 50%, 0.1)` } : undefined;

              return (
                <TableRow key={item.id} style={rowStyle}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="p-2 border rounded-md bg-muted/50">
                        {Icon && <Icon className="h-4 w-4" />}
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1.5 w-[200px]">
                      <div className="flex justify-between text-xs">
                        <span>{item.quantity} / {item.maxCapacity}</span>
                        <span className="text-muted-foreground">{stockPct.toFixed(0)}%</span>
                      </div>
                      <Progress value={stockPct} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1.5 w-[150px]">
                      <div className="flex justify-between text-xs">
                        <span>{item.demand} {t('v1.required')}</span>
                        <span className={demandPct >= 100 ? "text-green-500" : "text-amber-500"}>
                          {demandPct.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={demandPct} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{item.productionNeed > 0 ? `+${item.productionNeed}` : '-'}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <ItemActionsDialog item={item} stockId={stock.id} />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
