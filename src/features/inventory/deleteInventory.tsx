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
} from '@57eme-regiment/nabu-ui';
import { Button } from '@57eme-regiment/nabu-ui';
import { inventoryApi } from '@/lib/api-client';
import { useMutation } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Trash2Icon } from 'lucide-react';
import { type PropsWithChildren } from 'react';
import { toast } from 'sonner';

type DeleteInventoryDialog = PropsWithChildren;

const routeApi = getRouteApi('/_authenticated/inventory/$id');

export function DeleteInventoryDialog({ children }: DeleteInventoryDialog) {
  const { id: stockId } = routeApi.useParams();
  const navigate = useNavigate();
  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      const res = await inventoryApi.inventory.delete({
        params: { id: stockId },
      });
      if (res.status != 204)
        throw Error('Create Inventory failed', { cause: res });
    },
    onError(error) {
      console.error('🚀 ~ InventoryDialog ~ error:', error);
      toast.error(error.message);
    },
    onSuccess() {
      toast.warning('Inventory Deleted');
      navigate({ to: '/' });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        {children || <Button variant="destructive">Delete Inventory</Button>}
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete inventory ?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this inventory and all relative data
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => mutateAsync()}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
