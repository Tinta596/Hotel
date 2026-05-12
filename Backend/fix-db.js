import db from './config/database.js';

async function fixDatabase() {
  try {
    console.log('🔧 Iniciando reparación de base de datos...');

    // 1. Agregar columnas necesarias a reservaciones
    const [colsPlan] = await db.execute('SHOW COLUMNS FROM reservaciones LIKE "plan_id"');
    if (colsPlan.length === 0) {
      console.log('➕ Agregando columna plan_id a reservaciones...');
      await db.execute('ALTER TABLE reservaciones ADD COLUMN plan_id INT UNSIGNED NULL AFTER habitacion_id');
    }

    // Hacer huesped_id nullable para compatibilidad con el sistema de usuarios simple
    console.log('🔧 Haciendo huesped_id nullable...');
    await db.execute('ALTER TABLE reservaciones MODIFY huesped_id INT UNSIGNED NULL');

    // 2. Crear tabla reserva_servicios si no existe
    console.log('➕ Creando tabla reserva_servicios...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS reserva_servicios (
        reserva_id INT UNSIGNED NOT NULL,
        servicio_id INT UNSIGNED NOT NULL,
        precio_unitario DECIMAL(10,2) NOT NULL,
        cantidad TINYINT NOT NULL DEFAULT 1,
        PRIMARY KEY (reserva_id, servicio_id),
        CONSTRAINT fk_rs_reserva FOREIGN KEY (reserva_id) REFERENCES reservaciones(id) ON DELETE CASCADE,
        CONSTRAINT fk_rs_servicio FOREIGN KEY (servicio_id) REFERENCES servicios(id)
      ) ENGINE=InnoDB
    `);

    console.log('✅ Base de datos reparada con éxito.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error reparando base de datos:', err);
    process.exit(1);
  }
}

fixDatabase();
