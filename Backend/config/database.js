import { createPool } from 'mysql2/promise';


const dbConfig = {
  host: process.env.DB_HOST ,
  port: process.env.DB_PORT ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_DATABASE ,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = createPool(dbConfig);

export default pool;

