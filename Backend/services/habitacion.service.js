import * as HabitacionModel from '../models/habitacion.model.js';

const ESTADOS_VALIDOS = ['disponible','reservada','ocupada','limpieza','mantenimiento'];

// ── Lecturas ────────────────────────────────────────────────

export const listar = async () => {
  const [rows] = await HabitacionModel.findAll();
  return rows;
};

export const listarDisponibles = async () => {
  const [rows] = await HabitacionModel.findDisponibles();
  return rows;
};

export const listarDisponiblesPorFechas = async (fecha_checkin, fecha_checkout) => {
  const [rows] = await HabitacionModel.findDisponiblesPorFechas(fecha_checkin, fecha_checkout);
  return rows;
};

export const obtenerPorId = async (id) => {
  const [[habitacion]] = await HabitacionModel.findById(id);
  if (!habitacion) throw { status: 404, message: 'Habitación no encontrada' };
  return habitacion;
};

export const obtenerPrecioVigente = async (habitacion_id, fecha) => {
  const precio = await HabitacionModel.getPrecioVigente(habitacion_id, fecha);
  return precio;
};

// ── Disponibilidad ──────────────────────────────────────────

export const verificarDisponibilidad = async (habitacion_id, fecha_checkin, fecha_checkout) => {
  // Validar que la habitación existe
  await obtenerPorId(habitacion_id);
  const disponible = await HabitacionModel.verificarDisponibilidad(
    habitacion_id, fecha_checkin, fecha_checkout
  );
  return disponible;
};

// ── Escrituras ──────────────────────────────────────────────

export const crear = async (data) => {
  const [result] = await HabitacionModel.insert(data);
  const [[habitacion]] = await HabitacionModel.findById(result.insertId);
  return habitacion;
};

export const cambiarEstado = async (id, estado) => {
  if (!ESTADOS_VALIDOS.includes(estado)) {
    throw { status: 400, message: `Estado inválido. Válidos: ${ESTADOS_VALIDOS.join(', ')}` };
  }

  // No se puede poner en mantenimiento usando este endpoint
  // Para eso existe el endpoint de mantenimiento
  if (estado === 'mantenimiento') {
    throw { status: 400, message: 'Para mantenimiento usa el endpoint POST /habitaciones/:id/mantenimiento' };
  }

  const [result] = await HabitacionModel.updateEstado(id, estado);
  if (result.affectedRows === 0) throw { status: 404, message: 'Habitación no encontrada' };
};

export const actualizarPrecio = async (id, precio_base) => {
  await obtenerPorId(id); // valida que existe
  await HabitacionModel.updatePrecio(id, precio_base);
};

export const eliminar = async (id) => {
  await obtenerPorId(id);
  const [result] = await HabitacionModel.softDelete(id);
  if (result.affectedRows === 0) throw { status: 404, message: 'Habitación no encontrada' };
};

// ── Mantenimiento ───────────────────────────────────────────

export const abrirMantenimiento = async (id, data, usuario_id) => {
  const habitacion = await obtenerPorId(id);

  if (habitacion.estado === 'ocupada') {
    throw { status: 409, message: 'No se puede poner en mantenimiento una habitación ocupada' };
  }
  if (habitacion.estado === 'mantenimiento') {
    throw { status: 409, message: 'La habitación ya está en mantenimiento' };
  }

  await HabitacionModel.abrirMantenimiento(
    id, data.motivo, data.prioridad ?? 'media',
    data.responsable, usuario_id
  );
};

export const cerrarMantenimiento = async (habitacion_id, mantenimiento_id, notas_cierre) => {
  await obtenerPorId(habitacion_id);
  await HabitacionModel.cerrarMantenimiento(mantenimiento_id, notas_cierre, habitacion_id);
};

export const listarMantenimientos = async (habitacion_id) => {
  await obtenerPorId(habitacion_id);
  const [rows] = await HabitacionModel.findMantenimientos(habitacion_id);
  return rows;
};

export const listarTipos = async () => {
  const [rows] = await HabitacionModel.findAllTipos();
  return rows;
};