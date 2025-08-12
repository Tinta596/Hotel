import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']; // 'Bearer TOKEN'
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      } else {
        return res.status(403).json({ error: 'Token inválido' });
      }
    }
    req.user = user;
    next();
  });
}

export function requireRole(roles = []) {
  return (req, res, next) => {
    console.log('Usuario autenticado:', req.user); // Mostrar info del usuario
    if (!req.user || !roles.includes(req.user.role)) {
      console.log('Acceso denegado. Rol esperado:', roles, 'Rol recibido:', req.user?.role);
      return res.status(403).json({ error: 'No autorizado para esta acción' });
    }
    next();
  };
}