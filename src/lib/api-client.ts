import { contract } from '@57eme-regiment/renenutet-api-contract';
import { initClient } from '@ts-rest/core';

export const inventoryApi = initClient(contract, {
  baseUrl: import.meta.env.VITE_RENENUTET_SERVICE_URL,
  credentials: 'include',
});
export const stockApi = initClient(contract.stock, {
  baseUrl: import.meta.env.VITE_RENENUTET_SERVICE_URL,
  credentials: 'include',
});
