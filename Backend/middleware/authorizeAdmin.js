module.exports = function authorizeAdmin(req, res, next){
    const user = req.user;

    if(!user || user.rol !== 'admin'){
        return res.status(403).json({ error: 'Acceso restringido: solo administradores' });
    }

    next();
}