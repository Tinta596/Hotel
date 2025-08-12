<<<<<<< HEAD
import { Router } from 'express';
const router = Router();
import { obtenerUsuarios, cambiarEstadoUsuario } from '../controllers/usuarios.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import authorizeAdmin from '../middleware/authorizeAdmin.js';

// Protección global para todo el router
router.use(authenticateToken, authorizeAdmin);

// Obtener todos los usuarios
router.get('/', requireRole(['admin']), obtenerUsuarios);

// Cambiar estado activo/inactivo
router.put('/:id/estado', requireRole(['admin']), cambiarEstadoUsuario);

export default router;
=======
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const authorizeAdmin = require('../middleware/authorizeAdmin');

const router = express.Router();

// Protección global
router.use(authenticateToken, authorizeAdmin);

// Obtener usuarios
router.get('/', requireRole(['admin']), async (req, res, next) => {
  try {
    const [usuarios] = await db.execute(`
      SELECT u.id, u.nombre, u.email, u.telefono, u.direccion, u.activo, u.created_at,
             r.nombre as rol
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      ORDER BY u.created_at DESC
    `);

    res.json(usuarios);

  } catch (error) {
    next(error);
  }
});

// Crear usuario
router.post('/', requireRole(['admin']), async (req, res, next) => {
  try {
    const { nombre, email, password, telefono, direccion, rol_nombre } = req.body;

    const [roles] = await db.execute('SELECT id FROM roles WHERE nombre = ?', [rol_nombre]);
    if (roles.length === 0) return res.status(400).json({ error: 'Rol no válido' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
      'INSERT INTO usuarios (nombre, email, password, telefono, direccion, rol_id) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, email, hashedPassword, telefono, direccion, roles[0].id]
    );

    res.status(201).json({ message: 'Usuario creado exitosamente', id: result.insertId });

  } catch (error) {
    next(error);
  }
});

// Cambiar estado de usuario
router.put('/:id/estado', requireRole(['admin']), async (req, res, next) => {
  try {
    const { activo } = req.body;

    const [result] = await db.execute(
      'UPDATE usuarios SET activo = ? WHERE id = ?',
      [activo, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ message: 'Estado de usuario actualizado exitosamente' });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
