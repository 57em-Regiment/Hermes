import { useDeleteInventoryMutation } from '@/features/inventory/useDeleteInventory.mutation';
import { useHasPermission } from '@57eme-regiment/auth-browser';
import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@57eme-regiment/nabu-ui';
import { getRouteApi } from '@tanstack/react-router';
import { Trash2Icon } from 'lucide-react';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

type DeleteInventoryDialog = PropsWithChildren;

const routeApi = getRouteApi('/_authenticated/inventory/$id');

export function DeleteInventoryDialog({ children }: DeleteInventoryDialog) {
  const { t } = useTranslation();
  const { id: stockId } = routeApi.useParams();
  const { mutateAsync, isPending } = useDeleteInventoryMutation(stockId);

  if (!useHasPermission(PERMISSIONS.RENENUTET_INVENTORIES_UPDATE)) return null;
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        {children || (
          <Button variant="destructive">
            {t('Components.DeleteInventory.triggerLabel')}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>
            {t('Components.DeleteInventory.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('Components.DeleteInventory.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">
            {t('Components.DeleteInventory.cancelButton')}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => mutateAsync()}
            loading={isPending}>
            {t('Components.DeleteInventory.deleteButton')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
