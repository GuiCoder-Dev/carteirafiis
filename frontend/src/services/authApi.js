// authApi.js — Autenticação e gerenciamento de usuário

import apiClient from './apiClient';

export const authApi = {
  /** Realiza o login e armazena o token JWT no localStorage. */
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response?.token) {
      localStorage.setItem('carteira_fii_token', response.token);
      localStorage.setItem('carteira_fii_user', JSON.stringify({ email }));
      window.dispatchEvent(new Event('auth-change'));
    }
    return response;
  },

  /** Cria um novo usuário. */
  register: async (name, email, password) => {
    return apiClient.post('/users/creates', { name, email, password });
  },

  /** Verifica o e-mail com o código enviado. */
  verifyEmail: async (email, verificationCode) => {
    return apiClient.post('/users/verify-email', { email, code: verificationCode });
  },

  /** Reenvia o código de verificação. */
  resendCode: async (email) => {
    return apiClient.post('/users/resend-code', { email });
  },

  /** Encerra a sessão do usuário. */
  logout: () => {
    localStorage.removeItem('carteira_fii_token');
    localStorage.removeItem('carteira_fii_user');
    window.dispatchEvent(new Event('auth-change'));
  },

  /** Retorna os dados do usuário logado ou null. */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('carteira_fii_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /** Verifica se o usuário está autenticado. */
  isAuthenticated: () => {
    return !!localStorage.getItem('carteira_fii_token');
  },
};
