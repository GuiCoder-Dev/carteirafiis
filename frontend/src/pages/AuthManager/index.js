import React, { useState } from 'react';
import { authApi } from '../../services/authApi';

const EMAIL_SEND_ERRORS = [
  'failed to send verification email',
  'falha ao enviar email',
  'unable to send email',
  'error sending email',
  'mail',
  'smtp',
];

const isEmailSendError = (message = '') =>
  EMAIL_SEND_ERRORS.some((keyword) =>
    message.toLowerCase().includes(keyword)
  );


const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function AuthManager({ onAuthSuccess, addToast }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await authApi.login(email, password);
        addToast('Login realizado com sucesso!', 'success');
        onAuthSuccess();

      } else if (mode === 'register') {
        try {
          await authApi.register(name, email, password);
          addToast('Cadastro realizado! Verifique seu e-mail para obter o código.', 'success');
        } catch (registerErr) {

          if (isEmailSendError(registerErr.message)) {
            addToast(
              'Conta criada! O envio do e-mail de verificação falhou — contacte o suporte ou tente reenviar o código.',
              'warning'
            );
          } else {

            throw registerErr;
          }
        }
        setMode('verify');

      } else if (mode === 'verify') {
        await authApi.verifyEmail(email, verificationCode);
        addToast('E-mail verificado com sucesso! Por favor, faça login.', 'success');
        setMode('login');
        setPassword('');
        setVerificationCode('');
        setShowPassword(false);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro no processamento.');
      addToast(err.message || 'Falha no processamento.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setLoading(true);
    try {
      await authApi.resendCode(email);
      addToast('Código de verificação reenviado!', 'success');
    } catch (err) {

      if (isEmailSendError(err.message)) {
        addToast('Falha ao reenviar o código — verifique as configurações de e-mail do servidor.', 'warning');
      } else {
        setError(err.message || 'Falha ao reenviar código.');
        addToast(err.message || 'Erro ao reenviar código.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setShowPassword(false);
  };


  const eyeBtnStyle = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--txt-secondary)',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    borderRadius: '4px',
    transition: 'color 0.2s',
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 800,
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
            }}>
              $
            </span>
          </div>
          <h1 className="auth-title">
            {mode === 'login' && 'Bem-vindo de volta'}
            {mode === 'register' && 'Criar sua conta'}
            {mode === 'verify' && 'Verificar E-mail'}
          </h1>
          <p className="auth-subtitle">
            {mode === 'login' && 'Acesse sua carteira de fundos imobiliários'}
            {mode === 'register' && 'Cadastre-se para começar a controlar seus FIIs'}
            {mode === 'verify' && `Enviamos um código de verificação para ${email}`}
          </p>
        </div>

        {/* Banner de erro */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '0.85rem',
            color: '#fb7185',
            marginBottom: '1.25rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Campo Nome — somente no cadastro */}
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-name">Nome Completo</label>
              <input
                id="auth-name"
                type="text"
                className="form-control"
                placeholder="Ex: Igor Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Campos Email + Senha — login e cadastro */}
          {mode !== 'verify' && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="auth-email">E-mail</label>
                <input
                  id="auth-email"
                  type="email"
                  className="form-control"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-password">Senha</label>
                { }
                <div style={{ position: 'relative' }}>
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: '42px' }}
                    required
                  />
                  <button
                    type="button"
                    style={eyeBtnStyle}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            </>
          )}

          { }
          {mode === 'verify' && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-code">Código de Verificação</label>
              <input
                id="auth-code"
                type="text"
                className="form-control"
                placeholder="Digite o código recebido por e-mail"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                autoComplete="one-time-code"
                inputMode="numeric"
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--txt-muted)', marginTop: '4px', display: 'block' }}>
                Verifique sua caixa de entrada e pasta de spam.
              </span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Processando...' : (
              mode === 'login' ? 'Entrar' :
                mode === 'register' ? 'Criar Conta' :
                  'Confirmar Código'
            )}
          </button>
        </form>

        { }
        {mode === 'verify' && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              onClick={handleResendCode}
              className="btn btn-secondary btn-sm"
              disabled={loading}
            >
              Reenviar Código
            </button>
          </div>
        )}

        { }
        <div className="auth-footer">
          {mode === 'login' ? (
            <p>
              Não tem uma conta?{' '}
              <span className="auth-link" onClick={() => switchMode('register')}>
                Cadastre-se
              </span>
            </p>
          ) : (
            <p>
              Já tem uma conta?{' '}
              <span className="auth-link" onClick={() => switchMode('login')}>
                Faça login
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
