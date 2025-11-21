// Script para recalcular todas as reservas
// Execute: node recalculate-reservations.js

const API_URL = 'http://localhost:3000/api';

async function recalculate() {
  try {
    // Pega o token (você precisa fazer login primeiro)
    console.log('Por favor, faça login no sistema primeiro para obter um token.');
    console.log('Depois, execute este script passando o token como argumento:');
    console.log('node recalculate-reservations.js SEU_TOKEN_AQUI');
    
    const token = process.argv[2];
    if (!token) {
      console.log('\nOu simplesmente crie uma nova reserva que o backend calculará automaticamente!');
      return;
    }

    // Busca todas as reservas
    const response = await fetch(`${API_URL}/reservations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const reservations = await response.json();
    console.log(`Encontradas ${reservations.length} reservas`);

    // Atualiza cada reserva (isso vai recalcular o total)
    for (const reservation of reservations) {
      const updateResponse = await fetch(`${API_URL}/reservations/${reservation.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          guestName: reservation.guestName
        })
      });

      if (updateResponse.ok) {
        const updated = await updateResponse.json();
        console.log(`✓ ${reservation.guestName}: R$ ${updated.totalAmount}`);
      } else {
        console.log(`✗ Erro ao atualizar ${reservation.guestName}`);
      }
    }

    console.log('\nRecálculo concluído!');
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

recalculate();
