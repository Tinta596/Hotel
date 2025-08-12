import bcrypt from 'bcryptjs';
const {hash, compare} = bcrypt;
import pkg from 'jsonwebtoken';
const {sign} = pkg;
import Joi from 'joi';
import db from '../config/database.js';

// Validaciones
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  telefono: Joi.string().optional(),
  direccion: Joi.string().optional(),
  rol: Joi.string().required()
});

// Registro
export async function register(req, res, next) {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) throw error;

    const { nombre, email, password, telefono, direccion, rol } = value;

    // Verificar rol válido
    const [roles] = await db.execute('SELECT id FROM roles WHERE nombre = ?', [rol]);
    if (roles.length === 0) {
      return res.status(400).json({ error: 'Rol inválido' });
    }
    const rolId = roles[0].id;

    // Verificar duplicado
    const [existing] = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Guardar contraseña hasheada
    const hashed = await hash(password, 12);

    const [result] = await db.execute(
      'INSERT INTO usuarios (nombre, email, password, telefono, direccion, rol_id) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, email, hashed, telefono, direccion, rolId]
    );

    // Generar token con rol
    const token = sign(
      { userId: result.insertId, rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      userId: result.insertId,
      token,
      user: { id: result.insertId, nombre, email, rol }
    });
  } catch (error) {
    console.error('Error en /register:', error);
    next(error);
  }
}

// Login
export async function login(req, res, next) {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) throw error;

    const { email, password } = value;

    const [users] = await db.execute(
      `SELECT u.*, r.nombre as rol
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id
       WHERE u.email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = users[0];
    if (!user.activo) {
      return res.status(403).json({ error: 'Cuenta desactivada, contacta al administrador' });
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = sign(
      { userId: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`🔐 Token generado:`, token);

    res.json({
      token,
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }
    });
  } catch (error) {
    next(error);
  }
}