import bcrypt from 'bcryptjs';
const { hash, compare } = bcrypt;
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import Joi from 'joi';
import db from '../config/database.js';

const publicRole = dbRole => {
  if (dbRole === 'recepcionista') return 'trabajador';
  if (dbRole === 'cliente') return 'cliente';
  return dbRole;
};

const databaseRole = role => {
  if (role === 'trabajador' || role === 'recepcionista') return 'recepcionista';
  if (role === 'cliente' || role === 'usuario') return 'cliente';
  return role;
};

const tokenFor = user =>
  sign(
    { userId: user.id, rol: publicRole(user.rol) },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  rol: Joi.string().valid('admin', 'trabajador', 'recepcionista', 'usuario', 'cliente').default('cliente')
});

export async function register(req, res, next) {
  try {
    const { error, value } = registerSchema.validate(req.body, { stripUnknown: true });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { nombre, email, password } = value;
    const rol = databaseRole(value.rol);

    const [existing] = await db.execute(
      'SELECT id FROM usuarios WHERE email = ? AND eliminado_en IS NULL',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'El email ya esta registrado' });
    }

    const passwordHash = await hash(password, 12);
    const [result] = await db.execute(
      'INSERT INTO usuarios (nombre, email, password_hash, rol, activo, nivel_fidelidad, tipo_cliente, puntos_fidelidad) VALUES (?, ?, ?, ?, 1, "basico", "individual", 0)',
      [nombre, email, passwordHash, rol]
    );

    const user = {
      id: result.insertId,
      nombre,
      email,
      rol
    };

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token: tokenFor(user),
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: publicRole(user.rol),
        nivel_fidelidad: 'basico',
        tipo_cliente: 'individual',
        puntos_fidelidad: 0
      }
    });
  } catch (error) {
    console.error('Error en /register:', error);
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;
    const [users] = await db.execute(
      `SELECT id, nombre, email, password_hash, rol, activo, nivel_fidelidad, tipo_cliente, puntos_fidelidad
       FROM usuarios
       WHERE email = ? AND eliminado_en IS NULL
       LIMIT 1`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const user = users[0];
    if (!user.activo) {
      return res.status(403).json({ error: 'Cuenta desactivada, contacta al administrador' });
    }

    const valid = await compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    res.json({
      token: tokenFor(user),
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: publicRole(user.rol),
        nivel_fidelidad: user.nivel_fidelidad || 'basico',
        tipo_cliente: user.tipo_cliente || 'individual',
        puntos_fidelidad: user.puntos_fidelidad || 0
      }
    });
  } catch (error) {
    next(error);
  }
}
