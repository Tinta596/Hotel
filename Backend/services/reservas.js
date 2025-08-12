import db from '../config/database.js';

export const calcularPrecioTotal = async (checkIn, checkOut, habitacion_id, plan_id = null) => {
  const [habitacionData] = await db.execute(`
      SELECT th.precio_base, th.nombre AS tipo_nombre
      FROM habitaciones h
      JOIN tipos_habitacion th ON h.tipo_habitacion_id = th.id
      WHERE h.id = ?
    `, [habitacion_id]);

    if (habitacionData.length === 0){
      throw new Error('Habitación no encontrada');
    }

    const precioBase = habitacionData[0].precio_base;

    const dias = Math.cell((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    let total = dias * precioBase;

    if(plan_id){
      const [planData] = await db.execute(
        `
          SELECT precio_adicional, duracion_dias
          FROM planes
          WHERE id = ? AND activo = TRUE
        `, [plan_id]
      );

      if (planData.length > 0){
        const { precio_adicional , duracion_dias } = planData[0];

        // Se agrega el precio adicional al total, multiplicado por la duración del plan si aplica
        total += precio_adicional * (duracion_dias || 1);
      }
    }

    return total;
}

export default {
  calcularPrecioTotal,
};