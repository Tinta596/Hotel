import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

async function fix() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'hotel_db'
  });

  console.log('--- Corrigiendo usuarios CRM ---');
  
  // Asegurar que Isabella es Premium
  await connection.execute(
    `UPDATE usuarios SET 
      nivel_fidelidad = 'premium', 
      tipo_cliente = 'individual', 
      puntos_fidelidad = 4250 
     WHERE email = 'isabella.romero@demo.com'`
  );
  
  // Asegurar que Carlos es Básico
  await connection.execute(
    `UPDATE usuarios SET 
      nivel_fidelidad = 'basico', 
      tipo_cliente = 'individual', 
      puntos_fidelidad = 120 
     WHERE email = 'carlos.mendoza@demo.com'`
  );

  console.log('✅ Usuarios actualizados correctamente.');
  process.exit(0);
}

fix().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
