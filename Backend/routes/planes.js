const express = require('express');
const db = require('../config/database');
const { requireRole } = require('../middleware/auth');
const router = express.Router();

// Obtener planes activos (todos los usuarios)
router.get('/', async (req, res, next) => {
  try {
    const [planes] = await db.execute(`
      SELECT p.*, 
             GROUP_CONCAT(CONCAT(s.nombre, ' (', ps.cantidad_incluida, ')') SEPARATOR ', ') as servicios_incluidos
      FROM planes p
      LEFT JOIN plan_servicios ps ON p.id = ps.plan_id
      LEFT JOIN servicios s ON ps.servicio_id = s.id
      WHERE p.activo = TRUE
      GROUP BY p.id
      ORDER BY p.nombre
    `);

    res.json(planes);

  } catch (error) {
    next(error);
  }
});

// Crear plan (solo admin)
router.post('/', requireRole(['admin']), async (req, res, next) => {
  try {
    const { nombre, descripcion, precio_adicional, duracion_dias, servicios } = req.body;

    // Iniciar transacción
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Crear plan
      const [planResult] = await connection.execute(
        'INSERT INTO planes (nombre, descripcion, precio_adicional, duracion_dias) VALUES (?, ?, ?, ?)',
        [nombre, descripcion, precio_adicional, duracion_dias]
      );

      const planId = planResult.insertId;

      // Agregar servicios al plan
      if (servicios && servicios.length > 0) {
        for (const servicio of servicios) {
          await connection.execute(
            'INSERT INTO plan_servicios (plan_id, servicio_id, cantidad_incluida) VALUES (?, ?, ?)',
            [planId, servicio.servicio_id, servicio.cantidad_incluida]
          );
        }
      }

      await connection.commit();
      res.status(201).json({
        message: 'Plan creado exitosamente',
        id: planId
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    next(error);
  }
});

module.exports = router;