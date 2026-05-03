// routes/servicio.routes.js
import { Router }            from 'express';
import * as ServicioController from '../controllers/servicio.controller.js';
import { verifyToken }       from '../middlewares/auth.middleware.js';
import { verifyRol }         from '../middlewares/roles.middleware.js';
import { upload }            from '../middlewares/upload.middleware.js';

const router = Router();

// GET /api/servicios
// GET /api/servicios?activos=true  → solo activos (frontend público)
router.get('/',
  verifyToken,
  ServicioController.listar
);

// GET /api/servicios/:id
router.get('/:id',
  verifyToken,
  ServicioController.obtenerPorId
);

// POST /api/servicios
router.post('/',
  verifyToken,
  verifyRol('admin'),
  upload.single('imagen'),
  ServicioController.crear
);

// PUT /api/servicios/:id
router.put('/:id',
  verifyToken,
  verifyRol('admin'),
  upload.single('imagen'),
  ServicioController.actualizar
);

// PATCH /api/servicios/:id/estado
// → toggleActivo y toggleEstadoServicio unificados en uno solo
router.patch('/:id/estado',
  verifyToken,
  verifyRol('admin', 'trabajador'),
  ServicioController.cambiarEstado
);

// PATCH /api/servicios/:id/imagen
// → subir imagen de forma independiente
router.patch('/:id/imagen',
  verifyToken,
  verifyRol('admin'),
  upload.single('imagen'),
  ServicioController.subirImagen
);

// DELETE /api/servicios/:id  (soft delete)
router.delete('/:id',
  verifyToken,
  verifyRol('admin'),
  ServicioController.eliminar
);

export default router;