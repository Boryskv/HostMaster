import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getReservations, getRooms } from '../services/hostmasterApi';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadReservations(), loadRooms()]);
  };

  const loadReservations = async () => {
    try {
      const data = await getReservations();
      setReservations(data || []);
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
      setReservations([]);
    }
  };

  const loadRooms = async () => {
    try {
      const data = await getRooms();
      console.log('Quartos carregados no Dashboard:', data);
      setRooms(data || []);
    } catch (error) {
      console.error('Erro ao carregar quartos:', error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    // 1. Total de Quartos cadastrados
    const totalRooms = rooms.length;
    
    // 2. Total de Reservas (todas as reservas existentes)
    const totalReservations = reservations.length;
    
    // 3. Check-ins para hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkInsToday = reservations.filter(r => {
      if (!r.checkIn) return false;
      const checkIn = new Date(r.checkIn + 'T00:00:00');
      checkIn.setHours(0, 0, 0, 0);
      return checkIn.getTime() === today.getTime() && r.status !== 'cancelled';
    }).length;
    
    // 4. Total a Receber (soma de todos os totalAmount das reservas)
    const totalToReceive = reservations.reduce((sum, reservation) => {
      const amount = Number(reservation.totalAmount) || 0;
      return sum + amount;
    }, 0);

    console.log('Stats Dashboard:', {
      totalRooms,
      totalReservations,
      checkInsToday,
      totalToReceive
    });

    return [
      { label: 'Reservas Ativas', value: totalReservations.toString(), icon: 'calendar' },
      { label: 'Total a Receber', value: `R$ ${totalToReceive.toFixed(2)}`, icon: 'money' },
      { label: 'Check-ins Hoje', value: checkInsToday.toString(), icon: 'check' },
      { label: 'Total de Quartos', value: totalRooms.toString(), icon: 'bed' },
    ];
  };

  const stats = calculateStats();

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pendente',
      'confirmed': 'Confirmada',
      'checked-in': 'Check-in',
      'checked-out': 'Check-out',
      'cancelled': 'Cancelada'
    };
    return labels[status] || status;
  };

  const getPaymentStatusLabel = (status) => {
    const labels = {
      'pending': 'Pendente',
      'partial': 'Sinal',
      'paid': 'Pago'
    };
    return labels[status] || status;
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 9h18M3 12h18M3 15h12" stroke="#240046" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          HostMaster
        </h1>
        <div className="user-section">
          <div className="user-info">
            <p className="user-name">{user?.name || 'Usuário'}</p>
            <p className="user-role">{user?.role || 'Administrador'}</p>
          </div>
          <button onClick={logout} className="logout-btn">
            Sair
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Bem-vindo de volta! 👋</h2>
          <p>Aqui está um resumo do seu hotel hoje</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                {stat.icon === 'bed' && (
                  <svg fill="none" viewBox="0 0 24 24" stroke="#240046" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 16h18M6 8h.01M10 8h.01M14 8h.01M18 8h.01" />
                  </svg>
                )}
                {stat.icon === 'calendar' && (
                  <svg fill="none" viewBox="0 0 24 24" stroke="#240046" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {stat.icon === 'check' && (
                  <svg fill="none" viewBox="0 0 24 24" stroke="#240046" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {stat.icon === 'money' && (
                  <svg fill="none" viewBox="0 0 24 24" stroke="#240046" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="quick-actions">
          <h3>Ações Rápidas</h3>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => navigate('/reservations')}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Nova Reserva
            </button>
            <button className="action-btn" onClick={() => navigate('/rooms')}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 16h18" />
              </svg>
              Ver Quartos
            </button>
          </div>
        </div>

        <div className="reservations-overview">
          <div className="section-header">
            <h3>Quartos Reservados</h3>
            <div className="header-actions">
              <div className="date-filter-dashboard">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  placeholder="Filtrar por data"
                />
                {filterDate && (
                  <button className="clear-filter-btn" onClick={() => setFilterDate('')}>
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button className="view-all-btn" onClick={() => navigate('/reservations')}>
                Ver Todas
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-text">Carregando reservas...</div>
          ) : reservations.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma reserva encontrada</p>
            </div>
          ) : (
            <div className="reservations-list-dashboard">
              {(() => {
                // Filtra por data se houver filtro
                const filtered = reservations.filter(reservation => {
                  if (!filterDate) return true;
                  
                  // Extrai apenas a parte da data (YYYY-MM-DD) do check-in
                  let checkInStr = String(reservation.checkIn).split('T')[0];
                  
                  // Compara diretamente as strings no formato ISO
                  return checkInStr === filterDate;
                });
                
                // Ordena por data de check-in (mais recente primeiro)
                const sorted = filtered.sort((a, b) => {
                  const dateA = new Date(a.checkIn);
                  const dateB = new Date(b.checkIn);
                  return dateA - dateB; // Ordem crescente (mais antiga primeiro)
                });
                
                // Mostra todas as reservas (sem limite)
                return sorted.map((reservation) => (
                <div key={reservation.id} className="reservation-card-dashboard">
                  <div className="reservation-header-dashboard">
                    <div className="guest-info-dashboard">
                      <div className="guest-avatar-dashboard">
                        {reservation.guestName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="guest-name-dashboard">{reservation.guestName}</h4>
                        <p className="room-info-dashboard">Quarto {reservation.room?.number || reservation.roomNumber}</p>
                      </div>
                    </div>
                    <div>
                      {reservation.paymentStatus && reservation.paymentStatus !== 'pending' ? (
                        <span className={`reservation-status-dashboard ${reservation.paymentStatus}`}>
                          {getPaymentStatusLabel(reservation.paymentStatus)}
                        </span>
                      ) : (
                        <span className={`reservation-status-dashboard ${reservation.status}`}>
                          {getStatusLabel(reservation.status)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="reservation-body-dashboard">
                    <div className="date-info-dashboard">
                      <div className="date-item-dashboard">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <span className="date-label-dashboard">Check-in</span>
                          <span className="date-value-dashboard">{new Date(reservation.checkIn).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div className="date-separator-dashboard">→</div>
                      <div className="date-item-dashboard">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <span className="date-label-dashboard">Check-out</span>
                          <span className="date-value-dashboard">{new Date(reservation.checkOut).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    {reservation.totalAmount > 0 && (
                      <div className="total-amount-dashboard">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <span className="total-label-dashboard">Total</span>
                          <span className="total-value-dashboard">R$ {Number(reservation.totalAmount).toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                ));
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
