// routes/habitacion.routes.js
import { Router } from 'express';
import * as HabitacionController from '../controllers/habitacion.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { verifyRol }   from '../middlewares/roles.middleware.js';

const router = Router();

// ── Lecturas (todos los roles autenticados) ─────────────────

// GET /api/habitaciones
router.get('/',
  verifyToken,
  verifyRol('admin', 'trabajador'),
  HabitacionController.listar
);

// GET /api/habitaciones/disponibles
// GET /api/habitaciones/disponibles?fecha_checkin=&fecha_checkout=
router.get('/disponibles',
  verifyToken,
  HabitacionController.listarDisponibles
);

// GET /api/habitaciones/disponibilidad?habitacion_id=&fecha_checkin=&fecha_checkout=
router.get('/disponibilidad',
  verifyToken,
  HabitacionController.verificarDisponibilidad
);

// GET /api/habitaciones/:id
router.get('/:id',
  verifyToken,
  HabitacionController.obtenerPorId
);

// GET /api/habitaciones/:id/mantenimientos
router.get('/:id/mantenimientos',
  verifyToken,
  verifyRol('admin', 'trabajador'),
  HabitacionController.listarMantenimientos
);

// ── Escrituras (solo admin) ─────────────────────────────────

// POST /api/habitaciones
router.post('/',
  verifyToken,
  verifyRol('admin'),
  HabitacionController.crear
);

// PATCH /api/habitaciones/:id/estado
router.patch('/:id/estado',
  verifyToken,
  verifyRol('admin', 'trabajador'),
  HabitacionController.cambiarEstado
);

// PATCH /api/habitaciones/:id/precio
router.patch('/:id/precio',
  verifyToken,
  verifyRol('admin'),
  HabitacionController.actualizarPrecio
);

// DELETE /api/habitaciones/:id
router.delete('/:id',
  verifyToken,
  verifyRol('admin'),
  HabitacionController.eliminar
);

// ── Mantenimiento ───────────────────────────────────────────

// POST /api/habitaciones/:id/mantenimiento
router.post('/:id/mantenimiento',
  verifyToken,
  verifyRol('admin', 'trabajador'),
  HabitacionController.abrirMantenimiento
);

// PATCH /api/habitaciones/:id/mantenimiento/:mantenimiento_id/cerrar
router.patch('/:id/mantenimiento/:mantenimiento_id/cerrar',
  verifyToken,
  verifyRol('admin', 'trabajador'),
  HabitacionController.cerrarMantenimiento
);

export default router;