import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/rooms">Quartos</Link></li>
          <li><Link to="/reservations">Reservas</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
