import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { IconShip, IconBuildingWarehouse, IconAlertTriangle } from '@tabler/icons-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/components/language-provider'
import type { Stock } from '@/types/inventory'

const STOCK_ICONS = {
  Seaport: IconShip,
  Depot: IconBuildingWarehouse,
} as const

function getAlertCounts(stock: Stock) {
  const critical = stock.items.filter(item => item.demand > 0 && item.quantity / item.demand < 0.2).length
  const warning = stock.items.filter(item => {
    if (item.demand === 0) return false
    const ratio = item.quantity / item.demand
    return ratio >= 0.2 && ratio < 0.5
  }).length
  return { critical, warning }
}

interface StockCardProps {
  stock: Stock
  index: number
}

export function StockCard({ stock, index }: StockCardProps) {
  const { t } = useLanguage()
  const Icon = STOCK_ICONS[stock.type]
  const { critical, warning } = getAlertCounts(stock)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Link to="/stock/$id" params={{ id: stock.id }} className="block h-full">
        <Card className="h-full hover:border-primary transition-colors cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>{stock.name}</CardTitle>
                <CardDescription>{stock.city} • {stock.type}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <span className="text-muted-foreground">
                {stock.items.length} {t('stock.items')}
              </span>
              {critical > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-red-500 bg-red-500/10">
                  <IconAlertTriangle className="w-4 h-4" />
                  {critical}
                </span>
              )}
              {warning > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-yellow-500 bg-yellow-500/10">
                  <IconAlertTriangle className="w-4 h-4" />
                  {warning}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
