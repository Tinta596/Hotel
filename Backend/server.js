require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const reservasRoutes = require('./routes/reservas');
const habitacionesRoutes = require('./routes/habitaciones');
const serviciosRoutes = require('./routes/servicios');
const planesRoutes = require('./routes/planes');
const usuariosRoutes = require('./routes/usuarios');

const { authenticateToken } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Logging y parsing
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/reservas', authenticateToken, reservasRoutes);
app.use('/api/habitaciones', authenticateToken, habitacionesRoutes);
app.use('/api/servicios', authenticateToken, serviciosRoutes);
app.use('/api/planes', authenticateToken, planesRoutes);
app.use('/api/usuarios', authenticateToken, usuariosRoutes);

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Manejo de errores
app.use(errorHandler);

// ✅ Solo iniciar el servidor si se ejecuta directamente
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    //console.log('JWT_SECRET cargado desde .env:', process.env.JWT_SECRET);
  });
}

module.exports = app;