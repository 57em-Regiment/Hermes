import { useInventoryCodeMutation } from '@/features/inventory/useInventoryCode.mutation';
import { useAccess, useHasPermission } from '@57eme-regiment/auth-browser';
import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Typography,
} from '@57eme-regiment/nabu-ui';
import {
  updateInventoryCodeSchema,
  type InventoryDetails,
  type UpdateInventoryCode,
} from '@57eme-regiment/renenutet-api-contract';
import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type InventoryCodeDialogProps = {
  inventory: InventoryDetails;
};
export const UpdateInventoryCodeDialog = ({
  inventory,
}: InventoryCodeDialogProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const { mutateAsync, isPending } = useInventoryCodeMutation(inventory.id);
  const { handleSubmit, control, reset, formState } =
    useForm<UpdateInventoryCode>({
      resolver: zodResolver(updateInventoryCodeSchema),
    });

  const onSubmit = async (formValues: UpdateInventoryCode) => {
    await mutateAsync(formValues);
    setOpen(false);
    reset();
  };

  const onOpenChange = (open: boolean) => {
    if (open) return;
    reset();
  };
  const { access } = useAccess();
  //TODO : PERMISSIONS.STOCK_INVENTORY_CODE_UPDATE
  if (
    !useHasPermission(PERMISSIONS.STOCK_INVENTORY_CODE_READ) ||
    access?.user.id != inventory.ownerId
  )
    return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger
        className={buttonVariants({
          variant: 'outline',
        })}
        onClick={() => setOpen(true)}>
        {t('Components.UpdateInventoryCode.triggerLabel')}{' '}
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            {t('Pages.Inventory.AddItemDialog.triggerLabel')}
          </DialogTitle>
          <DialogDescription className="wrap-normal w-full">
            <Typography>
              {t('Components.UpdateInventoryCode.description')}{' '}
            </Typography>
          </DialogDescription>
        </DialogHeader>
        <form id="updateCodeStock" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={control}
              name="code"
              render={({ field, fieldState }) => (
                <Field>
                  <InputOTP
                    {...field}
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose onClick={() => setOpen(false)}>
            <Button loading={isPending} variant="outline">
              {t('dialog.close')}{' '}
            </Button>
          </DialogClose>
          <Button
            disabled={!formState.isValid}
            loading={isPending}
            type="submit"
            form="updateCodeStock">
            {t('Components.UpdateInventoryCode.saveAction')}{' '}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
