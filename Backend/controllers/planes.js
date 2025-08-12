import db from '../config/database.js';

// Obtener todos los planes activos
export async function obtenerPlanes(req, res, next) {
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
}

// Crear un nuevo plan con servicios incluidos
export async function crearPlan(req, res, next) {
  try {
    const { nombre, descripcion, precio_adicional, duracion_dias, servicios } = req.body;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Insertar nuevo plan
      const [planResult] = await connection.execute(
        'INSERT INTO planes (nombre, descripcion, precio_adicional, duracion_dias) VALUES (?, ?, ?, ?)',
        [nombre, descripcion, precio_adicional, duracion_dias]
      );

      const planId = planResult.insertId;

      // Asociar servicios (si los hay)
      if (servicios?.length > 0) {
        for (const servicio of servicios) {
          await connection.execute(
            'INSERT INTO plan_servicios (plan_id, servicio_id, cantidad_incluida) VALUES (?, ?, ?)',
            [planId, servicio.servicio_id, servicio.cantidad_incluida]
          );
        }
      }

      await connection.commit();
      res.status(201).json({ message: 'Plan creado exitosamente', id: planId });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
}