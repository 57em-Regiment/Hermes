import { DeleteInventoryDialog } from '@/components/inventory/deleteInventory';
import { Button, Typography, useLanguage } from '@57eme-regiment/nabu-ui';
import type { InventoryDetails } from '@57eme-regiment/renenutet-api-contract';
import { IconShip, IconTrashFilled } from '@tabler/icons-react';
import { InventoryCodeDialog } from './InventoryCodeDialog';
import { UpdateInventoryCodeDialog } from './UpdateInventoryCodeDialog';

type InventoryHeaderProps = { inventory: InventoryDetails; stockLen: number };

export const InventoryHeader = ({
  inventory,
  stockLen,
}: InventoryHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between shrink-0">
      <div>
        <div className="flex items-center gap-2">
          <IconShip className="text-primary size-8" />
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
          {stockLen} {t('stock.items')}
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
