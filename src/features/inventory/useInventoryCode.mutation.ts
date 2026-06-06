import { inventoryApi } from '@/lib/api-client';
import { InventoryFactory } from '@/lib/tanstack/queryFactory';
import type { UpdateInventory } from '@57eme-regiment/renenutet-api-contract';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useInventoryCodeMutation(inventoryId: string) {
  const queryClient = useQueryClient();
  const queryKey = InventoryFactory.ById(inventoryId);

  return useMutation({
    mutationFn: async (formValues: UpdateInventory) =>
      await inventoryApi.inventory.update({
        params: {
          id: inventoryId,
        },
        body: formValues,
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
