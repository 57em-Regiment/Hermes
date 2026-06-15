import { useOptimisticIncrementStockMutation } from '@/features/stock/useOptimisticIncrementStock.mutation';
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
  Input,
  Typography,
} from '@57eme-regiment/nabu-ui';
import {
  updateStockSchema,
  type StockDetails,
  type UpdateStock,
} from '@57eme-regiment/renenutet-api-contract';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type IncrementItemStockProps = {
  item: StockDetails;
};

export const IncrementItemStock = ({ item }: IncrementItemStockProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const isDisabled = useMemo(
    () => item.quantity == item.item.maxQuantity,
    [item],
  );

  const maxIcrementValue = (item.item.maxQuantity ?? 100) - item.quantity;
  const { handleSubmit, control, reset, formState } = useForm<UpdateStock>({
    resolver: zodResolver(updateStockSchema),
    defaultValues: {
      quantity: maxIcrementValue > 10 ? 10 : maxIcrementValue,
    },
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const { mutateAsync } = useOptimisticIncrementStockMutation({ item });

  const onSubmit = async (formValues: UpdateStock) => {
    await mutateAsync(formValues);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({
          variant: 'outline',
          className:
            'text-green-600 border-green-200 hover:bg-green-50 dark:border-green-900 dark:hover:bg-green-900/30',
        })}
        disabled={isDisabled}>
        {t('dialog.add')}
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            {t('Components.IncrementItemStock.title', { name: item.item.name })}
          </DialogTitle>
          <DialogDescription className="wrap-normal w-full">
            <Typography>
              {t('dialog.add_description')} {item.quantity}
            </Typography>
          </DialogDescription>
        </DialogHeader>
        <form id="incrementStock" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={control}
              name="quantity"
              render={({ field, fieldState }) => (
                <Field>
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    max={maxIcrementValue}
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
            <Button variant="outline">{t('dialog.cancel')}</Button>
          </DialogClose>
          <Button
            disabled={!formState.isValid}
            form="incrementStock"
            type="submit"
            className="bg-primary hover:bg-primary/90">
            {t('dialog.confirm_add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
