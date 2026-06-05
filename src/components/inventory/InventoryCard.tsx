// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
import {Card} from "@57eme-regiment/nabu-ui"
import { useInventoryDetailsQuery } from '@/features/inventory/useInventoryDetails.query';
import { LINKS } from '@/features/navigation/links';
import type { Stock } from '@/types/inventory';
import { IconBuildingWarehouse, IconShip } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useLanguage } from '../language-provider';

const STOCK_ICONS = {
  Seaport: IconShip,
  Depot: IconBuildingWarehouse,
} as const;

function getAlertCounts(stock: Stock) {
  const critical = stock.items.filter(
    item => item.demand > 0 && item.quantity / item.demand < 0.2,
  ).length;
  const warning = stock.items.filter(item => {
    if (item.demand === 0) return false;
    const ratio = item.quantity / item.demand;
    return ratio >= 0.2 && ratio < 0.5;
  }).length;
  return { critical, warning };
}

interface InventoryCardProps {
  inventoryId: string;
}

export function InventoryCard({ inventoryId }: InventoryCardProps) {
  const { t } = useLanguage();
  const { data: inventory, error } = useInventoryDetailsQuery(inventoryId);
  // const Icon = STOCK_ICONS[stock.type];
  // const { critical, warning } = getAlertCounts(inventory);

  if (!error || !inventory) return <div>toto</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileHover={{ scale: 1.02 }}>
      <Link
        to={LINKS.Inventory.detail.to}
        params={{ id: inventory.id }}
        className="block h-full">
        <Card className="h-full hover:border-primary transition-colors cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <IconShip className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>{inventory.name}</CardTitle>
                <CardDescription>TODO City • TODO Type</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <span className="text-muted-foreground">
                InventoryItemCount {t('stock.items')}
              </span>
              {/* {critical > 0 && (
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
              )} */}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
