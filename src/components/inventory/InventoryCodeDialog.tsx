import { useHasPermission } from '@57eme-regiment/auth-browser';
import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  buttonVariants,
  useLanguage,
} from '@57eme-regiment/nabu-ui';

export const InventoryCodeDialog = () => {
  const { t } = useLanguage();
  const useCanViewCode = useHasPermission(
    PERMISSIONS.STOCK_INVENTORY_CODE_READ,
  );

  const handleGetCode = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
  };

  if (!useCanViewCode) return null;
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={buttonVariants({
          variant: 'outline',
          className: 'ml-auto hover:text-primary cursor-pointer',
        })}
        onClick={handleGetCode}>
        Get Code
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Récupération du code de l'inventaire
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tu t'apprète à récupéré le code de l'inventaire
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* <div className="py-4">
          <Input
            type="number"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            min={1}
            max={item.quantity}
          />
        </div> */}
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
  );
};
