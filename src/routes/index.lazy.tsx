import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useInventoryStore } from '@/store/inventory'
import { useLanguage } from '@/components/language-provider'
import * as Icons from '@tabler/icons-react'

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
        {stocks.map((stock, i) => {
          const Icon = stock.type === 'Seaport' ? Icons.IconShip : Icons.IconBuildingWarehouse
          const criticalItems = stock.items.filter(item => (item.quantity / item.demand) < 0.2).length
          const warningItems = stock.items.filter(item => {
            const ratio = item.quantity / item.demand
            return ratio >= 0.2 && ratio < 0.5
          }).length

          return (
            <motion.div
              key={stock.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link to="/stock/$id" params={{ id: stock.id }} className="block h-full cursor-pointer">
                <Card className="h-full hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle>{stock.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {stock.city} • {stock.type}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                      <span className="text-muted-foreground">
                        {stock.items.length} {t('stock.items')}
                      </span>
                      {criticalItems > 0 && (
                        <span className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Icons.IconAlertTriangle className="w-4 h-4" />
                          {criticalItems}
                        </span>
                      )}
                      {warningItems > 0 && (
                        <span className="text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Icons.IconAlertTriangle className="w-4 h-4" />
                          {warningItems}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
