import { Router } from 'express';
import * as AnalyticsController from '../controllers/analytics.controller.js';
import { requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get(
  '/',
  requireRole(['admin', 'trabajador']),
  AnalyticsController.getDashboardAnalytics
);

router.get(
  '/export',
  requireRole(['admin']),
  AnalyticsController.exportAnalyticsPDF
);

export default router;
