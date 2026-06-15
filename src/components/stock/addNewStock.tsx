import { useGetStockByInventoryId } from '@/hooks/useGetStockByInventoryId';
import { stockApi } from '@/lib/api-client';
import { InventoryFactory } from '@/lib/tanstack/queryFactory';
import { useHasPermission } from '@57eme-regiment/auth-browser';
import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import type { Item } from '@57eme-regiment/krang-api-contract';
import {
  Button,
  buttonVariants,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Typography,
} from '@57eme-regiment/nabu-ui';
import {
  createStockSchema,
  type CreateStock,
} from '@57eme-regiment/renenutet-api-contract';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ItemAutocompleteSelect } from '../item/ItemAutocompleteSelect';

type AddNewStockDialogProps = {
  inventoryId: string;
};

export function AddNewStockDialog({ inventoryId }: AddNewStockDialogProps) {
  const userCanCreate = useHasPermission(PERMISSIONS.STOCK_ITEM_READ); //TODO HERMES_STOCKITEM_ADD
  const { data: stocks } = useGetStockByInventoryId(inventoryId);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const { handleSubmit, control, reset, formState } = useForm<CreateStock>({
    resolver: zodResolver(createStockSchema),
    defaultValues: {
      inventoryId,
      quantity: 1,
    },
  });
  const [itemMaxQuantity, setItemMaxQuantity] = useState(100);

  const onItemSelected =
    (fieldOnChange: (id: string | undefined) => void) =>
    (item: Item | null) => {
      fieldOnChange(item?.id);
      setItemMaxQuantity(item?.maxQuantity ?? 100);
    };

  const queryClient = useQueryClient();
  const queryKey = InventoryFactory.StockInInventory(inventoryId);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (formValues: CreateStock) => {
      const res = await stockApi.create({ body: formValues });
      if (res.status != 201)
        throw Error('Create Inventory failed', { cause: res });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
    },
    onError(error) {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onSuccess: () => {
      toast.success('Inventory Created');
    },
  });

  const onSubmit = async (formValues: CreateStock) => {
    await mutateAsync(formValues);
    reset();
    setOpen(false);
  };
  const onOpenChange = (open: boolean) => {
    reset();
    setOpen(open);
  };

  if (userCanCreate)
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger
          className={buttonVariants({
            variant: 'outline',
          })}>
          {t('Pages.Inventory.AddItemDialog.triggerLabel')}{' '}
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {t('Pages.Inventory.AddItemDialog.title')}
            </DialogTitle>
            <DialogDescription className="wrap-normal w-full">
              <Typography>
                {t('Pages.Inventory.AddItemDialog.description')}{' '}
              </Typography>
            </DialogDescription>
          </DialogHeader>
          <form id="incrementStock" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={control}
                name="itemId"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>{t('Pages.Inventory.item')}</FieldLabel>
                    <ItemAutocompleteSelect
                      {...field}
                      onSelected={onItemSelected(field.onChange)}
                      excludeItemIds={stocks?.map(i => i.itemId)}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="quantity"
                render={({ field, fieldState, formState }) => (
                  <Field>
                    <FieldLabel>{t('Pages.Inventory.quantity')}</FieldLabel>
                    <Input
                      {...field}
                      disabled={
                        formState.isSubmitting || !formState.dirtyFields.itemId
                      }
                      type="number"
                      min={1}
                      max={itemMaxQuantity}
                      onChange={e => field.onChange(e.target.valueAsNumber)}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline" loading={isPending}>
                {t('dialog.cancel')}
              </Button>
            </DialogClose>
            <Button
              disabled={!formState.isValid}
              loading={isPending}
              form="incrementStock"
              type="submit"
              className="bg-primary hover:bg-primary/90">
              {t('Pages.Inventory.AddItemDialog.saveAction')}{' '}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}
