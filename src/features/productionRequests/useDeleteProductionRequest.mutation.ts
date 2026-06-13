import { prApi } from '@/lib/api-client';
import { ProductionRequestFactory } from '@/lib/tanstack/queryFactory';
import type { ProductionRequestDetail } from '@57eme-regiment/renenutet-api-contract';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type useDeleteProductionRequestMutation = {
  id: string;
};
export function useDeleteProductionRequestMutation({
  id,
}: useDeleteProductionRequestMutation) {
  const queryClient = useQueryClient();
  const queryKey = ProductionRequestFactory.all;

  return useMutation({
    mutationFn: async () => {
      const res = await prApi.delete({
        params: { id },
      });
      if (res.status !== 204) throw res.body;
      return res.body;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousPrs =
        queryClient.getQueryData<ProductionRequestDetail[]>(queryKey);
      queryClient.setQueryData<ProductionRequestDetail[]>(
        queryKey,
        old => old?.filter(pr => pr.id === id) ?? [],
      );
      return { previousPrs };
    },
    onSuccess: () => {
      toast.success('Production Request deleted');
    },
    onError: (error, _variables, context) => {
      if (context?.previousPrs)
        queryClient.setQueryData(queryKey, context.previousPrs);

      const message =
        error instanceof Object && 'message' in error
          ? String(error.message)
          : 'Production Request delete failed, try again later';
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
