<template>
  <div class="table-container">
    <div class="table-header">
      <h3 class="table-title">Reservas Recientes</h3>
      <p class="table-subtitle">Últimas transacciones y registros del sistema</p>
    </div>
    <div class="table-responsive">
      <table class="modern-table">
        <thead>
          <tr>
            <th>Huésped</th>
            <th>Habitación</th>
            <th>Fechas</th>
            <th>Monto</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="res in data" :key="res.id">
            <td>
              <div class="user-cell">
                <div class="user-avatar">{{ res.cliente_nombre?.charAt(0) || 'U' }}</div>
                <div class="user-info">
                  <span class="user-name">{{ res.cliente_nombre }}</span>
                  <span class="user-id">#{{ res.id }}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="room-tag">Hab. {{ res.habitacion_numero }}</span>
            </td>
            <td>
              <div class="date-cell">
                <span class="date-range">{{ format(res.fecha_entrada) }} - {{ format(res.fecha_salida) }}</span>
              </div>
            </td>
            <td>
              <span class="amount-cell">${{ res.precio_total?.toLocaleString() }}</span>
            </td>
            <td>
              <span class="status-badge" :class="`status--${res.estado}`">
                {{ res.estado }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: Array
});

const format = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
};
</script>

<style scoped>
.table-container {
  background: white;
  border: 1px solid #f0ede8;
  border-radius: 1.5rem;
  padding: 1.5rem;
}

.table-header {
  margin-bottom: 1.5rem;
}

.table-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
}

.table-subtitle {
  font-size: 0.85rem;
  color: #6a7c6b;
  margin: 0.25rem 0 0;
}

.table-responsive {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.modern-table th {
  padding: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ead9f;
  border-bottom: 1px solid #f0ede8;
}

.modern-table td {
  padding: 1rem;
  border-bottom: 1px solid #f4f6f2;
  vertical-align: middle;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  background: #f4f6f2;
  color: #4a5d4b;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 0.8rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 700;
  color: #1a1a1a;
  font-size: 0.9rem;
}

.user-id {
  font-size: 0.75rem;
  color: #6a7c6b;
}

.room-tag {
  background: #f4f6f2;
  color: #4a5d4b;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
}

.date-range {
  font-size: 0.85rem;
  color: #1a1a1a;
  font-weight: 600;
}

.amount-cell {
  font-weight: 800;
  color: #1a1a1a;
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: capitalize;
}

.status--confirmada { background: #dcfce7; color: #166534; }
.status--pendiente { background: #fef9c3; color: #854d0e; }
.status--cancelada { background: #fee2e2; color: #991b1b; }
.status--completada { background: #dbeafe; color: #1e40af; }
</style>
