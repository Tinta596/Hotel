<<<<<<< HEAD
import { Router } from 'express';
const router = Router();
import { register, login } from '../controllers/auth.js';

// Registro de usuario
router.post('/register', register);

// Login
router.post('/login', login);

export default router;
