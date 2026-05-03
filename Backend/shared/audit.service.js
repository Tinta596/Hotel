import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
    accion: String,
    entidad: String,
    entidad_id: Number,
    usuario_id: Number,
    usuario_nombre: String,
    usuario_rol: String,
    datos_anteriores: mongoose.Schema.Types.Mixed,
    datos_nuevos: mongoose.Schema.Types.Mixed,
    ip: String,
    descripcion: String,
    timestamp: { type: Date, default: Date.now },
});

const AuditLog = mongoose.model('AuditLog', auditSchema);

export const register = async({
    accion, entidad, entidad_id, usuario, datos_anteriores, datos_nuevos, ip, descripcion
}) => {
    try {
        await AuditLog.create({
            accion, entidad, entidad_id,
            usuario_id:     usuario.id,
            usuario_nombre: usuario.nombre,
            usuario_rol:    usuario.rol,
            datos_anteriores, datos_nuevos, ip, descripcion,
        })
    } catch (error) {
        console.error('Error al registrar auditoría: ', error.message);
    }
}