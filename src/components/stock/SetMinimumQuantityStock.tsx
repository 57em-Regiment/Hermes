import { useSetMinimumQuantityStockMutation } from '@/features/stock/useSetMinimumQuantityStock.mutation';
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
  updateMinimumQuantitySchema,
  type StockDetails,
  type UpdateMinimumQuantity,
} from '@57eme-regiment/renenutet-api-contract';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type SetMinimumQuantityStockProps = {
  item: StockDetails;
};

export const SetMinimumQuantityStock = ({
  item,
}: SetMinimumQuantityStockProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { handleSubmit, control, reset, formState } =
    useForm<UpdateMinimumQuantity>({
      resolver: zodResolver(updateMinimumQuantitySchema),
      defaultValues: {
        minimumQuantity: item.minimumQuantity ?? 0,
      },
    });

  useEffect(() => {
    if (open) reset({ minimumQuantity: item.minimumQuantity ?? 0 });
  }, [open, reset, item.minimumQuantity]);

  const { mutateAsync } = useSetMinimumQuantityStockMutation({ item });

  const onSubmit = async (formValues: UpdateMinimumQuantity) => {
    await mutateAsync(formValues);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({
          variant: 'outline',
        })}>
        {t('Components.SetMinimumQuantityStock.trigger')}
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            {t('Components.SetMinimumQuantityStock.title', {
              name: item.item.name,
            })}
          </DialogTitle>
          <DialogDescription className="wrap-normal w-full">
            <Typography>
              {t('Components.SetMinimumQuantityStock.description')}
            </Typography>
          </DialogDescription>
        </DialogHeader>
        <form id="setMinimumQuantity" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={control}
              name="minimumQuantity"
              render={({ field, fieldState }) => (
                <Field>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    value={field.value ?? ''}
                    onChange={e =>
                      field.onChange(
                        e.target.value === '' ? null : e.target.valueAsNumber,
                      )
                    }
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
            form="setMinimumQuantity"
            type="submit">
            {t('dialog.confirm_add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
