import { contract as krangContract } from '@57eme-regiment/krang-api-contract';
import { contract } from '@57eme-regiment/renenutet-api-contract';
import { initClient } from '@ts-rest/core';

export const inventoryApi = initClient(contract, {
  baseUrl: import.meta.env.VITE_RENENUTET_SERVICE_URL,
  credentials: 'include',
});
export const prApi = initClient(contract.productionRequests, {
  baseUrl: import.meta.env.VITE_RENENUTET_SERVICE_URL,
  credentials: 'include',
});
export const stockApi = initClient(contract.stock, {
  baseUrl: import.meta.env.VITE_RENENUTET_SERVICE_URL,
  credentials: 'include',
});
export const locationApi = initClient(contract.location, {
  baseUrl: import.meta.env.VITE_RENENUTET_SERVICE_URL,
  credentials: 'include',
});
export const krangItemApi = initClient(krangContract.item, {
  baseUrl: import.meta.env.VITE_KRANG_SERVICE_URL,
  credentials: 'include',
});
export const krangLocationApi = initClient(krangContract.location, {
  baseUrl: import.meta.env.VITE_KRANG_SERVICE_URL,
  credentials: 'include',
});
