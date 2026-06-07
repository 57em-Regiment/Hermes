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
import { LocationAutocompleteSelect } from '../LocationAutocompleteSelect';

export function AddInventoryDialog() {
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

  const { mutateAsync } = useCreateInventoryMutation();

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
  };

  if (!useHasPermission(PERMISSIONS.STOCK_INVENTORY_CREATE)) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger onClick={() => setOpen(true)}>
        <Button>Add Inventory</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Inventory</DialogTitle>
        </DialogHeader>

        <form id="createInventoryForm" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={control}
              name="ownerId"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Owner</FieldLabel>
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
                  <FieldLabel>Location</FieldLabel>
                  <LocationAutocompleteSelect
                    {...field}
                    onSelected={onLocationSelectd(field.onChange)}
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
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    {...field}
                    placeholder="New inventory name like : 57ème - 4"
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
                  <FieldLabel>Acces code</FieldLabel>
                  <InputOTP
                    {...field}
                    maxLength={6}
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
                    Code to unlock storage pickup
                  </FieldDescription>
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose>
            <Button variant="destructive">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            form="createInventoryForm"
            disabled={!formState.isValid}>
            Add Inventory
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
