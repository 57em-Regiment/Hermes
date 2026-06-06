/* eslint-disable react-refresh/only-export-components */
import { InventoryHeader } from '@/components/inventory/InventoryHeader';
import { StockGrid } from '@/components/stock/stockGrid';
import { useInventoryDetailsQuery } from '@/features/inventory/useInventoryDetails.query';
import { useGetStockByInventoryId } from '@/hooks/useGetStockByInventoryId';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/inventory/$id')({
  component: StockView,
});

function StockView() {
  const { id: inventoryId } = Route.useParams();

  const { data: stocks } = useGetStockByInventoryId(inventoryId);
  const { data: inventory } = useInventoryDetailsQuery(inventoryId);

  if (!stocks) return null;

  if (!inventory) return <div>toto</div>;

  return (
    <div className="space-y-4">
      <InventoryHeader inventory={inventory} stockLen={stocks.length} />
      <StockGrid stocks={stocks} />
    </div>
  );
}
