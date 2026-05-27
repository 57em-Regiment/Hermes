import { contract } from '@57eme-regiment/renenutet-api-contract';
import { stockContract } from '@57eme-regiment/renenutet-api-contract/dist/contracts/stock.contract';
import { initClient } from '@ts-rest/core';

const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:3001';

export const inventoryApi = initClient(contract, { baseUrl: BASE_URL });
export const stockApi = initClient(stockContract, { baseUrl: BASE_URL });
