import * as ServicioModel from '../models/servicios.model.js';

export const listar = async (soloActivos = false) => {
    const [rows] = soloActivos
       ? await ServicioModel.findActivos()
       : await ServicioModel.findAll();
    return rows;
};

export const obtenerPorId = async (id) => {
    const [[servicio]] = await ServicioModel.findById(id);
    if (!servicio) throw {status: 404, message: 'Servicio no encontrado'};
    return servicio;
};

export const crear = async (data, archivo) => {
    const imagen_url = archivo
      ? `/uploads/servicios/${archivo.filename}`
      : null;
    
    const [result] = await ServicioModel.insert({ ...data, imagen_url});
    const [[servicio]] = await ServicioModel.findById(result.insertId);
    return servicio;
}

export const actualizar = async (id, data, archivo) => {
  await obtenerPorId(id); // valida que existe

  const imagen_url = archivo
    ? `/uploads/servicios/${archivo.filename}`
    : undefined; // undefined = no actualizar imagen

  const [result] = await ServicioModel.update(id, {
    ...data,
    ...(imagen_url !== undefined && { imagen_url }),
  });

  if (result.affectedRows === 0) throw { status: 404, message: 'Servicio no encontrado' };

  const [[servicio]] = await ServicioModel.findById(id);
  return servicio;
};

export const cambiarEstado = async (id) => {
  const nuevoEstado = await ServicioModel.toggleActivo(id);
  if (nuevoEstado === null) throw { status: 404, message: 'Servicio no encontrado' };
  return nuevoEstado;
};

export const eliminar = async (id) => {
  await obtenerPorId(id); // valida que existe
  await ServicioModel.softDelete(id);
};

export const subirImagen = async (id, archivo) => {
  if (!archivo) throw { status: 400, message: 'No se recibió ninguna imagen' };
  await obtenerPorId(id); // valida que existe

  const imagen_url = `/uploads/servicios/${archivo.filename}`;
  await ServicioModel.updateImagen(id, imagen_url);
  return imagen_url;
};