// earningApi.js — CRUD de Proventos / Rendimentos recebidos

import apiClient from './apiClient';

export const earningApi = {
  /** Lista os proventos registrados com paginação. */
  listEarnings: (page = 0, size = 50) => {
    return apiClient.get('/earnings/lists', { params: { page, size } });
  },

  /** Registra um novo pagamento de provento. */
  createEarning: (fii_id, unitValuePayment, paymentDate) => {
    return apiClient.post('/earnings/payments', {
      fii_id:           parseInt(fii_id),
      unitValuePayment: parseFloat(unitValuePayment),
      paymentDate,
    });
  },

  /** Atualiza um lançamento de provento existente. */
  updateEarning: (id, unitValuePayment, paymentDate) => {
    return apiClient.put(`/earnings/updates/${id}`, {
      unitValuePayment: parseFloat(unitValuePayment),
      paymentDate,
    });
  },

  /** Remove um lançamento de provento pelo ID. */
  deleteEarning: (id) => {
    return apiClient.delete(`/earnings/delete/${id}`);
  },
};
