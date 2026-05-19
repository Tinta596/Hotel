-- ============================================================
--  CRM Hotelero — Migración de Base de Datos
--  Ejecutar en MySQL contra la base de datos hotel_db
-- ============================================================

-- 1. Extender tabla usuarios con campos CRM
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS tipo_cliente    ENUM('basico','preferencial','vip','premium') NOT NULL DEFAULT 'basico',
  ADD COLUMN IF NOT EXISTS puntos_fidelidad INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS nivel_fidelidad  ENUM('basico','preferencial','vip','premium') NOT NULL DEFAULT 'basico',
  ADD COLUMN IF NOT EXISTS descuento_activo DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS telefono         VARCHAR(20) NULL,
  ADD COLUMN IF NOT EXISTS documento        VARCHAR(30) NULL,
  ADD COLUMN IF NOT EXISTS direccion        VARCHAR(200) NULL,
  ADD COLUMN IF NOT EXISTS foto_perfil      VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS notas_internas   TEXT NULL;

-- 2. Tabla de notas y preferencias del huésped
CREATE TABLE IF NOT EXISTS huesped_notas (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo       ENUM('preferencia','alerta','vip','interna') NOT NULL DEFAULT 'preferencia',
  titulo     VARCHAR(100) NOT NULL,
  contenido  TEXT NOT NULL,
  privada    BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 3. Historial de movimientos de puntos de fidelidad
CREATE TABLE IF NOT EXISTS fidelidad_historial (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  puntos     INT NOT NULL,
  tipo       ENUM('ganados','canjeados','ajuste') NOT NULL DEFAULT 'ganados',
  descripcion VARCHAR(200),
  reserva_id INT NULL,
  creado_en  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id)      ON DELETE CASCADE,
  FOREIGN KEY (reserva_id)  REFERENCES reservaciones(id)  ON DELETE SET NULL
);
