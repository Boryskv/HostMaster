import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <h2>Hostmaster</h2>
      <div className="user-info">
        <span>{user?.name}</span>
        <button onClick={logout}>Sair</button>
      </div>
    </header>
  );
}
