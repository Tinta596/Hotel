import db from '../config/database.js';
import * as PlanModel from '../models/plan.model.js';

export const listar = async () => {
  const [rows] = await PlanModel.findAll();
  return rows;
};

export const obtenerPorId = async (id) => {
  const [[plan]] = await PlanModel.findById(id);
  if (!plan) throw { status: 404, message: 'Plan no encontrado' };
  return plan;
};

export const obtenerServiciosDePlan = async (id) => {
  await obtenerPorId(id); // valida que existe
  const [rows] = await PlanModel.findServiciosByPlan(id);
  return rows;
};

export const crear = async (data) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Insertar plan
    const [result] = await PlanModel.insert(conn, data);
    const planId   = result.insertId;

    // Insertar servicios si los hay
    for (const servicio of data.servicios) {
      await PlanModel.insertServicio(
        conn, planId,
        servicio.servicio_id,
        servicio.cantidad_incluida
      );
    }

    await conn.commit();

    // Retornar el plan recién creado con sus servicios
    const [[plan]] = await PlanModel.findById(planId);
    return plan;

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const actualizar = async (id, data) => {
  await obtenerPorId(id); // valida que existe

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Actualizar campos del plan si vienen
    const { servicios, ...camposPlan } = data;
    if (Object.keys(camposPlan).length > 0) {
      await PlanModel.update(conn, id, camposPlan);
    }

    // Si vienen servicios, reemplazar los anteriores
    if (servicios !== undefined) {
      await PlanModel.deleteServiciosByPlan(conn, id);
      for (const servicio of servicios) {
        await PlanModel.insertServicio(
          conn, id,
          servicio.servicio_id,
          servicio.cantidad_incluida
        );
      }
    }

    await conn.commit();

    const [[plan]] = await PlanModel.findById(id);
    return plan;

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const desactivar = async (id) => {
  await obtenerPorId(id); // valida que existe
  await PlanModel.desactivar(id);
};