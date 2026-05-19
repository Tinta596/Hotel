import pdfmake from 'pdfmake';
import * as ReservacionModel from '../models/reservacion.model.js';

const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

pdfmake.setFonts(fonts);

export const generateInvoicePDF = async (reserva_id) => {
  const [facturaData] = await ReservacionModel.findFacturaData(reserva_id);
  if (facturaData.length === 0) throw { status: 404, message: 'Reserva no encontrada' };
  
  const [servicios] = await ReservacionModel.findServiciosByReservaId(reserva_id);
  const data = facturaData[0];

  const totalServicios = servicios.reduce((acc, s) => acc + (s.subtotal || 0), 0);
  const totalAPagar = (data.precio_total || 0) + totalServicios;

  const docDefinition = {

    content: [
      // Header
      {
        columns: [
          {
            text: 'OLIVE & BONE',
            style: 'header'
          },
          {
            text: [
              { text: `FACTURA: ${data.numero_confirmacion}\n`, style: 'invoiceLabel' },
              { text: `Fecha: ${new Date().toLocaleDateString()}\n`, style: 'invoiceDate' }
            ],
            alignment: 'right'
          }
        ]
      },
      { text: 'HOTEL BOUTIQUE & SPA', style: 'subheader', margin: [0, -5, 0, 20] },
      
      { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#9ead9f' }] },

      // Hotel & Client Info
      {
        margin: [0, 20, 0, 20],
        columns: [
          {
            text: [
              { text: 'DE:\n', style: 'infoTitle' },
              { text: 'Olive & Bone Hotel\n', style: 'infoName' },
              { text: 'Calle de la Arena 123\nCartagena, Colombia\nNIT: 900.123.456-7\ncontacto@oliveandbone.com', style: 'infoText' }
            ]
          },
          {
            text: [
              { text: 'PARA:\n', style: 'infoTitle' },
              { text: `${data.cliente_nombre}\n`, style: 'infoName' },
              { text: `Doc: ${data.cliente_documento || 'No registrado'}\nEmail: ${data.cliente_email}\nTel: ${data.cliente_telefono}`, style: 'infoText' }
            ],
            alignment: 'right'
          }
        ]
      },

      // Reservation Summary
      {
        fillColor: '#f4f6f2',
        table: {
          widths: ['*'],
          body: [
            [{
              border: [false, false, false, false],
              stack: [
                { text: 'DETALLE DE LA ESTADÍA', style: 'sectionTitle', margin: [0, 5, 0, 5] },
                {
                  columns: [
                    { text: `Habitación: ${data.habitacion_numero} (${data.tipo_habitacion})`, style: 'infoText' },
                    { text: `Noches: ${data.noches}`, style: 'infoText', alignment: 'right' }
                  ]
                },
                {
                  columns: [
                    { text: `Entrada: ${new Date(data.fecha_entrada).toLocaleDateString()}`, style: 'infoText' },
                    { text: `Salida: ${new Date(data.fecha_salida).toLocaleDateString()}`, style: 'infoText', alignment: 'right' }
                  ]
                }
              ],
              margin: 10
            }]
          ]
        },
        margin: [0, 0, 0, 20]
      },

      // Items Table
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'DESCRIPCIÓN', style: 'tableHeader' },
              { text: 'CANT.', style: 'tableHeader', alignment: 'center' },
              { text: 'PRECIO UNIT.', style: 'tableHeader', alignment: 'right' },
              { text: 'SUBTOTAL', style: 'tableHeader', alignment: 'right' }
            ],
            // Habitación row
            [
              { text: `Hospedaje - Habitación ${data.habitacion_numero}`, style: 'tableCell' },
              { text: data.noches.toString(), style: 'tableCell', alignment: 'center' },
              { text: `$${(data.precio_total / data.noches).toLocaleString()}`, style: 'tableCell', alignment: 'right' },
              { text: `$${data.precio_total.toLocaleString()}`, style: 'tableCell', alignment: 'right' }
            ],
            // Servicios rows
            ...servicios.map(s => [
              { text: s.nombre, style: 'tableCell' },
              { text: s.cantidad.toString(), style: 'tableCell', alignment: 'center' },
              { text: `$${s.precio_unitario.toLocaleString()}`, style: 'tableCell', alignment: 'right' },
              { text: `$${s.subtotal.toLocaleString()}`, style: 'tableCell', alignment: 'right' }
            ])
          ]
        },
        layout: 'lightHorizontalLines'
      },

      // Totals
      {
        margin: [0, 30, 0, 0],
        columns: [
          { text: '', width: '*' },
          {
            width: 200,
            table: {
              widths: ['*', 'auto'],
              body: [
                [
                  { text: 'HOSPEDAJE', style: 'totalLabel' },
                  { text: `$${data.precio_total.toLocaleString()}`, style: 'totalValue' }
                ],
                [
                  { text: 'CONSUMOS EXTRAS', style: 'totalLabel' },
                  { text: `$${totalServicios.toLocaleString()}`, style: 'totalValue' }
                ],
                [
                  { text: 'IMPUESTOS (19%)', style: 'totalLabel' },
                  { text: 'INCLUIDO', style: 'totalValue' }
                ],
                [
                  { text: 'TOTAL A PAGAR', style: 'grandTotalLabel' },
                  { text: `$${totalAPagar.toLocaleString()}`, style: 'grandTotalValue' }
                ]
              ]
            },
            layout: 'noBorders'
          }
        ]
      },

      // Footer
      {
        text: 'Gracias por elegir Olive & Bone. Esperamos verle pronto.',
        style: 'footer',
        margin: [0, 50, 0, 0],
        alignment: 'center'
      }
    ],
    styles: {
      header: { fontSize: 28, bold: true, color: '#4a5d4b', letterSpacing: 2 },
      subheader: { fontSize: 10, bold: true, color: '#9ead9f' },
      invoiceLabel: { fontSize: 14, bold: true, color: '#1a1a1a' },
      invoiceDate: { fontSize: 10, color: '#6a7c6b' },
      infoTitle: { fontSize: 8, bold: true, color: '#9ead9f', margin: [0, 0, 0, 2] },
      infoName: { fontSize: 11, bold: true, color: '#1a1a1a' },
      infoText: { fontSize: 9, color: '#6a7c6b', lineHeight: 1.3 },
      sectionTitle: { fontSize: 10, bold: true, color: '#4a5d4b' },
      tableHeader: { fontSize: 9, bold: true, color: '#4a5d4b', margin: [0, 5, 0, 5] },
      tableCell: { fontSize: 9, color: '#1a1a1a', margin: [0, 8, 0, 8] },
      totalLabel: { fontSize: 10, bold: true, color: '#6a7c6b', margin: [0, 5, 0, 5] },
      totalValue: { fontSize: 10, color: '#1a1a1a', margin: [0, 5, 0, 5], alignment: 'right' },
      grandTotalLabel: { fontSize: 12, bold: true, color: '#4a5d4b', margin: [0, 10, 0, 10] },
      grandTotalValue: { fontSize: 14, bold: true, color: '#1a1a1a', margin: [0, 10, 0, 10], alignment: 'right' },
      footer: { fontSize: 10, italics: true, color: '#9ead9f' }
    },
    defaultStyle: {
      font: 'Roboto'
    }
  };

  return pdfmake.createPdf(docDefinition);
};

export const generateReportPDF = async (analyticsData) => {
  const docDefinition = {
    content: [
      {
        columns: [
          { text: 'REPORTE DE RENDIMIENTO', style: 'header' },
          { text: `Generado: ${new Date().toLocaleDateString()}`, alignment: 'right', style: 'invoiceDate' }
        ]
      },
      { text: 'OLIVE & BONE HOTEL BOUTIQUE', style: 'subheader', margin: [0, 0, 0, 30] },

      { text: 'RESUMEN GENERAL', style: 'sectionTitle' },
      {
        table: {
          widths: ['*', '*', '*'],
          body: [
            [
              { text: 'Total Reservas', style: 'tableHeader' },
              { text: 'Ingresos Mes', style: 'tableHeader' },
              { text: 'Total Clientes', style: 'tableHeader' }
            ],
            [
              { text: analyticsData.resumen.totalReservas.toString(), style: 'tableCell' },
              { text: `$${analyticsData.resumen.ingresosMes.toLocaleString()}`, style: 'tableCell' },
              { text: analyticsData.resumen.totalClientes.toString(), style: 'tableCell' }
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 10, 0, 20]
      },

      { text: 'ESTADO DE HABITACIONES', style: 'sectionTitle' },
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: `Disponibles: ${analyticsData.resumen.habitacionesDisponibles}`, style: 'infoText' },
              { text: `Ocupadas: ${analyticsData.resumen.habitacionesOcupadas}`, style: 'infoText' },
              { text: `En Mantenimiento: ${analyticsData.resumen.habitacionesMantenimiento}`, style: 'infoText' }
            ]
          }
        ],
        margin: [0, 10, 0, 20]
      },

      { text: 'POPULARIDAD DE SERVICIOS', style: 'sectionTitle' },
      {
        table: {
          widths: ['*', 'auto'],
          body: [
            [
              { text: 'Servicio', style: 'tableHeader' },
              { text: 'Usos', style: 'tableHeader', alignment: 'right' }
            ],
            ...analyticsData.servicios.map(s => [
              { text: s.nombre, style: 'tableCell' },
              { text: s.cantidad.toString(), style: 'tableCell', alignment: 'right' }
            ])
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 10, 0, 20]
      }
    ],
    styles: {
      header: { fontSize: 22, bold: true, color: '#4a5d4b' },
      subheader: { fontSize: 10, color: '#9ead9f' },
      sectionTitle: { fontSize: 12, bold: true, color: '#4a5d4b', margin: [0, 10, 0, 5] },
      tableHeader: { fontSize: 10, bold: true, fillColor: '#f4f6f2' },
      tableCell: { fontSize: 10, margin: [0, 5, 0, 5] },
      infoText: { fontSize: 10, margin: [0, 2, 0, 2] }
    },
    defaultStyle: { font: 'Roboto' }
  };

  return pdfmake.createPdf(docDefinition);
};

