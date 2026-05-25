import { createLazyFileRoute } from '@tanstack/react-router'
import { useInventoryStore } from '@/store/inventory'
import { useLanguage } from '@/components/language-provider'
import { StockCard } from '@/components/inventory/StockCard'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const { t } = useLanguage()
  const stocks = useInventoryStore(state => state.stocks)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('nav.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('nav.select_stock')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stocks.map((stock, i) => (
          <StockCard key={stock.id} stock={stock} index={i} />
        ))}
      </div>
    </div>
  )
}
