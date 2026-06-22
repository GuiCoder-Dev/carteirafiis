

import axios from 'axios';

export const API_BASE_URL = "http://localhost:8080";


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('carteira_fii_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});


apiClient.interceptors.response.use(
  (response) => {

    if (response.status === 204) return null;
    return response.data;
  },
  async (error) => {

    if (!error.response) {
      return Promise.reject(
        new Error(`Servidor em ${API_BASE_URL} inacessível. Certifique-se de que o backend está rodando.`)
      );
    }

    const data = error.response?.data;


    const isAuthError =
      error.response.status === 401 ||
      (error.response.status === 403 &&
        (!data ||
          data.message === 'Forbidden' ||
          data.error === 'Forbidden' ||
          data.message === 'Access Denied'));

    if (isAuthError) {
      localStorage.removeItem('carteira_fii_token');
      localStorage.removeItem('carteira_fii_user');
      window.dispatchEvent(new Event('auth-change'));
    }


    let message =
      (typeof data === 'object' && (data?.message || data?.error)) ||
      (typeof data === 'string' && data) ||
      `HTTP ${error.response?.status}`;

    // Tradução amigável de mensagens comuns de erro do backend para o usuário
    if (message === 'earnings already registered for this FII on this date') {
      message = 'Já existe um provento registrado para este FII nesta data.';
    } else if (message === 'you do not have permission to create this transaction') {
      message = 'Você não tem permissão para criar esta transação.';
    } else if (message === 'you do not have permission to delete this transaction') {
      message = 'Você não tem permissão para excluir esta transação.';
    } else if (message === 'you do not have permission to create this earnings') {
      message = 'Você não tem permissão para criar este provento.';
    } else if (message === 'you do not have permission to update this earnings') {
      message = 'Você não tem permissão para atualizar este provento.';
    } else if (message === 'you do not have permission to delete this earnings') {
      message = 'Você não tem permissão para excluir este provento.';
    } else if (message === 'you do not have permission to update this FII') {
      message = 'Você não tem permissão para atualizar este FII.';
    } else if (message === 'you do not have permission to delete this FII') {
      message = 'Você não tem permissão para excluir este FII.';
    } else if (message === 'It is not possible to delete this purchase as it will leave the quantity negative.') {
      message = 'Não é possível excluir esta compra, pois a quantidade de cotas ficaria negativa.';
    } else if (message === 'Email already verified') {
      message = 'E-mail já verificado.';
    } else if (message === 'Verification code expired') {
      message = 'Código de verificação expirado.';
    } else if (message === 'Invalid verification code') {
      message = 'Código de verificação inválido.';
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
