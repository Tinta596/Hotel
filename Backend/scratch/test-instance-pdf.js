import pdfmake from 'pdfmake';
import fs from 'fs';

const docDefinition = {
  content: [
    'Test PDF generation with instance',
    { text: 'If you can read this, the PDF generation works!', fontSize: 15 }
  ],
  defaultStyle: {
    font: 'Helvetica'
  }
};

try {
  // En pdfmake 0.3.x, el export principal es una instancia
  const pdfDoc = pdfmake.createPdf(docDefinition);
  // Pero createPdf devuelve un objeto que puede generar buffers, etc.
  // En servidor queremos el stream.
  
  pdfmake.createPdf(docDefinition).getBuffer((buffer) => {
    fs.writeFileSync('scratch/test-instance.pdf', buffer);
    console.log('PDF generated successfully in scratch/test-instance.pdf');
  });
} catch (e) {
  console.error('Error generating PDF:', e.message);
}
