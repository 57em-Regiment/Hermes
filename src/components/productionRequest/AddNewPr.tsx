import { useAddProductionRequestMutation } from '@/features/productionRequests/useAddProductionRequest.mutation';
import { useGetProductionRequestsQuery } from '@/features/productionRequests/useGetProductionRequests.query';
import { useHasPermission } from '@57eme-regiment/auth-browser';
import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import type { Item } from '@57eme-regiment/krang-api-contract';
import {
  Button,
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
  createProductionRequestSchema,
  type CreateProductionRequest,
  type Inventory,
} from '@57eme-regiment/renenutet-api-contract';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { InventoryAutocompleteSelect } from '../inventory/InventoryAutocompleteSelect';
import { ItemAutocompleteSelect } from '../item/ItemAutocompleteSelect';

export function AddNewPr() {
  const { t } = useTranslation();
  const userCanCreate = useHasPermission(PERMISSIONS.STOCK_ITEM_READ); //TODO HERMES_PRODUCTIONREQUEST_CREATE
  const [open, setOpen] = useState(false);

  const { data: prs } = useGetProductionRequestsQuery();

  const { handleSubmit, control, reset, formState } =
    useForm<CreateProductionRequest>({
      resolver: zodResolver(createProductionRequestSchema),
      defaultValues: {
        quantity: 100,
      },
    });
  const [prMaxQuantity, setItemMaxQuantity] = useState(100);

  const onItemSelected =
    (fieldOnChange: (id: string | undefined) => void) =>
    (item: Item | null) => {
      fieldOnChange(item?.id);
      setItemMaxQuantity(item?.maxQuantity ?? 100);
    };
  const onInventorySelected =
    (fieldOnChange: (id: string | undefined) => void) =>
    (inventory: Inventory | null) => {
      fieldOnChange(inventory?.id);
    };

  const { mutateAsync } = useAddProductionRequestMutation();

  const onSubmit = async (formValues: CreateProductionRequest) => {
    await mutateAsync({ formValues });
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
        <DialogTrigger>
          <Button>{t('Components.AddNewPr.triggerLabel')}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Components.AddNewPr.title')}</DialogTitle>
            <DialogDescription className="wrap-normal w-full">
              <Typography>{t('Components.AddNewPr.description')}</Typography>
            </DialogDescription>
          </DialogHeader>
          <form id="createProductionRequest" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={control}
                name="itemId"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>{t('Components.AddNewPr.itemLabel')}</FieldLabel>
                    <ItemAutocompleteSelect
                      {...field}
                      onSelected={onItemSelected(field.onChange)}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="inventoryId"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>{t('Components.AddNewPr.inventoryLabel')}</FieldLabel>
                    <InventoryAutocompleteSelect
                      {...field}
                      onSelected={onInventorySelected(field.onChange)}
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
                    <FieldLabel>{t('Components.AddNewPr.quantityLabel')}</FieldLabel>
                    <Input
                      {...field}
                      disabled={
                        formState.isSubmitting || !formState.dirtyFields.itemId
                      }
                      type="number"
                      min={1}
                      max={prMaxQuantity}
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
              <Button variant="outline">{t('Components.AddNewPr.cancelButton')}</Button>
            </DialogClose>
            <Button
              disabled={!formState.isValid}
              form="createProductionRequest"
              type="submit"
              className="bg-primary hover:bg-primary/90">
              {t('Components.AddNewPr.submitButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}
