import { prApi } from '@/lib/api-client';
import { ProductionRequestFactory } from '@/lib/tanstack/queryFactory';
import type { CreateProductionRequest } from '@57eme-regiment/renenutet-api-contract';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type mutationFnProps = {
  formValues: CreateProductionRequest;
};
export function useAddProductionRequestMutation(inventoryId?: string) {
  const queryClient = useQueryClient();
  const queryKey = ProductionRequestFactory.all;

  return useMutation({
    mutationFn: async ({ formValues }: mutationFnProps) => {
      const res = await prApi.create({
        body: { ...formValues, ...(inventoryId && { inventoryId }) },
      });
      if (res.status !== 201) throw res.body;
      return res.body;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
    },
    onSuccess: () => {
      toast.success('Production Request Created');
    },
    onError: error => {
      const message =
        error instanceof Object && 'message' in error
          ? String(error.message)
          : 'Production Request creation failed, try again later';
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
