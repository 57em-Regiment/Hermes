import { DeleteInventoryDialog } from '@/components/inventory/deleteInventory';
import { Button, Typography } from '@57eme-regiment/nabu-ui';
import type { InventoryDetails } from '@57eme-regiment/renenutet-api-contract';
import { IconShip, IconTrashFilled } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { InventoryCodeDialog } from './InventoryCodeDialog';
import { UpdateInventoryCodeDialog } from './UpdateInventoryCodeDialog';

type InventoryHeaderProps = { inventory: InventoryDetails; stockLen: number };

export const InventoryHeader = ({
  inventory,
  stockLen,
}: InventoryHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between shrink-0">
      <div>
        <div className="flex items-baseline gap-2">
          {inventory.location.icon ? (
            <img
              src={inventory.location.icon}
              className="size-8 object-cover"
            />
          ) : (
            <IconShip className="size-8 shrink-0 text-muted-foreground" />
          )}
          <Typography variant="h2">{inventory?.name}</Typography>
        </div>
        <div className="flex gap-1">
          <Typography variant="muted">
            {inventory.location.region.name} •
          </Typography>
          <Typography variant="muted">
            {inventory.location.town.name} •
          </Typography>
          <Typography variant="muted">{inventory.location.type}</Typography>
        </div>
        <Typography variant="muted">
          {t('stock.items', { count: stockLen })}
        </Typography>
      </div>
      <div className="flex gap-4">
        <UpdateInventoryCodeDialog inventory={inventory} />
        <InventoryCodeDialog inventoryId={inventory.id} />
        <DeleteInventoryDialog>
          <Button variant={'destructive'}>
            <IconTrashFilled />
          </Button>
        </DeleteInventoryDialog>
      </div>
    </div>
  );
};
