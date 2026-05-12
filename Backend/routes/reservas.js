// routes/reservacion.routes.js
import { Router } from 'express';
import * as ReservacionController from '../controllers/reservacion.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// ============================================================
//  HABITACIONES
//  Prefijo: /api/habitaciones
// ============================================================

// GET /api/habitaciones
// → Todas las habitaciones (admin y trabajador)
router.get(
  '/',
  authenticateToken,
  requireRole(['admin', 'trabajador']),
  ReservacionController.obtenerHabitaciones  // ← necesitas agregar este también al controller
);

// GET /api/habitaciones/disponibles
// → Habitaciones con estado = 'disponible'
router.get(
  '/disponibles',
  authenticateToken,
  ReservacionController.obtenerHabitacionesDisponibles
);

// GET /api/habitaciones/disponibilidad?habitacion_id=&fecha_checkin=&fecha_checkout=
// → Verifica si una habitación está libre en esas fechas
router.get(
  '/disponibilidad',
  authenticateToken,
  ReservacionController.verificarDisponibilidad
);

// GET /api/habitaciones/:id
// → Detalle de una habitación
router.get(
  '/:id',
  authenticateToken,
  ReservacionController.obtenerHabitacionPorId
);

// PATCH /api/habitaciones/:id/precio
// → Solo admin puede cambiar el precio
router.patch(
  '/:id/precio',
  authenticateToken,
  requireRole(['admin']),
  ReservacionController.actualizarPrecioHabitacion
);


// ============================================================
//  RESERVACIONES
//  Prefijo: /api/reservaciones
// ============================================================

// GET /api/reservas
// → Admin ve todas, trabajador ve activas, cliente ve las suyas
router.get(
  '/',
  authenticateToken,
  ReservacionController.obtenerReservas
);

// POST /api/reservas/reservar
// → Crear una reservación
router.post(
  '/reservar',
  authenticateToken,
  ReservacionController.crearReserva
);

// PATCH /api/reservas/:id/estado
// → Cambiar estado de una reservación (admin y trabajador)
router.patch(
  '/:id/estado',
  authenticateToken,
  requireRole(['admin', 'trabajador']),
  ReservacionController.actualizarEstadoReserva
);

// PATCH /api/reservas/:id/fechas
// → Actualizar fechas de una reservación
router.patch(
  '/:id/fechas',
  authenticateToken,
  requireRole(['admin']),
  ReservacionController.actualizarFechasReserva
);

// DELETE /api/reservas/:id
// → Cancelar reservación
router.delete(
  '/:id',
  authenticateToken,
  ReservacionController.cancelarReserva
);

export default router;