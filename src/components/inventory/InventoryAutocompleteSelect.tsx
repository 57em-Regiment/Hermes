import { useInventoriesQuery } from '@/features/inventory/useInventoriesQuery';
import type { Inventory } from '@57eme-regiment/renenutet-api-contract';
import { cn } from '@57eme-regiment/nabu-ui';
import { Combobox } from '@base-ui/react/combobox';
import {
  CheckIcon,
  ChevronsUpDownIcon,
  LoaderCircleIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type InventoryAutocompleteSelectProps = {
  value?: string;
  onSelected?: (inventory: Inventory | null) => void;
  disabled?: boolean;
  readOnly?: boolean;
  excludeInventoryIds?: string[];
  placeholder?: string;
};

export const InventoryAutocompleteSelect = ({
  value,
  onSelected,
  disabled = false,
  readOnly = false,
  excludeInventoryIds = [],
  placeholder,
}: InventoryAutocompleteSelectProps) => {
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder ?? t('Components.InventoryAutocompleteSelect.placeholder');
  const [inputValue, setInputValue] = useState('');
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);

  const { data: inventories = [], isLoading, isFetching } = useInventoriesQuery();

  const filteredInventories = inventories.filter(
    inv =>
      !excludeInventoryIds.includes(inv.id) &&
      inv.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const isDisabled = disabled || readOnly;
  const showSpinner = isLoading || isFetching;
  const comboboxValue = selectedInventory?.id === value ? selectedInventory : null;

  return (
    <Combobox.Root<Inventory>
      value={comboboxValue}
      onValueChange={item => {
        const resolved = item ?? null;
        setSelectedInventory(resolved);
        onSelected?.(resolved);
        setInputValue(resolved?.name ?? '');
      }}
      disabled={isDisabled}
      filter={null}
      itemToStringLabel={item => item?.name ?? ''}
      itemToStringValue={item => item?.id ?? ''}
      isItemEqualToValue={(a, b) => a.id === b.id}>
      <Combobox.InputGroup
        className={cn(
          'flex h-8 w-full items-center gap-1 rounded-lg border border-input bg-transparent pl-2.5 pr-2 text-sm transition-colors',
          'focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
          isDisabled && 'cursor-not-allowed opacity-50',
          readOnly && 'bg-muted',
        )}>
        <Combobox.Input
          placeholder={resolvedPlaceholder}
          readOnly={readOnly}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
        {showSpinner ? (
          <LoaderCircleIcon className="size-4 shrink-0 animate-spin text-muted-foreground" />
        ) : (
          <Combobox.Trigger
            disabled={isDisabled}
            className="flex items-center disabled:cursor-not-allowed">
            <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground" />
          </Combobox.Trigger>
        )}
      </Combobox.InputGroup>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4} className="isolate z-50">
          <Combobox.Popup className="w-(--anchor-width) max-h-60 overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 origin-(--transform-origin) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 duration-100">
            <Combobox.List className="p-1">
              {!inventories.length && !showSpinner && (
                <Combobox.Empty className="py-6 text-center text-sm text-muted-foreground">
                  {t('Components.InventoryAutocompleteSelect.notFound')}
                </Combobox.Empty>
              )}
              {filteredInventories.map(inventory => (
                <Combobox.Item
                  key={inventory.id}
                  value={inventory}
                  className="relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pl-1.5 pr-8 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50">
                  <Combobox.ItemIndicator
                    render={
                      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
                    }>
                    <CheckIcon className="size-4" />
                  </Combobox.ItemIndicator>
                  <span className="flex-1">{inventory.name}</span>
                </Combobox.Item>
              ))}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
};
