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