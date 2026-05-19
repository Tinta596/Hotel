import * as AnalyticsService from '../services/analytics.service.js';
import * as InvoiceService from '../services/invoice.service.js';

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const data = await AnalyticsService.getDashboardData();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const exportAnalyticsPDF = async (req, res, next) => {
  try {
    const data = await AnalyticsService.getDashboardData();
    const pdf = await InvoiceService.generateReportPDF(data);
    const stream = await pdf.getStream();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Reporte-Hotel-OliveBone.pdf');
    
    stream.pipe(res);
    stream.end();
  } catch (err) {
    next(err);
  }
};
