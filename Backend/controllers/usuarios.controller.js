import db from '../config/database.js';

export async function obtenerUsuarios(req, res, next) {
    try {
        console.log('📥 Obteniendo usuarios...');
        const [usuarios] = await db.execute(`
            SELECT id, nombre, email, activo, creado_en,
                   CASE WHEN rol = 'recepcionista' THEN 'trabajador' ELSE rol END AS rol
            FROM usuarios
            WHERE eliminado_en IS NULL
            ORDER BY creado_en DESC
        `);
        console.log('✅ Usuarios obtenidos:', usuarios);
        res.json(usuarios);
    } catch (error) {
        console.error('❌ Error en obtenerUsuarios:', error.message, error.stack);
        next(error);
    }
}

export async function cambiarEstadoUsuario(req, res, next) {
  try {
    const { activo } = req.body;
    const { id } = req.params;

    const [result] = await db.execute(
      'UPDATE usuarios SET activo = ? WHERE id = ?',
      [activo, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Estado de usuario actualizado exitosamente' });
  } catch (error) {
    next(error);
  }
}
