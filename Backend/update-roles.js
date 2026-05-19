import 'dotenv/config';
import db from './config/database.js';

async function updateEnum() {
  try {
    console.log('🔄 Actualizando ENUM de roles...');
    await db.execute("ALTER TABLE usuarios MODIFY COLUMN rol ENUM('admin', 'recepcionista', 'cliente') NOT NULL DEFAULT 'cliente'");
    console.log('✅ ENUM actualizado correctamente.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

updateEnum();
