import { DataSource } from 'typeorm';
import { Reservation } from '../reservations/entities/reservation.entity';
import { Room } from '../rooms/entities/room.entity';

async function recalculateReservations() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'hostmaster',
    entities: [Reservation, Room],
  });

  await dataSource.initialize();
  console.log('Conectado ao banco de dados');

  const reservationRepo = dataSource.getRepository(Reservation);
  const roomRepo = dataSource.getRepository(Room);

  const reservations = await reservationRepo.find({ relations: ['room'] });
  console.log(`Encontradas ${reservations.length} reservas`);

  for (const reservation of reservations) {
    const room = await roomRepo.findOne({ where: { id: reservation.roomId } });
    
    if (!room) {
      console.log(`Quarto não encontrado para reserva ${reservation.id}`);
      continue;
    }

    // Calcula o número de dias
    const checkInDate = new Date(reservation.checkIn);
    const checkOutDate = new Date(reservation.checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const numberOfDays = diffDays <= 0 ? 1 : Math.ceil(diffDays);

    // Calcula o total
    const roomPrice = Number(room.price) || 0;
    const totalAmount = roomPrice * numberOfDays;

    // Atualiza a reserva
    await reservationRepo.update(reservation.id, { totalAmount });
    
    console.log(`Reserva ${reservation.guestName}: ${numberOfDays} diárias × R$ ${roomPrice} = R$ ${totalAmount}`);
  }

  console.log('Recálculo concluído!');
  await dataSource.destroy();
}

recalculateReservations().catch(console.error);
