import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { inventoryApi } from '@/lib/api-client';
import { useHasPermission } from '@57eme-regiment/auth-browser';
import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import {
  createInventorySchema,
  type CreateInventory,
} from '@57eme-regiment/renenutet-api-contract';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useState, type PropsWithChildren } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type InventoryDialog = PropsWithChildren;

const routeApi = getRouteApi('/');

export function InventoryDialog({ children }: InventoryDialog) {
  const userCanCreate = useHasPermission(PERMISSIONS.STOCK_INVENTORY_CREATE);
  const [open, setOpen] = useState(false);
  const { handleSubmit, control, reset } = useForm<CreateInventory>({
    resolver: zodResolver(createInventorySchema),
    defaultValues: {
      ownerId: '2586bc5b-40e8-4770-80b1-547ed2c1a918',
      locationId: '007fead1-fd8f-4ae8-a2c7-482df0b7cd12',
    },
  });

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) reset();
    setOpen(isOpen);
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (formValues: CreateInventory) => {
      console.log('🚀 ~ InventoryDialog ~ formValues:', formValues);
      const res = await inventoryApi.inventory.create({ body: formValues });
      if (res.status != 201)
        throw Error('Create Inventory failed', { cause: res });

      return res.body;
    },
    onError(error) {
      console.error('🚀 ~ InventoryDialog ~ error:', error);
      toast.error(error.message);
    },
    onSuccess({ id }) {
      toast.success('Inventory Created');
      setOpen(false);
      //TODO check pk le redirect ne fonctionne pas
      routeApi.redirect({
        to: `/stock/$id`,
        params: { id },
      });
    },
  });

  const onSubmit = async (formValues: CreateInventory) => {
    await mutateAsync(formValues);
  };

  if (userCanCreate)
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger onClick={() => setOpen(true)}>
          {children ? children : <Button>Add Inventory</Button>}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Inventory</DialogTitle>
          </DialogHeader>

          <form id="createInventoryForm" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <h1>Inventory Defenition</h1>
              <Controller
                control={control}
                name="ownerId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Owner</FieldLabel>
                    <Input disabled {...field} value="Dercraker" />
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
                    <Input {...field} placeholder="Code like: 123456" />
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
            <FieldSeparator />
            <FieldGroup>
              <Controller //TODO: A voir comment on fait selectionner le locaiton. Je penssais a un autocomplete en mode googlemaps
                control={control}
                name="locationId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>location</FieldLabel>
                    <Input {...field} placeholder="Code like: 123456" />
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
              <Button variant="destructive">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="createInventoryForm">
              Add Inventory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}
