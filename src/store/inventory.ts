import { create } from 'zustand'
import type { Stock } from '@/types/inventory'

type InventoryState = {
  stocks: Stock[]
  isLoaded: boolean
  error: string | null
  setStocks: (stocks: Stock[]) => void
  setError: (error: string) => void
  updateQuantity: (stockId: string, itemId: string, delta: number) => void
}

export const useInventoryStore = create<InventoryState>((set) => ({
  stocks: [],
  isLoaded: false,
  error: null,
  setStocks: (stocks) => set({ stocks, isLoaded: true, error: null }),
  setError: (error) => set({ error, isLoaded: true }),
  updateQuantity: (stockId, itemId, delta) =>
    set((state) => ({
      stocks: state.stocks.map((stock) => {
        if (stock.id !== stockId) return stock
        return {
          ...stock,
          items: stock.items.map((item) => {
            if (item.id !== itemId) return item
            const quantity = Math.max(0, Math.min(item.maxCapacity, item.quantity + delta))
            return { ...item, quantity, productionNeed: Math.max(0, item.demand - quantity) }
          }),
        }
      }),
    })),
}))
