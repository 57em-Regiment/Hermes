import { inventoryApi } from '@/lib/api-client';
import { InventoryFactory } from '@/lib/tanstack/queryFactory';
import type { UpdateInventoryCode } from '@57eme-regiment/renenutet-api-contract';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useInventoryCodeMutation(inventoryId: string) {
  const queryClient = useQueryClient();
  const queryKey = InventoryFactory.ById(inventoryId);

  return useMutation({
    mutationFn: async (formValues: UpdateInventoryCode) =>
      await inventoryApi.inventory.updateCode({
        params: {
          id: inventoryId,
        },
        body: {
          code: formValues.code,
        },
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
    },
    onSuccess: () => {
      toast.success('Inventory code updated');
    },
    onError: () => {
      toast.error('Inventory code failed, try again later');
      queryClient.invalidateQueries({ queryKey });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
