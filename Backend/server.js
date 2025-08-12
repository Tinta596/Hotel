import 'dotenv/config';

import { fileURLToPath } from 'url';
import {dirname} from 'path';

import express, { json, urlencoded, static as staticFiles } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import reservasRoutes from './routes/reservas.js';
import habitacionesRoutes from './routes/habitaciones.js';
import serviciosRoutes from './routes/servicios.js';
import planesRoutes from './routes/planes.js';
import usuariosRoutes from './routes/usuarios.js';
import logRoutes from './modules/logs/log.routes.js';

import { authenticateToken } from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';
import { connectMongo } from './config/mongo.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🛡️ Seguridad y middleware globales
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
app.use(morgan('combined'));
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true }));
app.use('/uploads', staticFiles('uploads'));

// 🌐 Rutas públicas
app.use('/api/auth', authRoutes);

// 🔐 Rutas protegidas
app.use('/api', authenticateToken);
app.use('/api/reservas', reservasRoutes);
app.use('/api/habitaciones', habitacionesRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/planes', planesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api', logRoutes);

// ✅ Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// ❌ Middleware de errores
app.use(errorHandler);

// ✅ Iniciar servidor si se ejecuta directamente
if (process.argv[1] === __filename) {

  const PORT = process.env.PORT;

  connectMongo()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ Error al conectar a MongoDB:', err);
      process.exit(1);
    });
}

export default app;
