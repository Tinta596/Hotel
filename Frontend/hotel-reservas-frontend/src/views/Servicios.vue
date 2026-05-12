<template>
  <MainLayout title="Servicios del Hotel">
    <div class="servicios-page">
      <!-- Header -->
      <header class="servicios-header">
        <div class="header-info">
          <span class="status-badge">Hospitalidad & Bienestar</span>
          <h1>Servicios del Hotel</h1>
          <p>Experiencias exclusivas diseñadas para elevar su estancia a un nivel superior de confort.</p>
        </div>
        <button v-if="esAdmin" class="btn-primary" @click="mostrarModalCrear = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Nuevo Servicio
        </button>
      </header>

      <!-- Services Grid -->
      <div v-if="servicios.length === 0" class="empty-state">
        <div class="empty-icon">✨</div>
        <h3>Próximamente más servicios</h3>
        <p>Estamos preparando nuevas experiencias para usted.</p>
      </div>

      <div class="servicios-grid" v-else>
        <div v-for="servicio in servicios" :key="servicio.id" class="servicio-card">
          <div class="card-icon">
            <component :is="obtenerIcono(servicio.categoria)" />
          </div>
          <div class="card-content">
            <div class="card-header">
              <span class="categoria">{{ servicio.categoria }}</span>
              <h3 class="nombre">{{ servicio.nombre }}</h3>
            </div>
            <p class="descripcion">{{ servicio.descripcion }}</p>
            <div class="card-footer">
              <div class="precio">
                <span class="label">Precio</span>
                <span class="amount">{{ currency(servicio.precio) }}</span>
              </div>
              <div class="horario" v-if="servicio.horario_inicio">
                <span class="label">Horario</span>
                <span class="time">{{ servicio.horario_inicio }} - {{ servicio.horario_fin }}</span>
              </div>
            </div>
          </div>
          <div v-if="esAdmin" class="admin-actions">
            <button class="btn-icon delete" title="Eliminar" @click="eliminarServicio(servicio.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Crear Servicio -->
      <div v-if="mostrarModalCrear" class="modal-overlay" @click.self="mostrarModalCrear = false">
        <div class="modal-content">
          <header class="modal-header">
            <h2>Nuevo Servicio</h2>
            <p>Define una nueva experiencia para los huéspedes.</p>
          </header>
          <form @submit.prevent="crearServicio" class="admin-form">
            <div class="form-group">
              <label>Nombre del Servicio</label>
              <input type="text" v-model="nuevoServicio.nombre" placeholder="Ej: Cena Romántica" required />
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="nuevoServicio.descripcion" placeholder="Describe brevemente el servicio..."></textarea>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label>Precio</label>
                <input type="number" v-model="nuevoServicio.precio" placeholder="0.00" required />
              </div>
              <div class="form-group">
                <label>Categoría</label>
                <select v-model="nuevoServicio.categoria">
                  <option value="restaurante">Restaurante</option>
                  <option value="spa">Spa & Wellness</option>
                  <option value="lavanderia">Lavandería</option>
                  <option value="transporte">Transporte</option>
                  <option value="minibar">Minibar</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label>Horario Inicio</label>
                <input type="text" v-model="nuevoServicio.horario_inicio" placeholder="HH:mm" />
              </div>
              <div class="form-group">
                <label>Horario Fin</label>
                <input type="text" v-model="nuevoServicio.horario_fin" placeholder="HH:mm" />
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-ghost" @click="mostrarModalCrear = false">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="enviando">
                {{ enviando ? 'Creando...' : 'Crear Servicio' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MainLayout from '../components/layout/MainLayout.vue';
import api from '../services/api';
import { useToast } from 'vue-toastification';

const toast = useToast();
const servicios = ref([]);
const enviando = ref(false);
const mostrarModalCrear = ref(false);

const usuario = JSON.parse(localStorage.getItem('usuario'));
const esAdmin = computed(() => usuario?.rol === 'admin');

const nuevoServicio = ref({
  nombre: '',
  descripcion: '',
  precio: '',
  categoria: 'otro',
  horario_inicio: '08:00',
  horario_fin: '20:00'
});

const cargarServicios = async () => {
  try {
    const response = await api.get('/servicios');
    servicios.value = response.data;
  } catch (error) {
    toast.error('Error al cargar servicios');
  }
};

const crearServicio = async () => {
  enviando.value = true;
  try {
    await api.post('/servicios', nuevoServicio.value);
    toast.success('Servicio creado exitosamente');
    mostrarModalCrear.value = false;
    nuevoServicio.value = {
      nombre: '', descripcion: '', precio: '', categoria: 'otro',
      horario_inicio: '08:00', horario_fin: '20:00'
    };
    cargarServicios();
  } catch (error) {
    toast.error(error.response?.data?.error || 'Error al crear servicio');
  } finally {
    enviando.value = false;
  }
};

const eliminarServicio = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
  try {
    await api.delete(`/servicios/${id}`);
    toast.success('Servicio eliminado');
    cargarServicios();
  } catch (error) {
    toast.error('Error al eliminar servicio');
  }
};

const obtenerIcono = (cat) => {
  const iconos = {
    restaurante: '🍽️',
    spa: '💆',
    lavanderia: '👕',
    transporte: '🚗',
    minibar: '🥤',
    otro: '✨'
  };
  const icon = iconos[cat.toLowerCase()] || iconos.otro;
  return { template: `<span>${icon}</span>` };
};

const currency = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val || 0);

onMounted(cargarServicios);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;600;700&display=swap');

.servicios-page {
  font-family: 'Outfit', sans-serif;
  color: #2c3e2d;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding-bottom: 4rem;
}

/* Header */
.servicios-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header-info h1 {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0.5rem 0;
  color: #1a1a1a;
}

.header-info p {
  font-size: 1.1rem;
  color: #6a7c6b;
  max-width: 600px;
}

.status-badge {
  background: rgba(74, 93, 75, 0.1);
  color: #4a5d4b;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Grid */
.servicios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.servicio-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 10px 40px rgba(44, 62, 45, 0.05);
  border: 1px solid rgba(44, 62, 45, 0.03);
  transition: all 0.3s ease;
  position: relative;
}

.servicio-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(44, 62, 45, 0.1);
}

.card-icon {
  width: 60px;
  height: 60px;
  background: #fdfaf7;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #4a5d4b;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.categoria {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #c4a484;
}

.nombre {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  margin: 2px 0;
}

.descripcion {
  font-size: 0.95rem;
  color: #6a7c6b;
  line-height: 1.6;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 1.5rem;
  border-top: 1px solid #f0ede8;
}

.label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ead9f;
  margin-bottom: 2px;
}

.amount {
  font-weight: 700;
  font-size: 1.2rem;
  color: #4a5d4b;
}

.time {
  font-weight: 600;
  font-size: 0.95rem;
}

/* Admin Actions */
.admin-actions {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.servicio-card:hover .admin-actions {
  opacity: 1;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #f0ede8;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #d32f2f;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #fff5f5;
  border-color: #d32f2f;
}

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
  padding: 3rem;
  border-radius: 32px;
  width: 100%;
  max-width: 550px;
  box-shadow: 0 25px 60px rgba(0,0,0,0.1);
}

.modal-header {
  margin-bottom: 2rem;
}

.modal-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  margin: 0;
}

.modal-header p {
  color: #6a7c6b;
  margin: 5px 0 0;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6a7c6b;
}

.form-group input, .form-group select, .form-group textarea {
  padding: 14px;
  border: 1px solid #f0ede8;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.95rem;
  background: #fdfaf7;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none;
  border-color: #4a5d4b;
  box-shadow: 0 0 0 4px rgba(74, 93, 75, 0.1);
}

.form-group textarea { height: 100px; resize: none; }

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 1rem;
}

.empty-state {
  text-align: center;
  padding: 5rem 0;
  color: #6a7c6b;
}

.empty-icon { font-size: 4rem; margin-bottom: 1rem; }
</style>
