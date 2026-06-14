import {
  useLocationByIdQuery,
  useLocationsQuery,
} from '@/features/location/useLocationsQuery';
import { useDebounce } from '@/hooks/useDebounce';
import type {
  LocationNames,
  LocationType,
} from '@57eme-regiment/krang-api-contract';
import { cn } from '@57eme-regiment/nabu-ui';
import { Combobox } from '@base-ui/react/combobox';
import {
  AnchorIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  LoaderCircleIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type LocationAutocompleteSelectProps = {
  value?: string;
  defaultValue?: string;
  onSelected?: (location: LocationNames | null) => void;
  disabled?: boolean;
  readOnly?: boolean;
  excludeLocationIds?: string[];
  placeholder?: string;
  filterType?: LocationType[];
};

const locationLabel = (loc: LocationNames) =>
  `${loc.region.name} · ${loc.town.name} · ${loc.type}`;

export const LocationAutocompleteSelect = ({
  value,
  defaultValue,
  onSelected,
  disabled = false,
  readOnly = false,
  excludeLocationIds = [],
  placeholder,
  filterType,
}: LocationAutocompleteSelectProps) => {
  const { t } = useTranslation();
  const resolvedPlaceholder =
    placeholder ?? t('Components.LocationAutocompleteSelect.placeholder');
  const [inputValue, setInputValue] = useState('');
  const [userPickedItem, setUserPickedItem] = useState<LocationNames | null>(
    null,
  );
  const [defaultInputApplied, setDefaultInputApplied] = useState(false);
  const debouncedSearch = useDebounce(inputValue, 300);

  const {
    data: locations = [],
    isLoading,
    isFetching,
  } = useLocationsQuery(debouncedSearch, filterType);

  const { data: defaultLocation } = useLocationByIdQuery(
    defaultValue && !userPickedItem ? defaultValue : undefined,
  );

  const selectedItem = userPickedItem ?? defaultLocation ?? null;

  if (defaultLocation && !defaultInputApplied && !userPickedItem) {
    setDefaultInputApplied(true);
    setInputValue(locationLabel(defaultLocation));
  }

  const isDisabled = disabled || readOnly;
  const showSpinner = isLoading || isFetching;
  const comboboxValue =
    value !== undefined
      ? selectedItem?.id === value
        ? selectedItem
        : null
      : selectedItem;

  return (
    <Combobox.Root<LocationNames>
      value={comboboxValue}
      onValueChange={item => {
        const resolved = item ?? null;
        setUserPickedItem(resolved);
        onSelected?.(resolved);
        setInputValue(resolved ? locationLabel(resolved) : '');
      }}
      disabled={isDisabled}
      filter={null}
      itemToStringLabel={item => (item ? locationLabel(item) : '')}
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
          <Combobox.Popup className="w-lg max-h-60 overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 origin-(--transform-origin) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 duration-100">
            <Combobox.List className="p-1">
              {debouncedSearch.length < 2 && (
                <Combobox.Empty className="py-6 text-center text-sm text-muted-foreground">
                  {t('Components.LocationAutocompleteSelect.minChars')}
                </Combobox.Empty>
              )}
              {debouncedSearch.length >= 2 && !locations.length && (
                <Combobox.Empty className="py-6 text-center text-sm text-muted-foreground">
                  {t('Components.LocationAutocompleteSelect.notFound')}
                </Combobox.Empty>
              )}
              {locations.map(location => (
                <Combobox.Item
                  key={location.id}
                  value={location}
                  disabled={excludeLocationIds.includes(location.id)}
                  className="relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pl-1.5 pr-8 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50">
                  <Combobox.ItemIndicator
                    render={
                      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
                    }>
                    <CheckIcon className="size-4" />
                  </Combobox.ItemIndicator>
                  {location.icon ? (
                    <img src={location.icon} className="size-6 object-cover" />
                  ) : (
                    <AnchorIcon className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="flex-1">
                    {location.region.name} · {location.town.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {location.type}
                  </span>
                </Combobox.Item>
              ))}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
};
