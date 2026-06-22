// transactionApi.js — CRUD de Transações (compras e vendas de cotas)

import apiClient from './apiClient';

export const transactionApi = {
  /** Lista as transações com paginação. */
  listTransactions: (page = 0, size = 50) => {
    return apiClient.get('/transactions/lists', { params: { page, size } });
  },

  /** Registra uma nova transação de compra ou venda. */
  createTransaction: (fii_id, quantity, unitPrice, date, type) => {
    return apiClient.post('/transactions/create', {
      fii_id:    parseInt(fii_id),
      quantity:  parseInt(quantity),
      unitPrice: parseFloat(unitPrice),
      date,
      type,
    });
  },

  /** Remove uma transação pelo ID. */
  deleteTransaction: (id) => {
    return apiClient.delete(`/transactions/delete/${id}`);
  },
};
