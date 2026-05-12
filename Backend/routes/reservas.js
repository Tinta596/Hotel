// routes/reservacion.routes.js
import { Router } from 'express';
import * as ReservacionController from '../controllers/reservacion.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

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