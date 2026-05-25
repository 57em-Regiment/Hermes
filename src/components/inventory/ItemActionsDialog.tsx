import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useInventoryStore, type InventoryItem } from '@/store/inventory'

export function ItemActionsDialog({ item, stockId }: { item: InventoryItem, stockId: string }) {
  const [amount, setAmount] = useState(10)
  const updateQuantity = useInventoryStore(state => state.updateQuantity)

  return (
    <div className="flex items-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger className={buttonVariants({ variant: "outline", size: "sm", className: "h-8 text-green-600 border-green-200 hover:bg-green-50 dark:border-green-900 dark:hover:bg-green-900/30" })}>Add</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add {item.name} Stock</AlertDialogTitle>
            <AlertDialogDescription>
              How many units of {item.name} would you like to add?
              Currently at {item.quantity} / {item.maxCapacity}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(Number(e.target.value))}
              min={1}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => updateQuantity(stockId, item.id, amount)}>Confirm Add</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger className={buttonVariants({ variant: "outline", size: "sm", className: "h-8 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/30" })}>Remove</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {item.name} Stock</AlertDialogTitle>
            <AlertDialogDescription>
              How many units of {item.name} would you like to remove?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(Number(e.target.value))}
              min={1}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => updateQuantity(stockId, item.id, -amount)}>Confirm Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
