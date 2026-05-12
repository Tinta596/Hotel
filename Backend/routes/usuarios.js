import { Router } from 'express';
const router = Router();
import { obtenerUsuarios, cambiarEstadoUsuario } from '../controllers/usuarios.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import authorizeAdmin from '../middleware/authorizeAdmin.js';

// Protección global para TODO el router
router.use(authenticateToken, authorizeAdmin);

// Obtener todos los usuarios
router.get('/', requireRole(['admin']), obtenerUsuarios);

// Cambiar estado activo/inactivo
router.put('/:id/estado', requireRole(['admin']), cambiarEstadoUsuario);

export default router;
