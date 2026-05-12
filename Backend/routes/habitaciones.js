// routes/habitacion.routes.js
import { Router } from 'express';
import * as HabitacionController from '../controllers/habitaciones.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// ── Lecturas (todos los roles autenticados) ─────────────────

// GET /api/habitaciones
router.get('/',
  authenticateToken,
  requireRole(['admin', 'trabajador']),
  HabitacionController.listar
);

// GET /api/habitaciones/disponibles
// GET /api/habitaciones/disponibles?fecha_checkin=&fecha_checkout=
router.get('/disponibles',
  authenticateToken,
  HabitacionController.listarDisponibles
);

// GET /api/habitaciones/disponibilidad?habitacion_id=&fecha_checkin=&fecha_checkout=
router.get('/disponibilidad',
  authenticateToken,
  HabitacionController.verificarDisponibilidad
);

// Alias para el frontend
router.get('/verificar-disponibilidad',
  authenticateToken,
  HabitacionController.verificarDisponibilidad
);

// GET /api/habitaciones/:id
router.get('/:id',
  authenticateToken,
  HabitacionController.obtenerPorId
);

// GET /api/habitaciones/:id/mantenimientos
router.get('/:id/mantenimientos',
  authenticateToken,
  requireRole(['admin', 'trabajador']),
  HabitacionController.listarMantenimientos
);

// ── Escrituras (solo admin) ─────────────────────────────────

// POST /api/habitaciones
router.post('/',
  authenticateToken,
  requireRole(['admin']),
  HabitacionController.crear
);

// PATCH /api/habitaciones/:id/estado
router.patch('/:id/estado',
  authenticateToken,
  requireRole(['admin', 'trabajador']),
  HabitacionController.cambiarEstado
);

// PATCH /api/habitaciones/:id/precio
router.patch('/:id/precio',
  authenticateToken,
  requireRole(['admin']),
  HabitacionController.actualizarPrecio
);

// DELETE /api/habitaciones/:id
router.delete('/:id',
  authenticateToken,
  requireRole(['admin']),
  HabitacionController.eliminar
);

// ── Mantenimiento ───────────────────────────────────────────

// POST /api/habitaciones/:id/mantenimiento
router.post('/:id/mantenimiento',
  authenticateToken,
  requireRole(['admin', 'trabajador']),
  HabitacionController.abrirMantenimiento
);

// PATCH /api/habitaciones/:id/mantenimiento/:mantenimiento_id/cerrar
router.patch('/:id/mantenimiento/:mantenimiento_id/cerrar',
  authenticateToken,
  requireRole(['admin', 'trabajador']),
  HabitacionController.cerrarMantenimiento
);

export default router;