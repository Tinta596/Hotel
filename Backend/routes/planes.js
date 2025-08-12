import { Router } from 'express';
const router = Router();
import {requireRole} from '../middleware/auth.js';

import { obtenerPlanes, crearPlan } from '../controllers/planes.js';

// Obtener todos los planes activos
router.get('/', obtenerPlanes);

// Crear un nuevo plan (solo admin)
router.post('/', requireRole(['admin']), crearPlan);

export default router;