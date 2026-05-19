import * as InvoiceService from '../services/invoice.service.js';

export const downloadInvoice = async (req, res, next) => {
  try {
    const pdf = await InvoiceService.generateInvoicePDF(req.params.id);
    const stream = await pdf.getStream();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Factura-${req.params.id}.pdf`);
    
    stream.pipe(res);
    stream.end();
  } catch (err) {
    console.error('Error en downloadInvoice:', err);
    next(err);
  }
};

export const previewInvoice = async (req, res, next) => {
  try {
    const pdf = await InvoiceService.generateInvoicePDF(req.params.id);
    const stream = await pdf.getStream();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    
    stream.pipe(res);
    stream.end();
  } catch (err) {
    console.error('Error en previewInvoice:', err);
    next(err);
  }
};
