// routes/reservacion.routes.js
import { Router } from 'express';
import * as ReservacionController from '../controllers/reservacion.controller.js';
import * as InvoiceController from '../controllers/invoice.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// GET /api/reservas
// → Admin ve todas, trabajador ve activas, cliente ve las suyas
router.get(
  '/',
  authenticateToken,
  ReservacionController.obtenerReservas
);

// POST /api/reservas
// → Crear una reservación
router.post(
  '/',
  authenticateToken,
  ReservacionController.crearReserva
);

router.post(
  '/reservar',
  authenticateToken,
  ReservacionController.crearReserva
);

// POST /api/reservas/calcular-precio
// → Calcular precio estimado
router.post(
  '/calcular-precio',
  authenticateToken,
  ReservacionController.calcularPrecio
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
  requireRole(['admin', 'trabajador', 'cliente']),
  ReservacionController.actualizarFechasReserva
);

// Alias para el frontend que usa PUT /reservas/:id
router.put(
  '/:id',
  authenticateToken,
  requireRole(['admin', 'trabajador', 'cliente']),
  (req, res, next) => {
    // Si no viene habitacion_id, podemos intentar obtenerlo o validarlo
    ReservacionController.actualizarFechasReserva(req, res, next);
  }
);

// GET /api/reservas/ocupacion/:habitacion_id
// → Ver fechas ocupadas de una habitación
router.get(
  '/ocupacion/:habitacion_id',
  authenticateToken,
  ReservacionController.obtenerOcupacion
);

// GET /api/reservas/:id/factura
// → Descargar factura PDF
router.get(
  '/:id/factura',
  authenticateToken,
  InvoiceController.downloadInvoice
);

// GET /api/reservas/:id/factura/preview
// → Previsualizar factura PDF
router.get(
  '/:id/factura/preview',
  authenticateToken,
  InvoiceController.previewInvoice
);

// POST /api/reservas/:id/consumos
// → Registrar consumo de un servicio para la reservación (admin y trabajador)
router.post(
  '/:id/consumos',
  authenticateToken,
  requireRole(['admin', 'trabajador']),
  ReservacionController.registrarConsumo
);


// DELETE /api/reservas/:id
// → Cancelar reservación
router.delete(
  '/:id',
  authenticateToken,
  ReservacionController.cancelarReserva
);

export default router;