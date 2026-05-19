import 'dotenv/config';
import db from '../config/database.js';

async function migrate() {
  // usuarios.id is INT UNSIGNED — new tables must match
  try {
    await db.execute(`DROP TABLE IF EXISTS huesped_notas`);
    await db.execute(`
      CREATE TABLE huesped_notas (
        id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        usuario_id      INT UNSIGNED NOT NULL,
        tipo            ENUM('preferencia','alerta','vip','interna') NOT NULL DEFAULT 'preferencia',
        titulo          VARCHAR(100) NOT NULL,
        contenido       TEXT NOT NULL,
        privada         TINYINT(1) NOT NULL DEFAULT 0,
        creado_en       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        actualizado_en  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_notas_usuario (usuario_id),
        CONSTRAINT fk_notas_usuario FOREIGN KEY (usuario_id)
          REFERENCES usuarios(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ huesped_notas creada');
  } catch (e) { console.error('❌ huesped_notas:', e.message); }

  try {
    await db.execute(`DROP TABLE IF EXISTS fidelidad_historial`);
    await db.execute(`
      CREATE TABLE fidelidad_historial (
        id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        usuario_id  INT UNSIGNED NOT NULL,
        puntos      INT NOT NULL,
        tipo        ENUM('ganados','canjeados','ajuste') NOT NULL DEFAULT 'ganados',
        descripcion VARCHAR(200) NULL,
        reserva_id  INT UNSIGNED NULL,
        creado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_fid_usuario (usuario_id),
        INDEX idx_fid_reserva (reserva_id),
        CONSTRAINT fk_fid_usuario FOREIGN KEY (usuario_id)
          REFERENCES usuarios(id) ON DELETE CASCADE,
        CONSTRAINT fk_fid_reserva FOREIGN KEY (reserva_id)
          REFERENCES reservaciones(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ fidelidad_historial creada');
  } catch (e) { console.error('❌ fidelidad_historial:', e.message); }

  console.log('\nDone.');
  process.exit(0);
}
migrate();
