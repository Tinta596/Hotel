import pdfmake from 'pdfmake';
import fs from 'fs';

const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

pdfmake.setFonts(fonts);

const docDefinition = {
  content: [
    'Test PDF generation with instance and setFonts',
    { text: 'If you can read this, the PDF generation works!', fontSize: 15 }
  ],
  defaultStyle: {
    font: 'Roboto'
  }
};

try {
  const doc = pdfmake.createPdf(docDefinition);
  // En servidor (0.3.x), createPdf devuelve un objeto que tiene un metodo .pipe
  // O tal vez devuelve la promesa directamente.
  
  doc.getStream().then(stream => {
    stream.pipe(fs.createWriteStream('scratch/test-final.pdf'));
    stream.on('end', () => console.log('PDF generated successfully in scratch/test-final.pdf'));
  }).catch(e => {
    console.error('Error in getStream:', e.message);
  });

} catch (e) {
  console.error('Error generating PDF:', e.message);
}
