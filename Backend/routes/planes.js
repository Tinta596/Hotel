import { Router }        from 'express';
import * as PlanController from '../controllers/plan.controller.js';
import { verifyToken }   from '../middlewares/auth.middleware.js';
import { verifyRol }     from '../middlewares/roles.middleware.js';

const router = Router();

// GET /api/planes
router.get('/',
  verifyToken,
  PlanController.listar
);

// GET /api/planes/:id
router.get('/:id',
  verifyToken,
  PlanController.obtenerPorId
);

// GET /api/planes/:id/servicios
router.get('/:id/servicios',
  verifyToken,
  PlanController.obtenerServiciosDePlan
);

// POST /api/planes
router.post('/',
  verifyToken,
  verifyRol('admin'),
  PlanController.crear
);

// PUT /api/planes/:id
router.put('/:id',
  verifyToken,
  verifyRol('admin'),
  PlanController.actualizar
);

// DELETE /api/planes/:id  (soft delete)
router.delete('/:id',
  verifyToken,
  verifyRol('admin'),
  PlanController.desactivar
);

export default router;