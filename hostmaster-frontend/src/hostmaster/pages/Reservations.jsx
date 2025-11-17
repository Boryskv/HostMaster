import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ReservationForm from '../components/ReservationForm';
import { getReservations } from '../services/hostmasterApi';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    const data = await getReservations();
    setReservations(data);
  };

  return (
    <div className="reservations">
      <Header />
      <div className="reservations-content">
        <Sidebar />
        <main>
          <h1>Reservas</h1>
          <ReservationForm onSuccess={loadReservations} />
          <div className="reservations-list">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="reservation-item">
                <p>Quarto: {reservation.roomNumber}</p>
                <p>Check-in: {reservation.checkIn}</p>
                <p>Check-out: {reservation.checkOut}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
