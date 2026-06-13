import { useInventoryDetailsQuery } from '@/features/inventory/useInventoryDetails.query';

type Props = { params: Record<string, string> };

export function InventoryBreadcrumbLabel({ params }: Props) {
  const { data } = useInventoryDetailsQuery(params.id);
  return <>{data?.name ?? params.id}</>;
}
