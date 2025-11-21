const mysql = require('mysql2/promise');

async function checkTables() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'hostmaster'
  });

  const [tables] = await connection.query('SHOW TABLES');
  console.log('Tabelas no banco:', tables);
  
  await connection.end();
}

checkTables();
