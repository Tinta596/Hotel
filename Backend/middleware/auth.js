<<<<<<< HEAD
import pkg from 'jsonwebtoken';
const {verify} = pkg;
import db from '../config/database.js';
=======
const jwt = require('jsonwebtoken');
const db = require('../config/database');
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
const JWT_SECRET = process.env.JWT_SECRET;

// Autenticación del token y verificación del usuario activo
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
<<<<<<< HEAD
    console.warn('❌ No se envió token en la cabecera Authorization');
=======
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
<<<<<<< HEAD
    const decoded = verify(token, JWT_SECRET);
    console.log('🔐 Token decodificado:', decoded);
=======
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.userId) {
      return res.status(403).json({ error: 'Token no válido - sin ID de usuario' });
    }
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a

    const [users] = await db.execute(
      `SELECT u.*, r.nombre as rol_nombre 
       FROM usuarios u 
       JOIN roles r ON u.rol_id = r.id 
       WHERE u.id = ? AND u.activo = TRUE`,
      [decoded.userId]
    );

    if (users.length === 0) {
<<<<<<< HEAD
      console.warn('⚠️ Usuario no encontrado o inactivo en la base de datos');
=======
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
      return res.status(401).json({ error: 'Usuario no válido o inactivo' });
    }

    req.user = users[0];
    next();
<<<<<<< HEAD
  } catch (error) {
    console.error('❌ Error al verificar token o ejecutar consulta:', error.message);
=======

  } catch (error) {
    console.error('❌ Error en authenticateToken:', error);
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
    return res.status(403).json({ error: 'Token no válido' });
  }
};

// Middleware para verificar rol (admin, trabajador, etc.)
<<<<<<< HEAD
function requireRole(roles) {
  return (req, res, next) => {
    console.log('👤 Usuario:', req.user);

    if (!roles.includes(req.user?.rol_nombre)) {
      return res.status(403).json({ error: 'Acceso denegado: rol insuficiente' });
=======
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!roles.includes(req.user.rol_nombre)) {
      return res.status(403).json({ error: 'Permisos insuficientes' });
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
    }

    next();
  };
<<<<<<< HEAD
}
                       
=======
};

>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
// Middleware para permitir al dueño del recurso o al admin
const isOwnerOrAdmin = (req, res, next) => {
  if (req.user.rol_nombre === 'admin') {
    return next();
  }

<<<<<<< HEAD
  // Aquí chequeas id del recurso en params, body o query:
=======
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
  const resourceUserId = req.params.userId || req.body.usuario_id || req.query.usuario_id;

  if (resourceUserId && parseInt(resourceUserId) !== req.user.id) {
    return res.status(403).json({ error: 'Solo puedes acceder a tus propios recursos' });
  }

  next();
};

<<<<<<< HEAD
export  { authenticateToken, requireRole, isOwnerOrAdmin };
=======
module.exports = { authenticateToken, requireRole, isOwnerOrAdmin };
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
