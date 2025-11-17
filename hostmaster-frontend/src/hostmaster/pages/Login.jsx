import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="8" fill="#2563eb"/>
              <path d="M14 18h20M14 24h20M14 30h12" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <h1>HostMaster</h1>
          <p>Sistema de Gerenciamento Hoteleiro</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="form-link">
            <p>
              Não tem uma conta? <Link to="/register">Criar conta</Link>
            </p>
          </div>
        </form>

        <div className="login-footer">
          <p>© 2024 HostMaster. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
