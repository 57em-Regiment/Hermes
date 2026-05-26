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
} from '@/components/ui/alert-dialog'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useInventoryStore } from '@/store/inventory'
import { useLanguage } from '@/components/language-provider'
import type { InventoryItem } from '@/types/inventory'

interface ItemActionsDialogProps {
  item: InventoryItem
  stockId: string
}

export function ItemActionsDialog({ item, stockId }: ItemActionsDialogProps) {
  const [amount, setAmount] = useState(10)
  const updateQuantity = useInventoryStore(state => state.updateQuantity)
  const { t } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger
          className={buttonVariants({
            variant: 'outline',
            size: 'sm',
            className: 'h-8 text-green-600 border-green-200 hover:bg-green-50 dark:border-green-900 dark:hover:bg-green-900/30',
          })}
        >
          {t('dialog.add')}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dialog.add')} — {item.name}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dialog.add_description')} {item.quantity.toLocaleString()} / {item.maxCapacity.toLocaleString()}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="number"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              min={1}
              max={item.maxCapacity - item.quantity}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => updateQuantity(stockId, item.id, amount)}>
              {t('dialog.confirm_add')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger
          className={buttonVariants({
            variant: 'outline',
            size: 'sm',
            className: 'h-8 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/30',
          })}
        >
          {t('dialog.remove')}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dialog.remove')} — {item.name}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dialog.remove_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="number"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              min={1}
              max={item.quantity}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => updateQuantity(stockId, item.id, -amount)}
            >
              {t('dialog.confirm_remove')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
