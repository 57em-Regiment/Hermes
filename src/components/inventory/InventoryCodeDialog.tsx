import { useInventoryCodeQuery } from '@/features/inventory/useInventoryCode.query';
import { InventoryFactory } from '@/lib/tanstack/queryFactory';
import { useHasPermission } from '@57eme-regiment/auth-browser';
import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import {
  Button,
  ButtonGroup,
  buttonVariants,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Typography,
} from '@57eme-regiment/nabu-ui';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import copy from 'copy-to-clipboard';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type InventoryCodeDialogProps = {
  inventoryId: string;
};
export const InventoryCodeDialog = ({
  inventoryId,
}: InventoryCodeDialogProps) => {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);
  const { refetch, data } = useInventoryCodeQuery(inventoryId);
  const queryClient = useQueryClient();
  const queryKey = InventoryFactory.CodeInventory(inventoryId);

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    // navigator.clipboard.writeText(data?.code ?? 'toto').catch(console.error);
    copy(data?.code ?? 'toto');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onOpenChange = (open: boolean) => {
    if (open) return;
    setRevealed(false);
    queryClient.cancelQueries({ queryKey });
    queryClient.setQueryData(queryKey, undefined);
    queryClient.removeQueries({ queryKey });
  };

  if (!useHasPermission(PERMISSIONS.STOCK_INVENTORY_CODE_READ)) return null;
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger
        className={buttonVariants({
          variant: 'outline',
        })}>
        {t('Components.InventoryCodeDialog.triggerLabel')}{' '}
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t('Components.InventoryCodeDialog.title')}</DialogTitle>
          <DialogDescription className="wrap-normal w-full">
            <Typography>{t('Components.InventoryCodeDialog.description')}</Typography>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          {!revealed || !data ? (
            <Button
              onClick={() => {
                refetch();
                setRevealed(true);
              }}>
              {t('Components.InventoryCodeDialog.getCodeButton')}
            </Button>
          ) : (
            <div>
              <ButtonGroup>
                <Input value={data.code ?? t('Components.InventoryCodeDialog.noCode')} />
                <Button onClick={() => handleCopy()}>
                  {copied ? <IconCheck /> : <IconCopy />}
                </Button>
              </ButtonGroup>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">{t('Components.InventoryCodeDialog.closeButton')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
