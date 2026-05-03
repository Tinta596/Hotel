export const ok = (res, data, msg='Ok') => res.status(200).json({ok: true, mensaje: msg, data});
export const creado = (res, data, msg="Creado") => res.status(201).json({ ok: true, mensaje: msg, data});
export const error = (res, data, msg=400) => res.status(code).json({ok: false, mensaje: msg, data});
export const interno = (res) => res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });