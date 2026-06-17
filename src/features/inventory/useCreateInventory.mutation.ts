import { inventoryApi } from '@/lib/api-client';
import { InventoryFactory } from '@/lib/tanstack/queryFactory';
import type { CreateInventory } from '@57eme-regiment/renenutet-api-contract';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { LINKS } from '../navigation/links';

export function useCreateInventoryMutation() {
  const queryClient = useQueryClient();
  const queryKey = InventoryFactory.all;
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formValues: CreateInventory) => {
      const res = await inventoryApi.inventory.create({ body: formValues });
      if (res.status != 201)
        throw Error('Create Inventory failed', { cause: res });

      return res.body;
    },
    onSuccess({ id }) {
      navigate({ to: LINKS.Inventory.detail.to, params: { id } as never });
      toast.success('Inventory Created');
    },
    onError: () => {
      toast.error('Inventory code failed, try again later');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
