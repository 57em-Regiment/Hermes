import { contract } from '@57eme-regiment/renenutet-api-contract';
import { stockContract } from '@57eme-regiment/renenutet-api-contract/dist/contracts/stock.contract';
import { initClient } from '@ts-rest/core';

export const inventoryApi = initClient(contract, {
  baseUrl: import.meta.env.VITE_RENENUTET_SERVICE_URL,
});
export const stockApi = initClient(stockContract, {
  baseUrl: import.meta.env.VITE_RENENUTET_SERVICE_URL,
});
