<<<<<<< HEAD
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
=======
const express = require('express');
const db = require('../config/database');
const { requireRole } = require('../middleware/auth');
const router = express.Router();

// Obtener servicios activos (todos los usuarios)
router.get('/', async (req, res, next) => {
  try {
    const [servicios] = await db.execute(
      'SELECT * FROM servicios WHERE activo = TRUE ORDER BY nombre'
    );

    res.json(servicios);

  } catch (error) {
    next(error);
  }
});

// Crear servicio (solo admin)
router.post('/', requireRole(['admin']), async (req, res, next) => {
  try {
    const { nombre, descripcion, precio, capacidad_maxima, horario_inicio, horario_fin, requiere_reserva } = req.body;

    const [result] = await db.execute(
      'INSERT INTO servicios (nombre, descripcion, precio, capacidad_maxima, horario_inicio, horario_fin, requiere_reserva) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, capacidad_maxima, horario_inicio, horario_fin, requiere_reserva]
    );

    res.status(201).json({
      message: 'Servicio creado exitosamente',
      id: result.insertId
    });

  } catch (error) {
    next(error);
  }
});

// Actualizar servicio (solo admin)
router.put('/:id', requireRole(['admin']), async (req, res, next) => {
  try {
    const { nombre, descripcion, precio, capacidad_maxima, horario_inicio, horario_fin, requiere_reserva, activo } = req.body;

    const [result] = await db.execute(
      'UPDATE servicios SET nombre = ?, descripcion = ?, precio = ?, capacidad_maxima = ?, horario_inicio = ?, horario_fin = ?, requiere_reserva = ?, activo = ? WHERE id = ?',
      [nombre, descripcion, precio, capacidad_maxima, horario_inicio, horario_fin, requiere_reserva, activo, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    res.json({ message: 'Servicio actualizado exitosamente' });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
