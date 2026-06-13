import { AddNewPr } from '@/components/productionRequest/AddNewPr';
import { ProductionRequestsGrid } from '@/components/productionRequest/ProductionRequestsGrid';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/productionRequests/')(
  {
    component: GlobalProductionRequestView,
  },
);

function GlobalProductionRequestView() {
  return (
    <div className="space-y-4">
      <AddNewPr />
      <ProductionRequestsGrid />
    </div>
  );
}
