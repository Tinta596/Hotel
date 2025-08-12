import db from '../config/database.js';

export async function obtenerUsuarios(req, res, next) {
    try {
        console.log('📥 Obteniendo usuarios...');
        const [usuarios] = await db.execute(`
            SELECT u.id, u.nombre, u.email, u.telefono, u.direccion, u.activo, u.created_at,
                   r.nombre as rol
            FROM usuarios u
            JOIN roles r ON u.rol_id = r.id
            ORDER BY u.created_at DESC
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