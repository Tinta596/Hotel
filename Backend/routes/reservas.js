// routes/reservacion.routes.js
import { Router } from 'express';
import * as ReservacionController from '../controllers/reservacion.controller.js';
import { verifyToken }  from '../middlewares/auth.middleware.js';
import { verifyRol }    from '../middlewares/roles.middleware.js';

const router = Router();

// ============================================================
//  HABITACIONES
//  Prefijo: /api/habitaciones
// ============================================================

// GET /api/habitaciones
// → Todas las habitaciones (admin y trabajador)
router.get(
  '/',
  verifyToken,
  verifyRol('admin', 'trabajador'),
  ReservacionController.obtenerHabitaciones  // ← necesitas agregar este también al controller
);

// GET /api/habitaciones/disponibles
// → Habitaciones con estado = 'disponible'
router.get(
  '/disponibles',
  verifyToken,
  ReservacionController.obtenerHabitacionesDisponibles
);

// GET /api/habitaciones/disponibilidad?habitacion_id=&fecha_checkin=&fecha_checkout=
// → Verifica si una habitación está libre en esas fechas
router.get(
  '/disponibilidad',
  verifyToken,
  ReservacionController.verificarDisponibilidad
);

// GET /api/habitaciones/:id
// → Detalle de una habitación
router.get(
  '/:id',
  verifyToken,
  ReservacionController.obtenerHabitacionPorId
);

// PATCH /api/habitaciones/:id/precio
// → Solo admin puede cambiar el precio
router.patch(
  '/:id/precio',
  verifyToken,
  verifyRol('admin'),
  ReservacionController.actualizarPrecioHabitacion
);


// ============================================================
//  RESERVACIONES
//  Prefijo: /api/reservaciones
// ============================================================

// GET /api/reservaciones
// → Admin ve todas, trabajador ve activas, cliente ve las suyas
router.get(
  '/reservaciones',
  verifyToken,
  ReservacionController.obtenerReservas
);

// POST /api/reservaciones
// → Crear una reservación
router.post(
  '/reservaciones',
  verifyToken,
  ReservacionController.crearReserva
);

// PATCH /api/reservaciones/:id/estado
// → Cambiar estado de una reservación (admin y trabajador)
router.patch(
  '/reservaciones/:id/estado',
  verifyToken,
  verifyRol('admin', 'trabajador'),
  ReservacionController.actualizarEstadoReserva
);

// PATCH /api/reservaciones/:id/fechas
// → Actualizar fechas de una reservación
router.patch(
  '/reservaciones/:id/fechas',
  verifyToken,
  verifyRol('admin'),
  ReservacionController.actualizarFechasReserva
);

// DELETE /api/reservaciones/:id
// → Cancelar reservación
router.delete(
  '/reservaciones/:id',
  verifyToken,
  ReservacionController.cancelarReserva
);

export default router;