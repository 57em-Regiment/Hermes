import { prApi } from '@/lib/api-client';
import {
  InventoryFactory,
  ProductionRequestFactory,
  StockFactory,
} from '@/lib/tanstack/queryFactory';
import type {
  ProductionRequestDetail,
  ProductionRequestIdParam,
  UpdateProductionRequestQuantity,
} from '@57eme-regiment/renenutet-api-contract';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type UpdateProductionRequestMutationProps = {
  prParams: ProductionRequestIdParam;
  formValues: UpdateProductionRequestQuantity;
};

export function useUpdateProductionRequestMutation() {
  const queryClient = useQueryClient();
  const queryKey = ProductionRequestFactory.all;

  return useMutation({
    mutationFn: async ({
      formValues,
      prParams,
    }: UpdateProductionRequestMutationProps) => {
      const res = await prApi.updateQuantity({
        params: { id: prParams.id },
        body: { quantity: formValues.quantity },
      });
      if (res.status !== 200) throw res.body;
      return res.body;
    },
    onMutate: async mutationProps => {
      await queryClient.cancelQueries({ queryKey });
      const previousPrs =
        queryClient.getQueryData<ProductionRequestDetail[]>(queryKey);
      queryClient.setQueryData<ProductionRequestDetail[]>(
        queryKey,
        old =>
          old?.map(pr =>
            pr.id === mutationProps.prParams.id
              ? { ...pr, quantity: mutationProps.formValues.quantity }
              : pr,
          ) ?? [],
      );
      return { previousPrs };
    },
    onSuccess: () => {
      toast.success('Production Request quantity updated');
    },
    onError: (error, _variables, context) => {
      if (context?.previousPrs)
        queryClient.setQueryData(queryKey, context.previousPrs);

      const message =
        error instanceof Object && 'message' in error
          ? String(error.message)
          : 'Production Request update failed, try again later';
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: InventoryFactory.all });
      queryClient.invalidateQueries({ queryKey: StockFactory.all });
    },
  });
}
