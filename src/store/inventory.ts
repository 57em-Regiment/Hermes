import { create } from 'zustand'

export type InventoryItem = {
  id: string
  name: string
  icon: string
  quantity: number
  maxCapacity: number
  demand: number
  productionNeed: number
}

export type StockType = 'Depot' | 'Seaport'

export type Stock = {
  id: string
  name: string
  city: string
  type: StockType
  items: InventoryItem[]
}

type InventoryState = {
  stocks: Stock[]
  updateQuantity: (stockId: string, itemId: string, delta: number) => void
}

const ICONS = ['IconMountain', 'IconBox', 'IconServer', 'IconCpu', 'IconRadiation', 'IconDroplet', 'IconDeviceComputerCamera', 'IconBolt', 'IconFlask', 'IconStar']
const PREFIXES = ['Iron', 'Copper', 'Steel', 'Titanium', 'Uranium', 'Quantum', 'Plutonium', 'Gold', 'Silver', 'Bronze', 'Polymer', 'Diamond']
const SUFFIXES = ['Ore', 'Ingot', 'Plate', 'Microchip', 'Module', 'Component', 'Fuel', 'Wire', 'Gear', 'Tube']

const CITIES = ['New York', 'Rotterdam', 'Shanghai', 'Singapore', 'Dubai', 'Hamburg', 'Los Angeles']
const STOCK_NAMES = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Prime']

function generateItems(count: number): InventoryItem[] {
  return Array.from({ length: count }, (_, i) => {
    const name = `${PREFIXES[Math.floor(Math.random() * PREFIXES.length)]} ${SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)]}`
    const icon = ICONS[Math.floor(Math.random() * ICONS.length)]
    const maxCapacity = Math.floor(Math.random() * 90) * 100 + 1000 // 1000 to 9900
    const quantity = Math.floor(Math.random() * maxCapacity)
    const demand = Math.floor(Math.random() * (maxCapacity * 1.2)) // Sometimes demand outstrips capacity
    
    return {
      id: (i + 1).toString(),
      name,
      icon,
      quantity,
      maxCapacity,
      demand,
      productionNeed: Math.max(0, demand - quantity)
    }
  })
}

function generateStocks(): Stock[] {
  return CITIES.slice(0, 4).map((city, i) => ({
    id: (i + 1).toString(),
    name: `${STOCK_NAMES[i]} ${i % 2 === 0 ? 'Hub' : 'Base'}`,
    city,
    type: i % 2 === 0 ? 'Seaport' : 'Depot',
    items: generateItems(Math.floor(Math.random() * 50) + 100) // 100 to 150 items
  }))
}

export const useInventoryStore = create<InventoryState>((set) => ({
  stocks: generateStocks(),
  updateQuantity: (stockId, itemId, delta) => set((state) => ({
    stocks: state.stocks.map(stock => {
      if (stock.id === stockId) {
        return {
          ...stock,
          items: stock.items.map(item => {
            if (item.id === itemId) {
              const newQuantity = Math.max(0, Math.min(item.maxCapacity, item.quantity + delta))
              return {
                ...item,
                quantity: newQuantity,
                productionNeed: Math.max(0, item.demand - newQuantity)
              }
            }
            return item
          })
        }
      }
      return stock
    })
  }))
}))
