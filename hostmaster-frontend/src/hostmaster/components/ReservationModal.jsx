import { useState, useEffect } from 'react';
import { getRooms, createReservation, updateReservation, deleteReservation } from '../services/hostmasterApi';
import './ReservationModal.css';

export default function ReservationModal({ isOpen, onClose, onSuccess, reservation = null }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    paymentStatus: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadRooms();
      if (reservation) {
        setFormData({
          guestName: reservation.guestName,
          roomId: reservation.roomId || reservation.room?.id || '',
          checkIn: reservation.checkIn,
          checkOut: reservation.checkOut,
          paymentStatus: reservation.paymentStatus === 'pending' ? '' : (reservation.paymentStatus || '')
        });
      } else {
        setFormData({
          guestName: '',
          roomId: '',
          checkIn: '',
          checkOut: '',
          paymentStatus: ''
        });
      }
    }
  }, [isOpen, reservation]);

  const loadRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (error) {
      console.error('Erro ao carregar quartos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Dados do formulário:', formData);
      
      console.log('Dados a enviar:', formData);
      
      if (reservation) {
        await updateReservation(reservation.id, formData);
      } else {
        await createReservation(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar reserva:', error);
      console.error('Detalhes do erro:', error.response?.data || error.message);
      alert(`Erro ao salvar reserva: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja deletar esta reserva?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteReservation(reservation.id);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao deletar reserva:', error);
      alert('Erro ao deletar reserva. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;
    
    // Converte valores numéricos
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{reservation ? 'Editar Reserva' : 'Nova Reserva'}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="guestName">Nome do Hóspede</label>
            <input
              type="text"
              id="guestName"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              required
              placeholder="Digite o nome completo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="roomId">Quarto</label>
            <select
              id="roomId"
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um quarto</option>
              {rooms.sort((a, b) => {
                // Ordena numericamente quando possível, alfabeticamente caso contrário
                const numA = parseInt(a.number);
                const numB = parseInt(b.number);
                
                if (!isNaN(numA) && !isNaN(numB)) {
                  return numA - numB;
                }
                
                return a.number.localeCompare(b.number);
              }).map(room => (
                <option key={room.id} value={room.id}>
                  Quarto {room.number} - R$ {Number(room.price).toFixed(2)}/diária
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="checkIn">Check-in</label>
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="checkOut">Check-out</label>
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="paymentStatus">Status de Pagamento</label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="partial">Sinal</option>
              <option value="paid">Pago</option>
            </select>
          </div>

          <div className="modal-actions">
            {reservation && (
              <button
                type="button"
                className="btn-delete"
                onClick={handleDelete}
                disabled={loading}
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Deletar
              </button>
            )}
            <div className="modal-actions-right">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? 'Salvando...' : (reservation ? 'Atualizar' : 'Criar Reserva')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
