import express from 'express';
import { createLogController, getLogsController } from './log.controller.js';

const router = express.Router();

router.post('/logs', createLogController);
router.get('/logs', getLogsController);

export default router;