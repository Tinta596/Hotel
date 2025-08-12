<<<<<<< HEAD
import { createPool } from 'mysql2/promise';
=======
const mysql = require('mysql2/promise');
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hotel_reservas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

<<<<<<< HEAD
const pool = createPool(dbConfig);

export default pool;
=======
const pool = mysql.createPool(dbConfig);

module.exports = pool;
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
