import { useLanguage } from '@/components/language-provider';
import type { InventoryItem } from '@/types/inventory';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
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
} from '@57eme-regiment/nabu-ui';
import { useState } from 'react';

interface ItemActionsDialogProps {
  item: InventoryItem;
  stockId: string;
}

export function ItemActionsDialog({ item, stockId }: ItemActionsDialogProps) {
  const [amount, setAmount] = useState(10);
  // const updateQuantity = useInventoryStore(state => state.updateQuantity)
  const { t } = useLanguage();

  // const updateQuantity = useMutation({
  //   mutationFn: async () =>
  //     await stockApi.update({
  //       params: {
  //         id: stockId,
  //         inventoryId: '',
  //         itemId: '',
  //       },
  //     }),
  //   onMutate: async (newQuantity, context) => {
  //     context.client.cancelQueries({ queryKey: InventoryFactory.all });
  //     // const previousValue = context.client.getQueryData(InventoryFactory.all);
  //     // context.client.setQueryData;
  //   },
  //   onError(error, variables, onMutateResult, context) {
  //     // context.client.setQueryData(InventoryFactory.all, onMutateResult.)
  //   },
  //   onSettled(data, error, variables, onMutateResult, context) {},
  // });

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger
          className={buttonVariants({
            variant: 'outline',
            size: 'sm',
            className:
              'h-8 text-green-600 border-green-200 hover:bg-green-50 dark:border-green-900 dark:hover:bg-green-900/30',
          })}>
          {t('dialog.add')}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('dialog.add')} — {item.name}
            </DialogTitle>
            <DialogDescription>
              {t('dialog.add_description')} {item.quantity.toLocaleString()} /{' '}
              {/* {item.maxCapacity.toLocaleString()}. */}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {/* <Input
              type="number"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              min={1}
              max={item.maxCapacity - item.quantity}
            /> */}
          </div>
          <DialogFooter>
            <DialogClose>{t('dialog.cancel')}</DialogClose>
            <Button
            // onClick={() => updateQuantity(stockId, item.id, amount)}
            >
              {t('dialog.confirm_add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger
          className={buttonVariants({
            variant: 'outline',
            size: 'sm',
            className:
              'h-8 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/30',
          })}>
          {t('dialog.remove')}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('dialog.remove')} — {item.name}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('dialog.remove_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="number"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              min={1}
              max={item.quantity}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('dialog.cancel')}</AlertDialogCancel>
            {/* <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => updateQuantity(stockId, item.id, -amount)}>
              {t('dialog.confirm_remove')}
            </AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
