/* eslint-disable react-refresh/only-export-components */
import { AddInventoryDialog } from '@/components/inventory/addInventoryDialog';
import { InventoryMenu } from '@/components/inventory/InventoryMenu';
import { AllStockGrid } from '@/components/stock/allStockGrid';
import { useLanguage } from '@57eme-regiment/nabu-ui';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/')({
  component: Index,
});

function Index() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-8 pb-8 min-h-[calc(100vh-80px)]">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('nav.title')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('nav.select_stock')}</p>
        </div>
        <div className="flex">
          <AddInventoryDialog />
        </div>
      </div>

      <InventoryMenu />

      <div
        className="pt-4 border-t border-border flex flex-col space-y-4"
        style={{ height: '700px' }}>
        <div className="flex items-center justify-between shrink-0">
          <h2 className="text-2xl font-bold">
            {t('v1.all_items') || 'All Items'}
          </h2>
        </div>

        <div className="flex-1 min-h-0">
          <AllStockGrid />
        </div>
      </div>
    </div>
  );
}
