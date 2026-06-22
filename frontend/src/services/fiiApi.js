// fiiApi.js — CRUD de Fundos Imobiliários (FIIs)

import apiClient from './apiClient';

export const fiiApi = {
  /** Lista os FIIs cadastrados com paginação. */
  listFiis: (page = 0, size = 50) => {
    return apiClient.get('/fiis/lists', { params: { page, size } });
  },

  /** Cadastra um novo FII. */
  createFii: (code, type) => {
    return apiClient.post('/fiis/creates', { code, type });
  },

  /** Atualiza os dados de um FII existente. */
  updateFii: (id, code, type) => {
    return apiClient.put(`/fiis/updates/${id}`, { code, type });
  },

  /** Remove um FII (e suas transações/rendimentos em cascata). */
  deleteFii: (id) => {
    return apiClient.delete(`/fiis/deletes/${id}`);
  },
};
