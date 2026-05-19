import PdfPrinterModule from 'pdfmake/js/printer.js';
const PdfPrinter = PdfPrinterModule.default || PdfPrinterModule;
console.log('PdfPrinter type:', typeof PdfPrinter);
try {
  const printer = new PdfPrinter({});
  console.log('Printer created successfully');
} catch (e) {
  console.log('Failed to create printer:', e.message);
}
