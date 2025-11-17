import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import RoomCard from '../components/RoomCard';
import { getRooms } from '../services/hostmasterApi';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const data = await getRooms();
    setRooms(data);
  };

  return (
    <div className="rooms">
      <Header />
      <div className="rooms-content">
        <Sidebar />
        <main>
          <h1>Quartos</h1>
          <div className="rooms-grid">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
