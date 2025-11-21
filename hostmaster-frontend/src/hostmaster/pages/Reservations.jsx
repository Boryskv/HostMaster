import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getReservations } from '../services/hostmasterApi';
import ReservationModal from '../components/ReservationModal';
import './Reservations.css';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
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
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (reservation = null) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReservation(null);
  };

  const handleModalSuccess = () => {
    loadReservations();
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

  const getPaymentStatusLabel = (status) => {
    const labels = {
      'pending': 'Pendente',
      'partial': 'Sinal',
      'paid': 'Pago'
    };
    return labels[status] || status;
  };

  const filteredReservations = reservations.filter(reservation => {
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

          <button className="add-reservation-btn" onClick={() => handleOpenModal()}>
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
                      <p className="room-info">Quarto {reservation.room?.number || reservation.roomNumber}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {reservation.paymentStatus && reservation.paymentStatus !== 'pending' ? (
                      <span className={`reservation-status ${reservation.paymentStatus}`}>
                        {getPaymentStatusLabel(reservation.paymentStatus)}
                      </span>
                    ) : (
                      <span className={`reservation-status ${reservation.status}`}>
                        {getStatusLabel(reservation.status)}
                      </span>
                    )}
                  </div>
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
                  {reservation.totalAmount > 0 && (
                    <div className="total-amount-card">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <span className="total-label">Total a Receber</span>
                        <span className="total-value">R$ {Number(reservation.totalAmount).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="reservation-actions">
                  <button className="btn-action btn-edit" onClick={() => handleOpenModal(reservation)}>
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReservationModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        reservation={selectedReservation}
      />
    </div>
  );
}
