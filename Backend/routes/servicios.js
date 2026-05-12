// routes/servicio.routes.js
import { Router }            from 'express';
import * as ServicioController from '../controllers/servicios.controller.js';
import { authenticateToken, requireRole }   from '../middleware/auth.middleware.js';
import { upload }            from '../middleware/upload.middleware.js';

const router = Router();

// GET /api/servicios
// GET /api/servicios?activos=true  → solo activos (frontend público)
router.get('/',
  authenticateToken,
  ServicioController.listar
);

// GET /api/servicios/:id
router.get('/:id',
  authenticateToken,
  ServicioController.obtenerPorId
);

// POST /api/servicios
router.post('/',
  authenticateToken,
  requireRole(['admin']),
  upload.single('imagen'),
  ServicioController.crear
);

// PUT /api/servicios/:id
router.put('/:id',
  authenticateToken,
  requireRole('admin'),
  upload.single('imagen'),
  ServicioController.actualizar
);

// PATCH /api/servicios/:id/estado
// → toggleActivo y toggleEstadoServicio unificados en uno solo
router.patch('/:id/estado',
  authenticateToken,
  requireRole('admin', 'trabajador'),
  ServicioController.cambiarEstado
);

// PATCH /api/servicios/:id/imagen
// → subir imagen de forma independiente
router.patch('/:id/imagen',
  authenticateToken,
  requireRole('admin'),
  upload.single('imagen'),
  ServicioController.subirImagen
);

// DELETE /api/servicios/:id  (soft delete)
router.delete('/:id',
  authenticateToken,
  requireRole('admin'),
  ServicioController.eliminar
);

export default router;