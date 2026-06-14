/* eslint-disable react-refresh/only-export-components */
import { AddInventoryDialog } from '@/components/inventory/addInventoryDialog';
import { InventoryMenu } from '@/components/inventory/InventoryMenu';
import { AllStockGrid } from '@/components/stock/allStockGrid';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/')({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start">
        <AddInventoryDialog />
      </div>

      <InventoryMenu />

      <AllStockGrid />
    </div>
  );
}
