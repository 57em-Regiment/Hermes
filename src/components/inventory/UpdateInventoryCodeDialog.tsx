import { useInventoryCodeMutation } from '@/features/inventory/useInventoryCode.mutation';
import { useHasPermission } from '@57eme-regiment/auth-browser';
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
  Typography,
} from '@57eme-regiment/nabu-ui';
import {
  updateInventorySchema,
  type UpdateInventory,
} from '@57eme-regiment/renenutet-api-contract';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

type InventoryCodeDialogProps = {
  inventoryId: string;
};
export const UpdateInventoryCodeDialog = ({
  inventoryId,
}: InventoryCodeDialogProps) => {
  const useCanViewCode = useHasPermission(
    PERMISSIONS.STOCK_INVENTORY_CODE_READ,
  );

  const { data, mutateAsync } = useInventoryCodeMutation(inventoryId);
  const { handleSubmit, control, reset } = useForm<UpdateInventory>({
    resolver: zodResolver(updateInventorySchema),
    defaultValues: {
      name: data?.body,
      locationId: data?.body,
      ownerId: data?.body,
    },
  });

  if (!useCanViewCode) return null;
  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({
          variant: 'outline',
        })}>
        update inventory code
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>update inventory code</DialogTitle>
          <DialogDescription className="wrap-normal w-full">
            <Typography>
              This code is sensitive and should not be shared with everyone.
            </Typography>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          {/* <ButtonGroup>
              <Input value={data.code ?? 'No code'} />
              <Button></Button>
            </ButtonGroup> */}
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
