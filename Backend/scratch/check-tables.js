import 'dotenv/config';
import db from '../config/database.js';

async function check() {
  const [[u]] = await db.execute(
    `SELECT COLUMN_NAME, DATA_TYPE, COLUMN_KEY, EXTRA
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'id'`
  );
  console.log('usuarios.id →', u);

  const [[r]] = await db.execute(
    `SELECT COLUMN_NAME, DATA_TYPE, COLUMN_KEY, EXTRA
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'reservaciones' AND COLUMN_NAME = 'id'`
  );
  console.log('reservaciones.id →', r);

  // Check engine
  const [engines] = await db.execute(
    `SELECT TABLE_NAME, ENGINE FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('usuarios','reservaciones')`
  );
  console.log('Engines →', engines);

  process.exit(0);
}
check().catch(e => { console.error(e.message); process.exit(1); });
