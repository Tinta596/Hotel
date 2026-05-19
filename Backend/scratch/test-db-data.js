import db from '../config/database.js';

async function test() {
  try {
    const [rows] = await db.execute('SELECT id, precio_total, estado FROM reservaciones');
    console.log('Reservaciones:', JSON.stringify(rows, null, 2));
    
    const [[ingresos]] = await db.execute('SELECT SUM(precio_total) AS total FROM reservaciones WHERE estado != "cancelada"');
    console.log('Suma ingresos:', ingresos.total);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

test();
