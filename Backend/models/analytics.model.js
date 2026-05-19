import db from '../config/database.js';

export const getResumenGeneral = async () => {
  const [[reservas]] = await db.execute('SELECT COUNT(*) AS total FROM reservaciones');
  const [habitaciones] = await db.execute('SELECT estado, COUNT(*) AS total FROM habitaciones GROUP BY estado');
  const [[clientes]] = await db.execute('SELECT COUNT(*) AS total FROM usuarios WHERE rol = "cliente"');
  const [[ingresos]] = await db.execute('SELECT SUM(precio_total) AS total FROM reservaciones WHERE estado != "cancelada"');
  const [[servicios]] = await db.execute('SELECT COUNT(*) AS total FROM servicios WHERE activo = 1');

  // Mapear estados de habitaciones
  const estados = { disponible: 0, ocupada: 0, mantenimiento: 0, reservada: 0 };
  habitaciones.forEach(h => {
    estados[h.estado] = h.total;
  });

  return {
    totalReservas: reservas.total,
    habitacionesDisponibles: estados.disponible,
    habitacionesOcupadas: estados.ocupada,
    habitacionesMantenimiento: estados.mantenimiento,
    totalClientes: clientes.total,
    ingresosMes: ingresos.total || 0,
    serviciosActivos: servicios.total
  };
};

export const getIngresosMensuales = async () => {
  return db.execute(`
    SELECT 
      DATE_FORMAT(fecha_entrada, '%Y-%m') AS mes,
      SUM(precio_total) AS total
    FROM reservaciones
    WHERE estado != 'cancelada'
    GROUP BY mes
    ORDER BY mes DESC
    LIMIT 6
  `);
};

export const getServiciosPopulares = async () => {
  return db.execute(`
    SELECT s.nombre, COUNT(rs.servicio_id) AS cantidad
    FROM reserva_servicios rs
    JOIN servicios s ON rs.servicio_id = s.id
    GROUP BY rs.servicio_id
    ORDER BY cantidad DESC
    LIMIT 5
  `);
};

export const getReservasRecientes = async () => {
  return db.execute(`
    SELECT v.*, r.usuario_id 
    FROM v_reservaciones_detalle v
    JOIN reservaciones r ON v.id = r.id
    ORDER BY v.created_at DESC
    LIMIT 10
  `);
};
