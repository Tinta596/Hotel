import { createLog, getAllLogs } from "./log.service.js";

export const createLogController = async (req, res) => {
    try {
        const {action, descripcion, user, metadata} = req.body;
        const newLog = await createLog({action, descripcion, user, metadata});
        res.status(201).json(newLog);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear log' });
    }
};

export const getLogsController = async (_req, res) => {
  try {
    const logs = await getAllLogs();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener logs' });
  }
};