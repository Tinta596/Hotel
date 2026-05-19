import PdfPrinterModule from 'pdfmake/js/printer.js';
const PdfPrinter = PdfPrinterModule.default || PdfPrinterModule;
import fs from 'fs';

const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

const printer = new PdfPrinter(fonts);

const docDefinition = {
  content: [
    'Test PDF generation',
    { text: 'If you can read this, the PDF generation works!', fontSize: 15 }
  ],
  defaultStyle: {
    font: 'Roboto'
  }
};

try {
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream('scratch/test.pdf'));
  pdfDoc.end();
  console.log('PDF generated successfully in scratch/test.pdf');
} catch (e) {
  console.error('Error generating PDF:', e.message);
  console.error(e.stack);
}
