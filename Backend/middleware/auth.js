const jwt = require('jsonwebtoken');
const db = require('../config/database');
const JWT_SECRET = process.env.JWT_SECRET;

// Autenticación del token y verificación del usuario activo
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.userId) {
      return res.status(403).json({ error: 'Token no válido - sin ID de usuario' });
    }

    const [users] = await db.execute(
      `SELECT u.*, r.nombre as rol_nombre 
       FROM usuarios u 
       JOIN roles r ON u.rol_id = r.id 
       WHERE u.id = ? AND u.activo = TRUE`,
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Usuario no válido o inactivo' });
    }

    req.user = users[0];
    next();

  } catch (error) {
    console.error('❌ Error en authenticateToken:', error);
    return res.status(403).json({ error: 'Token no válido' });
  }
};

// Middleware para verificar rol (admin, trabajador, etc.)
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!roles.includes(req.user.rol_nombre)) {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }

    next();
  };
};

// Middleware para permitir al dueño del recurso o al admin
const isOwnerOrAdmin = (req, res, next) => {
  if (req.user.rol_nombre === 'admin') {
    return next();
  }

  const resourceUserId = req.params.userId || req.body.usuario_id || req.query.usuario_id;

  if (resourceUserId && parseInt(resourceUserId) !== req.user.id) {
    return res.status(403).json({ error: 'Solo puedes acceder a tus propios recursos' });
  }

  next();
};

module.exports = { authenticateToken, requireRole, isOwnerOrAdmin };