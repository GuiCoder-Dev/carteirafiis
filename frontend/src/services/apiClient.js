// apiClient.js — Instância central do Axios
// Injeta token de autenticação e gerencia o modo offline automaticamente.

import axios from 'axios';

export const API_BASE_URL = "http://localhost:8080";

// Instância Axios configurada
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ──────────────────────────────────────────────────────
// Injeta o token JWT em todas as requisições autenticadas
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('carteira_fii_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ── Response Interceptor ─────────────────────────────────────────────────────
// Trata erros 401/403 e quedas de rede (fallback para mock offline)
apiClient.interceptors.response.use(
  (response) => {
    // Respostas 204 No Content retornam null
    if (response.status === 204) return null;
    return response.data;
  },
  async (error) => {
    // Erro de rede — backend offline
    if (!error.response) {
      return Promise.reject(
        new Error(`Servidor em ${API_BASE_URL} inacessível. Certifique-se de que o backend está rodando.`)
      );
    }

    const data = error.response?.data;

    // 401 / 403 — token inválido ou expirado
    // Desconecta apenas se for erro de auth real, não erro de validação/regra de negócio que o backend retorna como 403
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

    // Extrai mensagem de erro legível
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
