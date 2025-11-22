export default function RoomCard({ room }) {
  return (
    <div className="room-card">
      <h3>Quarto {room.number}</h3>
      <p>Preço: R$ {room.price}</p>
      <p>Status: {room.available ? 'Disponível' : 'Ocupado'}</p>
    </div>
  );
}
