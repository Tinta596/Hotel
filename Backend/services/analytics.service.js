import * as AnalyticsModel from '../models/analytics.model.js';
import mongoose from 'mongoose';

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', new mongoose.Schema({}));

export const getDashboardData = async () => {
  const resumen = await AnalyticsModel.getResumenGeneral();
  const [ingresos] = await AnalyticsModel.getIngresosMensuales();
  const [servicios] = await AnalyticsModel.getServiciosPopulares();
  const [reservas] = await AnalyticsModel.getReservasRecientes();

  // Obtener actividad reciente de MongoDB
  let actividad = [];
  try {
    actividad = await AuditLog.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();
  } catch (error) {
    console.error('Error al obtener actividad:', error.message);
  }

  return {
    resumen,
    ingresos: ingresos.reverse(), // Para que el gráfico vaya de pasado a presente
    servicios,
    reservas,
    actividad
  };
};
