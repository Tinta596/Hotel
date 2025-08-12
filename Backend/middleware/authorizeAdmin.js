function authorizeAdmin(req, res, next) {
  if (req.user && req.user.rol_nombre === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Acceso denegado: solo administradores' });
  }
}

export default authorizeAdmin;
