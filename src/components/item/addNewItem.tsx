import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LINKS } from '@/features/navigation/links';
import { inventoryApi } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { useHasPermission } from '@57eme-regiment/auth-browser';
import { PERMISSIONS } from '@57eme-regiment/auth-contracts';
import {
  createInventorySchema,
  type CreateInventory,
} from '@57eme-regiment/renenutet-api-contract';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState, type PropsWithChildren } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type AddItemDialog = PropsWithChildren<{
  className?: string;
}>;

export function AddItemDialog({ children, className }: AddItemDialog) {
  const userCanCreate = useHasPermission(PERMISSIONS.STOCK_ITEM_READ); //TODO HERMES_ITEM_ADD
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { handleSubmit, control, reset } = useForm<CreateInventory>({
    resolver: zodResolver(createInventorySchema),
    defaultValues: {
      ownerId: '2586bc5b-40e8-4770-80b1-547ed2c1a918',
      locationId: '756e686f-c2ba-42c6-9db0-7e9d0487c843',
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
      navigate({ to: LINKS.Inventory.detail.to, params: { id } });
    },
  });

  const onSubmit = async (formValues: CreateInventory) => {
    await mutateAsync(formValues);
  };

  if (userCanCreate)
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger className={cn(className)} onClick={() => setOpen(true)}>
          {children ? children : <Button>Add Item</Button>}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add item</DialogTitle>
            <DialogDescription>
              Add items that are not already in the stock
            </DialogDescription>
          </DialogHeader>

          <form id="createInventoryForm" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
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
