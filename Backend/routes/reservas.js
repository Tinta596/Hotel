import { Router } from 'express';
const router = Router();
import { requireRole, isOwnerOrAdmin, authenticateToken  } from '../middleware/auth.js';
import { 
    calcularPrecioReserva, 
    obtenerReservas, 
    crearReserva, 
    cambiarEstadoReserva, 
    cancelarReserva, 
    reservarConServicios, 
    verificarDisponibilidad, 
    actualizarFechas, 
    eliminarReserva, 
    listarHabitaciones, 
    listarHabitacionesDisponibles } from '../controllers/reservas.js';

router.post('/calcular-precio', calcularPrecioReserva);


// Middleware global: autenticación
router.use(authenticateToken);

// Rutas de reservas
router.get('/', obtenerReservas);
router.post('/', crearReserva);
router.put('/:id/estado', requireRole(['admin', 'trabajador']), cambiarEstadoReserva);
router.put('/:id/cancelar', isOwnerOrAdmin, cancelarReserva);
router.post('/reservar', reservarConServicios);
router.get('/verificar-disponibilidad', verificarDisponibilidad);
router.put('/:id/actualizar-fechas', actualizarFechas);
router.delete('/:id', requireRole(['admin', 'trabajador', 'usuario']), eliminarReserva);

// Rutas relacionadas con habitaciones
router.get('/habitaciones', requireRole(['admin', 'trabajador']), listarHabitaciones);
router.get('/disponibles', listarHabitacionesDisponibles);

export default router;