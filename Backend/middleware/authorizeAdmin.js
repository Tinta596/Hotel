<<<<<<< HEAD
function authorizeAdmin(req, res, next) {
  if (req.user && req.user.rol_nombre === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Acceso denegado: solo administradores' });
  }
}

export default authorizeAdmin;
=======
module.exports = function authorizeAdmin(req, res, next){
    const user = req.user;

    if(!user || user.rol !== 'admin'){
        return res.status(403).json({ error: 'Acceso restringido: solo administradores' });
    }

    next();
}
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
