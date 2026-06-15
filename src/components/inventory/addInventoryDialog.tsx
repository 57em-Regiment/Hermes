import { useCreateInventoryMutation } from '@/features/inventory/useCreateInventory.mutation';
import { useAccess, useHasPermission } from '@57eme-regiment/auth-browser';
import { PERMISSIONS, type User } from '@57eme-regiment/auth-contracts';
import type { LocationNames } from '@57eme-regiment/krang-api-contract';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  UserAutocompleteSelect,
} from '@57eme-regiment/nabu-ui';
import {
  createInventorySchema,
  type CreateInventory,
} from '@57eme-regiment/renenutet-api-contract';
import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LocationAutocompleteSelect } from '../location/LocationAutocompleteSelect';

export function AddInventoryDialog() {
  const { t } = useTranslation();
  const { access } = useAccess();
  const [open, setOpen] = useState(false);

  const { handleSubmit, control, reset, formState } = useForm<CreateInventory>({
    resolver: zodResolver(createInventorySchema),
    defaultValues: {
      ownerId: access?.user.id,
    },
  });

  const onOpenChange = (isOpen: boolean) => {
    reset();
    setOpen(isOpen);
  };

  const { mutateAsync, isSuccess, isPending } = useCreateInventoryMutation();

  const onLocationSelectd =
    (fieldOnChange: (id: string | undefined) => void) =>
    (location: LocationNames | null) => {
      fieldOnChange(location?.id);
    };
  const onOwnerSelectd =
    (fieldOnChange: (id: string | undefined) => void) =>
    (user: User | null) => {
      fieldOnChange(user?.id);
    };

  const onSubmit = async (formValues: CreateInventory) => {
    await mutateAsync({
      ...formValues,
      ownerId: formValues.ownerId || access?.user.id,
    });
    if (isSuccess) setOpen(false);
  };

  if (!useHasPermission(PERMISSIONS.STOCK_INVENTORY_CREATE)) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger onClick={() => setOpen(true)}>
        <Button>{t('Components.AddInventory.triggerLabel')}</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t('Components.AddInventory.title')}</DialogTitle>
        </DialogHeader>

        <form id="createInventoryForm" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={control}
              name="ownerId"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    {t('Components.AddInventory.ownerLabel')}
                  </FieldLabel>
                  <UserAutocompleteSelect
                    {...field}
                    defaultValue={access?.user.id}
                    onSelected={onOwnerSelectd(field.onChange)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="locationId"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    {t('Components.AddInventory.locationLabel')}
                  </FieldLabel>
                  <LocationAutocompleteSelect
                    {...field}
                    onSelected={onLocationSelectd(field.onChange)}
                    filterType={['STORAGE', 'SPAWN_STORAGE']}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    {t('Components.AddInventory.nameLabel')}
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder={t('Components.AddInventory.namePlaceholder')}
                    disabled={!formState.dirtyFields.locationId}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="accessCode"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    {t('Components.AddInventory.accessCodeLabel')}
                  </FieldLabel>
                  <InputOTP
                    {...field}
                    maxLength={6}
                    minLength={6}
                    required
                    pattern={REGEXP_ONLY_DIGITS}
                    disabled={!formState.dirtyFields.name}>
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
                  <FieldDescription>
                    {t('Components.AddInventory.accessCodeDescription')}
                  </FieldDescription>
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose>
            <Button variant="destructive" loading={isPending}>
              {t('Components.AddInventory.cancelButton')}
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="createInventoryForm"
            loading={isPending}
            disabled={!formState.isValid || !formState.dirtyFields.accessCode}>
            {t('Components.AddInventory.submitButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
