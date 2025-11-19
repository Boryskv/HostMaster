import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getReservations } from '../services/hostmasterApi';
import './Reservations.css';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
      // Mock data para demonstração
      setReservations([
        { id: 1, guestName: 'João Silva', roomNumber: '1', checkIn: '2024-11-20', checkOut: '2024-11-25', status: 'confirmed' },
        { id: 2, guestName: 'Maria Santos', roomNumber: '2', checkIn: '2024-11-18', checkOut: '2024-11-22', status: 'checked-in' },
        { id: 3, guestName: 'Pedro Costa', roomNumber: '5', checkIn: '2024-11-25', checkOut: '2024-11-30', status: 'pending' },
        { id: 4, guestName: 'Ana Oliveira', roomNumber: '4', checkIn: '2024-11-15', checkOut: '2024-11-20', status: 'checked-out' },
        { id: 5, guestName: 'Carlos Souza', roomNumber: '3', checkIn: '2024-11-22', checkOut: '2024-11-28', status: 'confirmed' },
        { id: 6, guestName: 'Roberto Lima', roomNumber: '170', checkIn: '2024-11-19', checkOut: '2024-11-24', status: 'checked-in' },
      ]);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredReservations = reservations.filter(reservation => {
    // Filtro por status
    if (filter !== 'all' && reservation.status !== filter) {
      return false;
    }

    // Filtro por data
    if (selectedDate) {
      // Normaliza as datas para comparação (apenas dia/mês/ano, sem hora)
      const checkInDate = new Date(reservation.checkIn + 'T00:00:00');
      const checkOutDate = new Date(reservation.checkOut + 'T00:00:00');
      const filterDate = new Date(selectedDate + 'T00:00:00');
      
      // Remove a parte de hora para comparação precisa
      checkInDate.setHours(0, 0, 0, 0);
      checkOutDate.setHours(0, 0, 0, 0);
      filterDate.setHours(0, 0, 0, 0);
      
      // Debug - pode remover depois
      console.log('Filtro de Data:', {
        quarto: reservation.roomNumber,
        checkIn: checkInDate.toLocaleDateString('pt-BR'),
        checkOut: checkOutDate.toLocaleDateString('pt-BR'),
        filtro: filterDate.toLocaleDateString('pt-BR'),
        match: filterDate >= checkInDate && filterDate <= checkOutDate
      });
      
      // Verifica se a data selecionada está entre check-in e check-out (inclusive)
      return filterDate >= checkInDate && filterDate <= checkOutDate;
    }

    return true;
  });

  const clearDateFilter = () => {
    setSelectedDate('');
  };

  return (
    <div className="reservations-page">
      <header className="page-header">
        <div className="header-left">
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1>Gerenciar Reservas</h1>
        </div>
        <button onClick={logout} className="logout-btn">Sair</button>
      </header>

      <div className="reservations-content">
        <div className="reservations-toolbar">
          <div className="toolbar-left">
            <div className="filter-buttons">
              <button 
                className={filter === 'all' ? 'active' : ''} 
                onClick={() => setFilter('all')}
              >
                Todas
              </button>
              <button 
                className={filter === 'pending' ? 'active' : ''} 
                onClick={() => setFilter('pending')}
              >
                Pendentes
              </button>
              <button 
                className={filter === 'confirmed' ? 'active' : ''} 
                onClick={() => setFilter('confirmed')}
              >
                Confirmadas
              </button>
              <button 
                className={filter === 'checked-in' ? 'active' : ''} 
                onClick={() => setFilter('checked-in')}
              >
                Check-in
              </button>
            </div>

            <div className="date-filter">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                placeholder="Filtrar por data"
              />
              {selectedDate && (
                <button className="clear-date-btn" onClick={clearDateFilter}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <button className="add-reservation-btn" onClick={() => setShowForm(!showForm)}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nova Reserva
          </button>
        </div>

        {selectedDate && (
          <div className="filter-info">
            <p>
              Mostrando quartos reservados para: <strong>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
              {' '}({filteredReservations.length} {filteredReservations.length === 1 ? 'reserva' : 'reservas'})
            </p>
          </div>
        )}

        {loading ? (
          <div className="loading">Carregando reservas...</div>
        ) : (
          <div className="reservations-list">
            {filteredReservations.map((reservation) => (
              <div key={reservation.id} className="reservation-card">
                <div className="reservation-header">
                  <div className="guest-info">
                    <div className="guest-avatar">
                      {reservation.guestName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="guest-name">{reservation.guestName}</h3>
                      <p className="room-info">Quarto {reservation.roomNumber}</p>
                    </div>
                  </div>
                  <span className={`reservation-status ${reservation.status}`}>
                    {getStatusLabel(reservation.status)}
                  </span>
                </div>
                <div className="reservation-body">
                  <div className="date-info">
                    <div className="date-item">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <span className="date-label">Check-in</span>
                        <span className="date-value">{new Date(reservation.checkIn).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="date-separator">→</div>
                    <div className="date-item">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <span className="date-label">Check-out</span>
                        <span className="date-value">{new Date(reservation.checkOut).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="reservation-actions">
                  <button className="btn-action btn-edit">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                  <button className="btn-action btn-cancel">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
