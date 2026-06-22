// walletApi.js — Posições consolidadas da carteira

import apiClient from './apiClient';

export const walletApi = {
  /**
   * Retorna as posições abertas da carteira.
   * @param {string} [month] — Mês de referência no formato 'yyyy-MM'
   */
  getWalletPosition: (month) => {
    const params = month ? { month } : {};
    return apiClient.get('/wallets/position', { params });
  },

  /**
   * Retorna a visão completa da carteira com proventos consolidados.
   * @param {string} [month] — Mês de referência no formato 'yyyy-MM'
   */
  getWalletAll: (month) => {
    const activeMonth = month || new Date().toISOString().slice(0, 7);
    return apiClient.get('/wallets/all', { params: { month: activeMonth } });
  },
};
