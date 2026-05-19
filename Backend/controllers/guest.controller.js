import * as GuestService from '../services/guest.service.js';

// GET /api/guests
export const getGuests = async (req, res, next) => {
  try {
    const { search, nivel, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const result = await GuestService.listarHuespedes({ search, nivel, limit, offset });
    res.json({
      ...result,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(result.total / limit)
    });
  } catch (err) { next(err); }
};

// GET /api/guests/:id
export const getGuest = async (req, res, next) => {
  try {
    const guest = await GuestService.obtenerHuesped(req.params.id);
    res.json(guest);
  } catch (err) { next(err); }
};

// PATCH /api/guests/:id/profile
export const updateProfile = async (req, res, next) => {
  try {
    await GuestService.actualizarPerfil(req.params.id, req.body);
    res.json({ ok: true });
  } catch (err) { next(err); }
};

// GET /api/guests/:id/notes
export const getNotes = async (req, res, next) => {
  try {
    const [notes] = await (await import('../models/guest.model.js')).findGuestNotes(req.params.id);
    res.json(notes);
  } catch (err) { next(err); }
};

// POST /api/guests/:id/notes
export const createNote = async (req, res, next) => {
  try {
    const note = await GuestService.crearNota(req.params.id, req.body);
    res.status(201).json(note);
  } catch (err) { next(err); }
};

// PUT /api/guests/:id/notes/:noteId
export const updateNote = async (req, res, next) => {
  try {
    await GuestService.editarNota(req.params.noteId, req.body);
    res.json({ ok: true });
  } catch (err) { next(err); }
};

// DELETE /api/guests/:id/notes/:noteId
export const deleteNote = async (req, res, next) => {
  try {
    await GuestService.eliminarNota(req.params.noteId);
    res.json({ ok: true });
  } catch (err) { next(err); }
};

// PATCH /api/guests/:id/loyalty
export const adjustLoyalty = async (req, res, next) => {
  try {
    const result = await GuestService.ajustarPuntos(req.params.id, req.body);
    res.json(result);
  } catch (err) { next(err); }
};
