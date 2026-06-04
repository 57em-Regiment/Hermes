export const StockFactory = {
  all: ['stocks'],
  byId: (stockId: string) => [...StockFactory.all, stockId],
} as const;
export const InventoryFactory = {
  all: ['inventories'],
  byId: (inventoryId: string) => [...InventoryFactory.all, inventoryId],
  StockInInventory: (inventoryId: string) => [
    ...InventoryFactory.all,
    inventoryId,
    'stocks',
  ],
} as const;
