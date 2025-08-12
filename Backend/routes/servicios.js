import { Router } from 'express';
const router = Router();
import upload from '../middleware/upload.js';
import {requireRole , authenticateToken} from '../middleware/auth.js';


import { 
  obtenerServicios, 
  crearServicio, 
  subirImagen, 
  actualizarServicio, 
  eliminarServicio, 
  toggleActivo, 
  toggleEstadoServicio } from '../controllers/servicios.js';

// Obtener todos los servicios
router.get('/', authenticateToken, obtenerServicios);

// Crear un nuevo servicio
router.post(
  '/',
  authenticateToken,
  requireRole(['admin']),
  upload.single('imagen'),
  crearServicio
);

// Subir imagen de servicio
router.post(
  '/subir-imagen',
  authenticateToken,
  requireRole(['admin']),
  upload.single('imagen'),
  subirImagen
);

// Actualizar un servicio
router.put(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  upload.single('imagen'),
  actualizarServicio
);

// Eliminar un servicio
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  eliminarServicio
);

// Alternar estado activo/inactivo
router.put(
  '/:id/toggle',
  authenticateToken,
  requireRole(['admin', 'usuario']),
  toggleActivo
);

router.put(
  '/servicios/:id/toggle',
  authenticateToken,
  toggleEstadoServicio
);

export default router;
