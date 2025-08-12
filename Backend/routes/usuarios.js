import { Router } from 'express';
const router = Router();
import { obtenerUsuarios, cambiarEstadoUsuario } from '../controllers/usuarios.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import authorizeAdmin from '../middleware/authorizeAdmin.js';

// Protección global para todo el router
router.use(authenticateToken, authorizeAdmin);

// Obtener todos los usuarios
router.get('/', requireRole(['admin']), obtenerUsuarios);

// Cambiar estado activo/inactivo
router.put('/:id/estado', requireRole(['admin']), cambiarEstadoUsuario);

export default router;