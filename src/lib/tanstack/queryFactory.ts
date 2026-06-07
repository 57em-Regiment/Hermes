export const ItemFactory = {
  all: ['items'] as const,
} as const;

export const LocationFactory = {
  all: ['locations'] as const,
  Search: (query: string) => [...LocationFactory.all, query] as const,
  ById: (locationId: string) => [...LocationFactory.all, locationId] as const,
} as const;

export const StockFactory = {
  all: ['stocks'],
  ById: (stockId: string) => [...StockFactory.all, stockId],
} as const;
export const InventoryFactory = {
  all: ['inventories'],
  ById: (inventoryId: string) => [...InventoryFactory.all, inventoryId],
  StockInInventory: (inventoryId: string) => [
    ...InventoryFactory.ById(inventoryId),
    'stocks',
  ],
  CodeInventory: (inventoryId: string) => [
    ...InventoryFactory.ById(inventoryId),
    'Code',
  ],
} as const;
