import { inventoryApi } from '@/lib/api-client';
import { InventoryFactory } from '@/lib/tanstack/queryFactory';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { LINKS } from '../navigation/links';

export function useDeleteInventoryMutation(inventoryId: string) {
  const queryClient = useQueryClient();
  const queryKey = InventoryFactory.all;
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const res = await inventoryApi.inventory.delete({
        params: { id: inventoryId },
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
      queryClient.removeQueries({
        queryKey: InventoryFactory.ById(inventoryId),
        exact: false,
      });
      navigate({ to: LINKS.index.to });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      console.log('🚀 ~ useDeleteInventoryMutation ~ queryKey:', queryKey);
    },
  });
}
