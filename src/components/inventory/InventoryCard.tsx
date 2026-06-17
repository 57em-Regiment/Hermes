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
import { useTranslation } from 'react-i18next';

interface InventoryCardProps {
  inventoryId: string;
}

export function InventoryCard({ inventoryId }: InventoryCardProps) {
  const { t } = useTranslation();
  const { data: inventory, error } = useInventoryDetailsQuery(inventoryId);

  const criticals = inventory?.stocks.filter(
    s => s.minimumQuantity && s.minimumQuantity > s.quantity,
  );
  const warnings = inventory?.stocks.filter(
    s => s.minimumQuantity && s.quantity <= s.minimumQuantity * 1.2,
  );
  const demands = inventory?.stocks.filter(s => s.productionRequest?.length);

  if (error || !inventory)
    return <div>{t('Components.InventoryCard.errorMessage')}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group select-none cursor-pointer">
      <Link to={LINKS.Inventory.detail.to} params={{ id: inventory.id } as never}>
        <Card className="min-w-96 min-h-24">
          <CardHeader>
            <CardTitle className="flex gap-2">
              {inventory.location.icon ? (
                <img
                  src={inventory.location.icon}
                  className="size-6 object-cover"
                />
              ) : (
                <IconShip className="size-4 shrink-0 text-muted-foreground" />
              )}
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
              <div
                className={`flex gap-1 items-center font-semibold ${criticals?.length ? 'text-red-500' : 'text-green-500/40'}`}>
                {criticals?.length ? (
                  <IconAlertTriangle className="size-4 animate-pulse" />
                ) : (
                  <IconCheck className="size-4" />
                )}
                {t('Components.InventoryCard.critical', {
                  count: criticals?.length ?? 0,
                })}
              </div>
              <div
                className={`flex gap-1 items-center font-semibold ${warnings?.length ? 'text-amber-500' : 'text-green-500/40'}`}>
                <IconAlertTriangle className="size-4 animate-pulse" />
                {t('Components.InventoryCard.warning', {
                  count: warnings?.length ?? 0,
                })}
              </div>
              <div
                className={`flex gap-1 items-center font-semibold ${demands?.length ? 'text-blue-500' : 'text-green-500/40'}`}>
                <IconInfoCircle className="size-4 animate-pulse" />
                {t('Components.InventoryCard.demand', {
                  count: demands?.length ?? 0,
                })}
              </div>
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
