import { useState } from 'react';
import { createReservation } from '../services/hostmasterApi';

export default function ReservationForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    roomId: '',
    guestName: '',
    checkIn: '',
    checkOut: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createReservation(formData);
    onSuccess();
    setFormData({ roomId: '', guestName: '', checkIn: '', checkOut: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="reservation-form">
      <input
        name="guestName"
        placeholder="Nome do Hóspede"
        value={formData.guestName}
        onChange={handleChange}
      />
      <input
        name="roomId"
        placeholder="ID do Quarto"
        value={formData.roomId}
        onChange={handleChange}
      />
      <input
        name="checkIn"
        type="date"
        value={formData.checkIn}
        onChange={handleChange}
      />
      <input
        name="checkOut"
        type="date"
        value={formData.checkOut}
        onChange={handleChange}
      />
      <button type="submit">Criar Reserva</button>
    </form>
  );
}
