import * as LogService from "./log.service.js";

export const createLogController = async (req, res, next) => {
  try {
    const { action, description, metadata } = req.body;
    const newLog = await LogService.createLog({
      action,
      description,
      user: req.usuario?.id, // De authenticateToken middleware
      metadata
    });
    res.status(201).json(newLog);
  } catch (error) {
    next(error);
  }
};

export const getLogsController = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, action, user } = req.query;
    const filters = {};
    if (action) filters.action = action;
    if (user) filters.user = user;

    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      LogService.getAllLogs(filters, parseInt(limit), skip),
      LogService.countLogs(filters)
    ]);

    res.json({
      data: logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getLogDetailController = async (req, res, next) => {
  try {
    const log = await LogService.getLogById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log no encontrado' });
    res.json(log);
  } catch (error) {
    next(error);
  }
};