import { createPool } from 'mysql2/promise';


const dbConfig = {
  host: process.env.DB_HOST ,
  port: process.env.DB_PORT ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME ,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = createPool(dbConfig);

export default pool;

module.exports = pool;
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
