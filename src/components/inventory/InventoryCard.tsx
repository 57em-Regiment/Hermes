import { useInventoryDetailsQuery } from '@/features/inventory/useInventoryDetails.query';
import { LINKS } from '@/features/navigation/links';
import { formatDateTime } from '@57eme-regiment/nabu-frontend-utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Typography,
} from '@57eme-regiment/nabu-ui';
import {
  IconAlertTriangle,
  IconCheck,
  IconHours24,
  IconInfoCircle,
  IconShip,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';

//TODO pour plus tard
// function getAlertCounts(stock: Stock) {
//   const critical = stock.items.filter(
//     item => item.demand > 0 && item.quantity / item.demand < 0.2,
//   ).length;
//   const warning = stock.items.filter(item => {
//     if (item.demand === 0) return false;
//     const ratio = item.quantity / item.demand;
//     return ratio >= 0.2 && ratio < 0.5;
//   }).length;
//   return { critical, warning };
// }

interface InventoryCardProps {
  inventoryId: string;
}

export function InventoryCard({ inventoryId }: InventoryCardProps) {
  const { data: inventory, error } = useInventoryDetailsQuery(inventoryId);

  const criticals = inventory?.stocks.filter(
    s => s.minimumQuantity && s.minimumQuantity > s.quantity,
  );
  const warnings = inventory?.stocks.filter(
    s => s.minimumQuantity && s.quantity <= s.minimumQuantity * 1.2,
  );
  const demands = inventory?.stocks.filter(s => s.productionRequest?.length);

  if (error || !inventory) return <div>toto</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group select-none cursor-pointer">
      <Link to={LINKS.Inventory.detail.to} params={{ id: inventory.id }}>
        <Card className="min-w-96 min-h-24">
          <CardHeader>
            <CardTitle className="flex gap-4 items-center">
              <IconShip className="text-primary" />
              <Typography variant="lead" className="group-hover:text-primary">
                {inventory.name}
              </Typography>
            </CardTitle>
            <CardDescription className="flex gap-1 flex-wrap">
              <Typography>{inventory.location.region.name} •</Typography>
              <Typography>{inventory.location.town.name} •</Typography>
              <Typography>{inventory.location.type}</Typography>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {criticals?.length ? (
                <div className="flex gap-1 items-center text-red-500 font-semibold">
                  <IconAlertTriangle className="size-4 animate-pulse" />
                  {criticals.length} Critique
                </div>
              ) : (
                <div className="flex gap-1 items-center text-green-500/40 font-semibold">
                  <IconCheck className="size-4" />0 Critique
                </div>
              )}
              {warnings?.length ? (
                <div className="flex gap-1 items-center text-amber-500 font-semibold">
                  <IconAlertTriangle className="size-4 animate-pulse" />
                  {warnings?.length} Warning
                </div>
              ) : (
                <div className="flex gap-1 items-center text-green-500/40 font-semibold">
                  <IconAlertTriangle className="size-4 animate-pulse" />0
                  Warning
                </div>
              )}
              {demands?.length ? (
                <div className="flex gap-1 items-center text-blue-500 font-semibold">
                  <IconInfoCircle className="size-4 animate-pulse" />
                  {demands?.length} Demand{demands?.length > 1 && 's'}
                </div>
              ) : (
                <div className="flex gap-1 items-center text-green-500/40 font-semibold">
                  <IconInfoCircle className="size-4 animate-pulse" />0 Demand
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex gap-1 items-center w-full">
            <Avatar>
              <AvatarFallback>
                {inventory.owner.name?.slice(0, 1).toUpperCase()}
              </AvatarFallback>
              {inventory.owner.image && (
                <AvatarImage src={inventory.owner.image} />
              )}
            </Avatar>
            <Typography variant="muted">{inventory.owner.name}</Typography>
            <div className="flex items-center ml-auto">
              <IconHours24 className="text-muted-foreground" />
              <Typography variant="muted">
                {formatDateTime(inventory.updatedAt)}
              </Typography>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
