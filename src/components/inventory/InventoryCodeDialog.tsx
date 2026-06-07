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

type InventoryCodeDialogProps = {
  inventoryId: string;
};
export const InventoryCodeDialog = ({
  inventoryId,
}: InventoryCodeDialogProps) => {
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
        Get inventory code
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Inventory code</DialogTitle>
          <DialogDescription className="wrap-normal w-full">
            <Typography>
              This code is sensitive and should not be shared with everyone.
            </Typography>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          {!revealed || !data ? (
            <Button
              onClick={() => {
                refetch();
                setRevealed(true);
              }}>
              GetCode
            </Button>
          ) : (
            <div>
              <ButtonGroup>
                <Input value={data.code ?? 'No code'} />
                <Button onClick={() => handleCopy()}>
                  {copied ? <IconCheck /> : <IconCopy />}
                </Button>
              </ButtonGroup>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
