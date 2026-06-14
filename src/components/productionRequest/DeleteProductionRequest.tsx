import { useDeleteProductionRequestMutation } from '@/features/productionRequests/useDeleteProductionRequest.mutation';
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
import { Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type IncrementItemStockProps = {
  id: string;
};

export const DeleteProductionRequest = ({ id }: IncrementItemStockProps) => {
  const { t } = useTranslation();
  const { mutate } = useDeleteProductionRequestMutation({ id });

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/30">
          {t('Components.DeleteProductionRequest.triggerLabel')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{t('Components.DeleteProductionRequest.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('Components.DeleteProductionRequest.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">{t('Components.DeleteProductionRequest.cancelButton')}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => mutate()}>
            {t('Components.DeleteProductionRequest.deleteButton')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
