import { useOptimisticDecrementStockMutation } from '@/features/stock/useOptimisticDecrementStock.mutation';
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
  useLanguage,
} from '@57eme-regiment/nabu-ui';
import {
  updateStockSchema,
  type StockDetails,
  type UpdateStock,
} from '@57eme-regiment/renenutet-api-contract';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

type DecrementItemStockProps = {
  item: StockDetails;
};

export const DecrementItemStock = ({ item }: DecrementItemStockProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const isDisabled = useMemo(() => item.quantity == 0, [item]);

  const { handleSubmit, control, reset } = useForm<UpdateStock>({
    resolver: zodResolver(updateStockSchema),
    defaultValues: {
      quantity: item.quantity < 10 ? item.quantity : 10,
    },
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const { mutateAsync } = useOptimisticDecrementStockMutation({ item });

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
            'text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/30',
        })}
        disabled={isDisabled}>
        {t('dialog.remove')}
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Decrement quantity for — {item.item.name}</DialogTitle>
          <DialogDescription className="wrap-normal w-full">
            <Typography>{t('dialog.remove_description')}</Typography>
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
                    max={item.quantity}
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
            form="incrementStock"
            type="submit"
            className="bg-primary hover:bg-primary/90">
            {t('dialog.confirm_remove')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
