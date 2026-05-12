<template>
  <MainLayout title="Gestión de Habitaciones">
    <div class="admin-hab">
      <!-- Header -->
      <header class="page-header">
        <div class="header-info">
          <h1>Gestión de Habitaciones</h1>
          <p>Administra el inventario, crea nuevas habitaciones y gestiona el mantenimiento.</p>
        </div>
        <button class="btn-primary" @click="mostrarModalCrear = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Nueva Habitación
        </button>
      </header>

      <!-- Table / Grid -->
      <div class="table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Piso</th>
              <th>Tipo</th>
              <th>Precio Base</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="h in habitaciones" :key="h.id">
              <td class="font-bold">#{{ h.numero }}</td>
              <td>Piso {{ h.piso }}</td>
              <td>{{ h.tipo_nombre || 'Individual' }}</td>
              <td>{{ currency(h.precio_base || h.precio) }}</td>
              <td>
                <span class="status-pill" :class="h.estado.toLowerCase()">
                  {{ h.estado }}
                </span>
              </td>
              <td class="actions-cell">
                <button 
                  class="btn-icon" 
                  title="Poner en mantenimiento" 
                  @click="abrirMantenimiento(h)"
                  :disabled="h.estado.toLowerCase() === 'mantenimiento' || h.estado.toLowerCase() === 'ocupada'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                </button>
                <button class="btn-icon delete" title="Eliminar" @click="eliminarHabitacion(h.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Crear -->
      <div v-if="mostrarModalCrear" class="modal-overlay" @click.self="mostrarModalCrear = false">
        <div class="modal-content">
          <h3>Nueva Habitación</h3>
          <form @submit.prevent="crearHabitacion" class="admin-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Número</label>
                <input type="text" v-model="nuevaHab.numero" placeholder="Ej: 101" required />
              </div>
              <div class="form-group">
                <label>Piso</label>
                <input type="number" v-model="nuevaHab.piso" placeholder="Ej: 1" required />
              </div>
            </div>
            <div class="form-group">
              <label>Tipo de Habitación</label>
              <select v-model="nuevaHab.tipo_id" required>
                <option value="" disabled>Seleccione un tipo</option>
                <option v-for="t in tipos" :key="t.id" :value="t.id">{{ t.nombre }} - {{ currency(t.precio_base) }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Precio Base</label>
              <input type="number" v-model="nuevaHab.precio_base" placeholder="Ej: 150000" required />
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="nuevaHab.descripcion" placeholder="Opcional..."></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-ghost" @click="mostrarModalCrear = false">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="enviando">
                {{ enviando ? 'Creando...' : 'Crear Habitación' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Mantenimiento -->
      <div v-if="mostrarModalMantenimiento" class="modal-overlay" @click.self="mostrarModalMantenimiento = false">
        <div class="modal-content">
          <h3>Orden de Mantenimiento</h3>
          <p>Habitación {{ habSeleccionada.numero }}</p>
          <form @submit.prevent="confirmarMantenimiento" class="admin-form">
            <div class="form-group">
              <label>Motivo</label>
              <textarea v-model="mantenimiento.motivo" placeholder="Ej: Falla en aire acondicionado" required></textarea>
            </div>
            <div class="form-group">
              <label>Responsable</label>
              <input type="text" v-model="mantenimiento.responsable" placeholder="Nombre del técnico" required />
            </div>
            <div class="form-group">
              <label>Prioridad</label>
              <select v-model="mantenimiento.prioridad">
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-ghost" @click="mostrarModalMantenimiento = false">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="enviando">
                {{ enviando ? 'Enviando...' : 'Iniciar Mantenimiento' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MainLayout from '../components/layout/MainLayout.vue';
import api from '../services/api';
import { useToast } from 'vue-toastification';

const toast = useToast();
const habitaciones = ref([]);
const tipos = ref([]);
const enviando = ref(false);

const mostrarModalCrear = ref(false);
const nuevaHab = ref({
  numero: '',
  piso: '',
  tipo_id: '',
  precio_base: '',
  descripcion: ''
});

const mostrarModalMantenimiento = ref(false);
const habSeleccionada = ref(null);
const mantenimiento = ref({
  motivo: '',
  responsable: '',
  prioridad: 'media'
});

const cargarDatos = async () => {
  try {
    const [hRes, tRes] = await Promise.all([
      api.get('/habitaciones'),
      api.get('/habitaciones/tipos')
    ]);
    habitaciones.value = hRes.data;
    tipos.value = tRes.data;
  } catch (error) {
    toast.error('Error al cargar datos');
  }
};

const crearHabitacion = async () => {
  enviando.value = true;
  try {
    await api.post('/habitaciones', nuevaHab.value);
    toast.success('Habitación creada correctamente');
    mostrarModalCrear.value = false;
    nuevaHab.value = { numero: '', piso: '', tipo_id: '', precio_base: '', descripcion: '' };
    cargarDatos();
  } catch (error) {
    toast.error(error.response?.data?.error || 'Error al crear habitación');
  } finally {
    enviando.value = false;
  }
};

const abrirMantenimiento = (hab) => {
  habSeleccionada.value = hab;
  mantenimiento.value = { motivo: '', responsable: '', prioridad: 'media' };
  mostrarModalMantenimiento.value = true;
};

const confirmarMantenimiento = async () => {
  enviando.value = true;
  try {
    await api.post(`/habitaciones/${habSeleccionada.value.id}/mantenimiento`, mantenimiento.value);
    toast.success('Mantenimiento iniciado');
    mostrarModalMantenimiento.value = false;
    cargarDatos();
  } catch (error) {
    toast.error(error.response?.data?.error || 'Error al iniciar mantenimiento');
  } finally {
    enviando.value = false;
  }
};

const eliminarHabitacion = async (id) => {
  if (!confirm('¿Estás seguro de eliminar esta habitación?')) return;
  try {
    await api.delete(`/habitaciones/${id}`);
    toast.success('Habitación eliminada');
    cargarDatos();
  } catch (error) {
    toast.error('Error al eliminar');
  }
};

const currency = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val || 0);

onMounted(cargarDatos);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;600;700&display=swap');

.admin-hab {
  font-family: 'Outfit', sans-serif;
  color: #2c3e2d;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info h1 {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  margin: 0;
  color: #1a1a1a;
}

.header-info p {
  color: #6a7c6b;
  margin: 5px 0 0;
}

/* Table */
.table-container {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(44, 62, 45, 0.05);
  border: 1px solid rgba(44, 62, 45, 0.05);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-table th {
  background: #fdfaf7;
  padding: 1.2rem;
  font-weight: 700;
  font-size: 0.9rem;
  color: #4a5d4b;
  border-bottom: 1px solid #f0ede8;
}

.admin-table td {
  padding: 1.2rem;
  border-bottom: 1px solid #f0ede8;
  font-size: 0.95rem;
}

.font-bold { font-weight: 700; }

.status-pill {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}
.status-pill.disponible { background: #eef2ef; color: #4a5d4b; }
.status-pill.mantenimiento { background: #fff8e1; color: #ffa000; }
.status-pill.ocupada { background: #ffebee; color: #d32f2f; }

.actions-cell {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #f0ede8;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #4a5d4b;
}

.btn-icon:hover:not(:disabled) { background: #fdfaf7; border-color: #4a5d4b; transform: translateY(-2px); }
.btn-icon.delete:hover { color: #d32f2f; border-color: #d32f2f; }
.btn-icon:disabled { opacity: 0.3; cursor: not-allowed; }

/* Buttons */
.btn-primary {
  background: #4a5d4b;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-primary:hover { background: #3d4d3e; transform: translateY(-2px); }

.btn-ghost {
  background: transparent;
  border: 1px solid #f0ede8;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2.5rem;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
}

.modal-content h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  margin: 0 0 1.5rem;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6a7c6b;
}

.form-group input, .form-group select, .form-group textarea {
  padding: 12px;
  border: 1px solid #f0ede8;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.95rem;
  background: #fdfaf7;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none;
  border-color: #4a5d4b;
  box-shadow: 0 0 0 3px rgba(74, 93, 75, 0.1);
}

.form-group textarea { height: 100px; resize: none; }

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 1rem;
}
</style>
