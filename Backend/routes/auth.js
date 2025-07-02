const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const db = require('../config/database');
const router = express.Router();

// Esquemas de validación
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  telefono: Joi.string().optional(),
  direccion: Joi.string().optional()
});

// Registro de usuario
router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = registerSchema.append({ rol: Joi.string().required() }).validate(req.body);
    if (error) throw error;

    const { nombre, email, password, telefono, direccion, rol } = value;

    // Validar rol recibido
    const [roles] = await db.execute('SELECT id FROM roles WHERE nombre = ?', [rol]);
    if (roles.length === 0) {
      return res.status(400).json({ error: 'Rol inválido' });
    }
    const rolId = roles[0].id;

    // Verificar si el usuario ya existe
    const [existingUsers] = await db.execute(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insertar nuevo usuario con el rol recibido
    const [result] = await db.execute(
      'INSERT INTO usuarios (nombre, email, password, telefono, direccion, rol_id) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, email, hashedPassword, telefono, direccion, rolId]
    );

    // Generar token con el rol correspondiente
    const token = jwt.sign(
      { userId: result.insertId, rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      userId: result.insertId,
      token,
      user: {
        id: result.insertId,
        nombre,
        email,
        rol
      }
    });

  } catch (error) {
    console.error('Error en /register:', error);
    next(error);
  }
});


// Login
router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) throw error;

    const { email, password } = value;

    // Buscar usuario
    const [users] = await db.execute(
      'SELECT u.*, r.nombre as rol_nombre FROM usuarios u JOIN roles r ON u.rol_id = r.id WHERE u.email = ? AND u.activo = TRUE',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = users[0];

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user.id, rol: user.rol_nombre },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`🔐 Token para ${user.email}:`, token);

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol_nombre
      }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;