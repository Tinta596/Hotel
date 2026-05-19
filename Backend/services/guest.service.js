import * as GuestModel from '../models/guest.model.js';

export const listarHuespedes = async (filters) => {
  const [rows] = await GuestModel.findAllGuests(filters);
  const [[{ total }]] = await GuestModel.countGuests(filters);
  return { data: rows, total };
};

export const obtenerHuesped = async (id) => {
  const [[guest]] = await GuestModel.findGuestById(id);
  if (!guest) throw { status: 404, message: 'Huésped no encontrado' };

  const [[stats]]         = await GuestModel.findGuestStats(id);
  const [history]         = await GuestModel.findGuestHistory(id);
  const [notes]           = await GuestModel.findGuestNotes(id);
  const [loyaltyHistory]  = await GuestModel.findLoyaltyHistory(id);

  const { LOYALTY_LEVELS, resolveLevel } = await import('../models/guest.model.js');
  const currentLevel = resolveLevel(guest.puntos_fidelidad);
  const nextLevelKey = { basico: 'preferencial', preferencial: 'vip', vip: 'premium', premium: 'premium' }[currentLevel];
  const nextMin      = LOYALTY_LEVELS[nextLevelKey].min;
  const progress     = currentLevel === 'premium' ? 100 :
    Math.round((guest.puntos_fidelidad / nextMin) * 100);

  return {
    ...guest,
    stats,
    history,
    notes,
    loyaltyHistory,
    loyalty: {
      currentLevel,
      nextLevel: nextLevelKey,
      nextMin,
      progress: Math.min(progress, 100),
      descuento: GuestModel.LOYALTY_LEVELS[currentLevel].descuento,
    }
  };
};

export const actualizarPerfil = async (id, data) => {
  const [result] = await GuestModel.updateGuestProfile(id, data);
  if (result.affectedRows === 0) throw { status: 404, message: 'Huésped no encontrado' };
};

// ── Notas ─────────────────────────────────────────────────────
export const crearNota = async (usuario_id, data) => {
  const [result] = await GuestModel.insertNote({ usuario_id, ...data });
  return { id: result.insertId, ...data };
};

export const editarNota = async (id, data) => {
  const [result] = await GuestModel.updateNote(id, data);
  if (result.affectedRows === 0) throw { status: 404, message: 'Nota no encontrada' };
};

export const eliminarNota = async (id) => {
  const [result] = await GuestModel.deleteNote(id);
  if (result.affectedRows === 0) throw { status: 404, message: 'Nota no encontrada' };
};

// ── Fidelidad ─────────────────────────────────────────────────
export const ajustarPuntos = async (id, { puntos, tipo, descripcion, reserva_id }) => {
  return GuestModel.addLoyaltyPoints(id, puntos, tipo, descripcion, reserva_id);
};

// ── Asignación automática de puntos al crear reserva ─────────
// 1 punto por cada $1.000 COP gastado
export const asignarPuntosPorReserva = async (usuario_id, precio_total, reserva_id) => {
  const puntos = Math.floor(precio_total / 1000);
  if (puntos <= 0) return;
  await GuestModel.addLoyaltyPoints(
    usuario_id, puntos, 'ganados',
    `Reserva #${reserva_id} — ${puntos} pts`,
    reserva_id
  );
};
