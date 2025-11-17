import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/hostmasterApi';
import './Login.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar conta');
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
          <h1>Criar Conta</h1>
          <p>Sistema de Gerenciamento Hoteleiro</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Digite a senha novamente"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>

          <div className="form-link">
            <p>
              Já tem uma conta? <Link to="/login">Entrar</Link>
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
