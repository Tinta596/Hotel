import { Router } from "express";
import {
  obtenerReservas,
  crearReserva,
  obtenerHabitacionesDisponibles,
  obtenerHabitacionPorId,
  actualizarEstadoReserva,
  cancelarReserva,
  verificarDisponibilidad,
  reservarConServicios,
  actualizarFechasReserva,
  obtenerHabitaciones,
  actualizarPrecioHabitacion
} from "../controllers/habitaciones.js";

import { authenticateToken, requireRole, isOwnerOrAdmin } from "../middleware/auth.js";

const router = Router();

// 🔒 Middleware global de autenticación
router.use(authenticateToken);

//
// 📦 Rutas de reservas
//
router.get('/', obtenerReservas);                     // GET /api/habitaciones/
router.post('/', crearReserva);                       // POST /api/habitaciones/
router.get('/verificar', verificarDisponibilidad);    // GET /api/habitaciones/verificar
router.post('/reservar', reservarConServicios);       // POST /api/habitaciones/reservar
router.put('/:id/actualizar-fechas', isOwnerOrAdmin, actualizarFechasReserva); // PUT /api/habitaciones/:id/actualizar-fechas
router.put('/:id/cancelar', isOwnerOrAdmin, cancelarReserva);                  // PUT /api/habitaciones/:id/cancelar
router.put('/:id/estado', requireRole(['admin', 'trabajador']), actualizarEstadoReserva); // PUT /api/habitaciones/:id/estado

//
// 🛏️ Habitaciones
//
router.get('/disponibles', obtenerHabitacionesDisponibles);   // GET /api/habitaciones/disponibles
router.get('/habitaciones', requireRole(['admin', 'trabajador','usuarios']), obtenerHabitaciones); // GET /api/habitaciones/habitaciones
router.get('/:id', requireRole(['admin', 'trabajador', 'usuario']), obtenerHabitacionPorId); // GET /api/habitaciones/:id
router.put('/:id/precio', requireRole(['admin']), actualizarPrecioHabitacion); // PUT /api/habitaciones/:id/precio

export default router;