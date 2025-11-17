import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        <main>
          <h1>Dashboard</h1>
          <p>Bem-vindo ao Hostmaster</p>
        </main>
      </div>
    </div>
  );
}
