import { DataSource } from 'typeorm';

async function fixDatesAndRecalculate() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '1234',
    database: 'hostmaster',
    entities: ['src/**/entities/*.entity.ts'],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('Conectado ao banco de dados');

    // Busca todas as reservas com seus quartos
    const reservations = await dataSource.query(`
      SELECT r.id, r.checkIn, r.checkOut, r.roomId, room.price 
      FROM reservations r
      JOIN rooms room ON r.roomId = room.id
    `);

    console.log(`Encontradas ${reservations.length} reservas para recalcular`);

    for (const reservation of reservations) {
      // Calcula o número de dias corretamente
      // As datas já vêm como Date do banco, então não precisa adicionar 'T00:00:00'
      const checkInDate = new Date(reservation.checkIn);
      const checkOutDate = new Date(reservation.checkOut);
      
      // Normaliza para meia-noite para evitar problemas de hora
      checkInDate.setHours(0, 0, 0, 0);
      checkOutDate.setHours(0, 0, 0, 0);
      
      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      // Mesma data = 0 diárias, 1 dia de diferença = 1 diária
      const numberOfDays = diffDays;

      const roomPrice = Number(reservation.price) || 0;
      const totalAmount = roomPrice * numberOfDays;

      console.log(`Reserva ${reservation.id}:`);
      console.log(`  Check-in: ${reservation.checkIn}`);
      console.log(`  Check-out: ${reservation.checkOut}`);
      console.log(`  Diárias: ${numberOfDays}`);
      console.log(`  Preço/diária: R$ ${roomPrice.toFixed(2)}`);
      console.log(`  Total: R$ ${totalAmount.toFixed(2)}`);

      // Atualiza o total
      await dataSource.query(
        'UPDATE reservations SET totalAmount = ? WHERE id = ?',
        [totalAmount, reservation.id]
      );
    }

    console.log('\nRecálculo concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao recalcular reservas:', error);
  } finally {
    await dataSource.destroy();
  }
}

fixDatesAndRecalculate();
