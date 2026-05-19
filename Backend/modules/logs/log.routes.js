import { Router } from 'express';
import * as LogController from './log.controller.js';
import { authenticateToken, requireRole } from '../../middleware/auth.middleware.js';
import { stealthGuard } from '../../middleware/stealth.middleware.js';

const router = Router();

// Capa 1: Llave secreta (Stealth) - Si falla, devuelve 404 (Ruta invisible)
router.use(stealthGuard);

// Capa 2 y 3: Auth estándar y Rol
router.use(authenticateToken);
router.use(requireRole(['admin']));

router.get('/data', LogController.getLogsController);
router.get('/data/:id', LogController.getLogDetailController);
router.post('/push', LogController.createLogController);

export default router;