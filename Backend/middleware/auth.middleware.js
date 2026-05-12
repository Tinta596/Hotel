import pkg from 'jsonwebtoken';
const { verify } = pkg;

import db from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET;
const publicRole = dbRole => (dbRole === 'recepcionista' ? 'trabajador' : dbRole);

// renombrado de authenticateToken a verifyToken
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token      = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    const decoded = verify(token, JWT_SECRET);

    const [users] = await db.execute(
      `SELECT u.id, u.nombre, u.email, u.rol, u.activo
       FROM usuarios u
       WHERE u.id = ? AND u.activo = TRUE AND u.eliminado_en IS NULL`,
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Usuario no válido o inactivo' });
    }

    req.user = { ...users[0], rol_nombre: publicRole(users[0].rol) };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token no válido' });
  }
};

// renombrado de requireRole a verifyRol
export const verifyRol = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.rol_nombre)) {
    return res.status(403).json({ error: 'Acceso denegado: rol insuficiente' });
  }
  next();
};

// Middleware: Autenticación del token y verificación del usuario activo
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    console.warn('❌ No se envió token en la cabecera Authorization');
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    const decoded = verify(token, JWT_SECRET);
    console.log('🔐 Token decodificado:', decoded);

    const [users] = await db.execute(
      `SELECT u.id, u.nombre, u.email, u.rol, u.activo
       FROM usuarios u
       WHERE u.id = ? AND u.activo = TRUE AND u.eliminado_en IS NULL`,
      [decoded.userId]
    );

    if (users.length === 0) {
      console.warn('⚠️ Usuario no encontrado o inactivo en la base de datos');
      return res.status(401).json({ error: 'Usuario no válido o inactivo' });
    }

    req.user = { ...users[0], rol_nombre: publicRole(users[0].rol) };
    next();
  } catch (error) {
    console.error('❌ Error al verificar token o ejecutar consulta:', error.message);
    return res.status(403).json({ error: 'Token no válido' });
  }
};

// Middleware para verificar rol (admin, trabajador, etc.)
// Middleware: Verificación de rol (admin, trabajador, etc.)
function requireRole(roles) {
  return (req, res, next) => {
    console.log('👤 Usuario:', req.user);

    if (!roles.includes(req.user?.rol_nombre)) {
      return res.status(403).json({ error: 'Acceso denegado: rol insuficiente' });
    }

    next();
  };
}
                       
// Middleware para permitir al dueño del recurso o al admin
const isOwnerOrAdmin = (req, res, next) => {
  if (req.user.rol_nombre === 'admin') {
    return next();
  }

  // Aquí chequeas id del recurso en params, body o query:
  const resourceUserId = req.params.userId || req.body.usuario_id || req.query.usuario_id;
  if (resourceUserId && Number.parseInt(resourceUserId) !== req.user.id) {
    return res
      .status(403)
      .json({ error: 'Solo puedes acceder a tus propios recursos' });
  }

  next();
};

export { authenticateToken, requireRole, isOwnerOrAdmin };
