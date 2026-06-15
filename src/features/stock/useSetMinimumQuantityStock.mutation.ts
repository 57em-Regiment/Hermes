import { stockApi } from '@/lib/api-client';
import { InventoryFactory } from '@/lib/tanstack/queryFactory';
import type {
  StockDetails,
  UpdateMinimumQuantity,
} from '@57eme-regiment/renenutet-api-contract';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type useSetMinimumQuantityStockMutationProps = {
  item: StockDetails;
};

export const useSetMinimumQuantityStockMutation = ({
  item,
}: useSetMinimumQuantityStockMutationProps) => {
  const queryClient = useQueryClient();
  const queryKey = InventoryFactory.StockInInventory(item.inventoryId);

  return useMutation({
    mutationFn: async (formValues: UpdateMinimumQuantity) =>
      await stockApi.updateMinimumQuantity({
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
              ? { ...stock, minimumQuantity: newData.minimumQuantity }
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
