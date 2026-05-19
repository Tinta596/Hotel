import 'dotenv/config';
import db from '../config/database.js';

async function diagnose() {
  // 1. Get the exact column definition for usuarios.id
  const [cols] = await db.execute(`
    SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, CHARACTER_SET_NAME, COLLATION_NAME, COLUMN_KEY
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME IN ('usuarios', 'reservaciones')
      AND COLUMN_NAME = 'id'
  `);
  console.log('ID columns:', JSON.stringify(cols, null, 2));

  // 2. Check if there are any existing FK constraints on usuarios
  const [fks] = await db.execute(`
    SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'usuarios'
      AND REFERENCED_TABLE_NAME IS NOT NULL
  `);
  console.log('Existing FKs on usuarios:', JSON.stringify(fks, null, 2));

  // 3. Try a minimal table WITHOUT FK to see if table creation itself works
  try {
    await db.execute(`DROP TABLE IF EXISTS crm_test`);
    await db.execute(`
      CREATE TABLE crm_test (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Basic table created OK');
    await db.execute(`DROP TABLE IF EXISTS crm_test`);
  } catch (e) {
    console.error('❌ Basic table failed:', e.message);
  }

  // 4. Try adding FK after table creation
  try {
    await db.execute(`DROP TABLE IF EXISTS crm_test2`);
    await db.execute(`
      CREATE TABLE crm_test2 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        INDEX (usuario_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    await db.execute(`
      ALTER TABLE crm_test2
        ADD CONSTRAINT fk_test2_usr FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    `);
    console.log('✅ FK added via ALTER TABLE OK');
    await db.execute(`DROP TABLE IF EXISTS crm_test2`);
  } catch (e) {
    console.error('❌ ALTER TABLE FK failed:', e.message);
  }

  process.exit(0);
}
diagnose().catch(e => { console.error(e); process.exit(1); });
