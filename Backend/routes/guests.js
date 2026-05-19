import { Router } from 'express';
import * as GuestController from '../controllers/guest.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

const staffOnly = requireRole(['admin', 'trabajador']);

// Listado y perfil
router.get('/',           authenticateToken, staffOnly, GuestController.getGuests);
router.get('/:id',        authenticateToken, staffOnly, GuestController.getGuest);
router.patch('/:id/profile', authenticateToken, staffOnly, GuestController.updateProfile);

// Notas
router.get('/:id/notes',             authenticateToken, staffOnly, GuestController.getNotes);
router.post('/:id/notes',            authenticateToken, staffOnly, GuestController.createNote);
router.put('/:id/notes/:noteId',     authenticateToken, staffOnly, GuestController.updateNote);
router.delete('/:id/notes/:noteId',  authenticateToken, staffOnly, GuestController.deleteNote);

// Fidelidad
router.patch('/:id/loyalty', authenticateToken, requireRole(['admin']), GuestController.adjustLoyalty);

export default router;
