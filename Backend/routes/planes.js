import { Router }        from 'express';
import * as PlanController from '../controllers/planes.controller.js';
import { authenticateToken, requireRole }   from '../middleware/auth.middleware.js';

const router = Router();

// GET /api/planes
router.get('/',
  authenticateToken,
  PlanController.listar
);

// GET /api/planes/:id
router.get('/:id',
  authenticateToken,
  PlanController.obtenerPorId
);

// GET /api/planes/:id/servicios
router.get('/:id/servicios',
  authenticateToken,
  PlanController.obtenerServiciosDePlan
);

// POST /api/planes
router.post('/',
  authenticateToken,
  requireRole(['admin']),
  PlanController.crear
);

// PUT /api/planes/:id
router.put('/:id',
  authenticateToken,
  requireRole(['admin']),
  PlanController.actualizar
);

// DELETE /api/planes/:id  (soft delete)
router.delete('/:id',
  authenticateToken,
  requireRole(['admin']),
  PlanController.desactivar
);

export default router;