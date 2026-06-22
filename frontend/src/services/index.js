// services/index.js — Ponto único de entrada para todos os serviços de API
// Importe daqui para simplificar os imports nas páginas.

export { default as apiClient } from './apiClient';
export { authApi }       from './authApi';
export { fiiApi }        from './fiiApi';
export { transactionApi } from './transactionApi';
export { earningApi }    from './earningApi';
export { walletApi }     from './walletApi';

// Objeto `api` unificado — mantém compatibilidade com imports legados
import { authApi }        from './authApi';
import { fiiApi }         from './fiiApi';
import { transactionApi } from './transactionApi';
import { earningApi }     from './earningApi';
import { walletApi }      from './walletApi';

export const api = {
  ...authApi,
  ...fiiApi,
  ...transactionApi,
  ...earningApi,
  ...walletApi,
};
