import { stockApi } from '@/lib/api-client';
import { InventoryFactory } from '@/lib/tanstack/queryFactory';
import type {
  StockDetails,
  UpdateStock,
} from '@57eme-regiment/renenutet-api-contract';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type useOptimisticDecrementStockMutationProps = {
  item: StockDetails;
};
export const useOptimisticDecrementStockMutation = ({
  item,
}: useOptimisticDecrementStockMutationProps) => {
  const queryClient = useQueryClient();
  const queryKey = InventoryFactory.StockInInventory(item.inventoryId);

  return useMutation({
    mutationFn: async (formValues: UpdateStock) =>
      await stockApi.decrement({
        params: {
          inventoryId: item.inventoryId,
          itemId: item.itemId,
        },
        body: formValues,
      }),
    onMutate: async newData => {
      await queryClient.cancelQueries({ queryKey });
      const previousStocks = queryClient.getQueryData<StockDetails[]>(queryKey);
      queryClient.setQueryData<StockDetails[]>(
        queryKey,
        old =>
          old?.map(stock =>
            stock.itemId === item.itemId
              ? { ...stock, quantity: stock.quantity - newData.quantity }
              : stock,
          ) ?? [],
      );
      return { previousStocks };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousStocks)
        queryClient.setQueryData(queryKey, context.previousStocks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
