<template>
  <div class="dashboard-wrapper">
    <!-- Header Section -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="header-main">
          <h1 class="text-serif">Panel de Trabajador</h1>
          <p class="text-muted">Gestión de disponibilidad y servicios del hotel</p>
        </div>
        <div class="header-actions">
          <!-- Botón de Nueva Reserva -->
          <router-link to="/habitaciones" class="btn-new-reservation">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nueva Reserva
          </router-link>

          <!-- Botón de la Campana (Notificaciones) -->
          <div class="notification-container">
            <button class="btn-notification" @click="toggleNotificaciones">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
            </button>
            
            <Transition name="slide-fade">
              <div v-if="mostrarNotificaciones" class="notification-dropdown">
                <div class="dropdown-header">
                  <h3>Notificaciones</h3>
                  <button @click="marcarTodasLeidas" class="btn-clear">Limpiar</button>
                </div>
                <div class="dropdown-body">
                  <div v-for="n in notificaciones" :key="n.id" class="notif-item" :class="{ unread: !n.leida }">
                    <div class="notif-icon" :class="n.tipo">
                      <svg v-if="n.tipo === 'reserva'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                      <svg v-else-if="n.tipo === 'limpieza'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                    </div>
                    <div class="notif-content">
                      <p class="notif-text">{{ n.mensaje }}</p>
                      <span class="notif-time">{{ n.tiempo }}</span>
                    </div>
                  </div>
                  <div v-if="notificaciones.length === 0" class="notif-empty">
                    Sin avisos nuevos
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <div class="status-badge">
            <span class="status-dot"></span>
            Sistema en Línea
          </div>
        </div>
      </div>
    </header>

    <div class="dashboard-content">
      <div class="grid-layout">
        <!-- Sidebar / Tools -->
        <aside class="sidebar-tools">
          <div class="tool-card animate-fade-in">
            <h3 class="tool-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Verificar Disponibilidad
            </h3>
            <div class="form-group">
              <label>Habitación</label>
              <select v-model="habitacionSeleccionada" class="premium-select">
                <option :value="null">Seleccionar habitación...</option>
                <option v-for="h in habitaciones" :key="h.id" :value="h.id">
                  Habitación {{ h.numero }} - {{ h.tipo }}
                </option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Entrada</label>
                <input type="date" v-model="fechaCheckin" class="premium-input" />
              </div>
              <div class="form-group">
                <label>Salida</label>
                <input type="date" v-model="fechaCheckout" class="premium-input" />
              </div>
            </div>
            <button class="btn-premium btn-block mt-3" @click="consultarDisponibilidad">
              Comprobar Fechas
            </button>

            <Transition name="fade">
              <div v-if="disponible !== null" class="status-result mt-4" :class="disponible ? 'result-available' : 'result-busy'">
                <div class="result-icon">
                  <svg v-if="disponible" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                </div>
                <div class="result-text">
                  <strong>{{ disponible ? '¡Disponible!' : 'No disponible' }}</strong>
                  <p>{{ disponible ? 'Se puede proceder con la reserva.' : 'Habitación ocupada en este rango.' }}</p>
                </div>
              </div>
            </Transition>
          </div>

          <div class="tool-card mt-4 animate-fade-in" style="animation-delay: 0.1s">
            <h3 class="tool-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
              Servicios Destacados
            </h3>
            <div class="services-list-mini">
              <div v-for="s in servicios.slice(0, 5)" :key="s.id" class="service-item-mini">
                <span class="service-dot"></span>
                <div class="service-info-mini">
                  <span class="service-name">{{ s.nombre }}</span>
                  <span class="service-price">${{ s.precio }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content Grid -->
        <main class="main-grid">
          <div class="section-header">
            <h2 class="text-serif">Estado de Habitaciones</h2>
            <div class="filter-tabs">
              <button 
                class="tab-btn" 
                :class="{ active: filtroEstado === 'todas' }" 
                @click="filtroEstado = 'todas'"
              >Todas</button>
              <button 
                class="tab-btn" 
                :class="{ active: filtroEstado === 'disponible' }" 
                @click="filtroEstado = 'disponible'"
              >Disponibles</button>
              <button 
                class="tab-btn" 
                :class="{ active: filtroEstado === 'mantenimiento' }" 
                @click="filtroEstado = 'mantenimiento'"
              >Mantenimiento</button>
            </div>
          </div>

          <div class="rooms-grid">
            <div v-for="h in habitacionesFiltradas" :key="h.id" class="room-card animate-slide-up">
              <div class="room-image-placeholder">
                <span class="room-number">No. {{ h.numero }}</span>
                <div class="room-badge" :class="h.estado">
                  {{ h.estado }}
                </div>
              </div>
              <div class="room-details">
                <div class="room-main-info">
                  <h4 class="room-type">{{ h.tipo }}</h4>
                  <p class="room-piso">Piso {{ h.piso }} • Capacidad: {{ h.capacidad }}</p>
                </div>
                <div class="room-footer">
                  <div class="room-price-info">
                    <span class="price-label">Desde</span>
                    <span class="price-value">${{ Math.round(h.precio_noche).toLocaleString() }}</span>
                  </div>
                  <router-link :to="`/trabajador/habitaciones/${h.id}`" class="btn-action">
                    Gestionar
                  </router-link>
                </div>
              </div>
            </div>
            <div v-if="habitacionesFiltradas.length === 0" class="empty-state">
              <p>No hay habitaciones en este estado.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';

export default {
  setup() {
    const habitaciones = ref([]);
    const servicios = ref([]);
    const habitacionSeleccionada = ref(null);
    const fechaCheckin = ref('');
    const fechaCheckout = ref('');
    const disponible = ref(null);
    const filtroEstado = ref('todas');
    const mostrarNotificaciones = ref(false);
    const notificaciones = ref([
      { id: 1, mensaje: 'Nueva reserva online: Habitación 105', tiempo: 'Hace 5 min', tipo: 'reserva', leida: false },
      { id: 2, mensaje: 'Habitación 202 lista tras mantenimiento', tiempo: 'Hace 15 min', tipo: 'mantenimiento', leida: false },
      { id: 3, mensaje: 'Limpieza finalizada en Habitación 301', tiempo: 'Hace 1 hora', tipo: 'limpieza', leida: false },
    ]);
    const toast = useToast();

    const unreadCount = computed(() => notificaciones.value.filter(n => !n.leida).length);

    const toggleNotificaciones = () => {
      mostrarNotificaciones.value = !mostrarNotificaciones.value;
    };

    const marcarTodasLeidas = () => {
      notificaciones.value = [];
      mostrarNotificaciones.value = false;
    };

    const cargarDatos = async () => {
      try {
        const [hRes, sRes] = await Promise.all([
          api.get('/habitaciones/disponibles'),
          api.get('/servicios')
        ]);

        habitaciones.value = hRes.data;
        servicios.value = sRes.data;
      } catch (error) {
        console.error('Error al cargar datos:', error);
        toast.error('Error al cargar datos del panel');
      }
    };

    const habitacionesFiltradas = computed(() => {
      if (filtroEstado.value === 'todas') return habitaciones.value;
      return habitaciones.value.filter(h => h.estado === filtroEstado.value);
    });

    const consultarDisponibilidad = async () => {
      if (!habitacionSeleccionada.value || !fechaCheckin.value || !fechaCheckout.value) {
        toast.warning('Por favor complete todos los campos');
        return;
      }

      try {
        const res = await api.get('/habitaciones/verificar-disponibilidad', {
          params: {
            habitacion_id: habitacionSeleccionada.value,
            fecha_checkin: fechaCheckin.value,
            fecha_checkout: fechaCheckout.value
          }
        });

        disponible.value = res.data.disponible;
      } catch (error) {
        toast.error('Error al consultar disponibilidad');
        disponible.value = null;
      }
    };

    onMounted(cargarDatos);

    return {
      habitaciones,
      servicios,
      habitacionSeleccionada,
      fechaCheckin,
      fechaCheckout,
      disponible,
      filtroEstado,
      habitacionesFiltradas,
      mostrarNotificaciones,
      notificaciones,
      unreadCount,
      toggleNotificaciones,
      marcarTodasLeidas,
      consultarDisponibilidad
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');

.dashboard-wrapper {
  min-height: 100vh;
  background-color: #fcfaf7;
  color: #2c3e2d;
  font-family: 'Outfit', sans-serif;
}

.text-serif {
  font-family: 'Playfair Display', serif;
  letter-spacing: -0.02em;
}

/* Header Styles */
.dashboard-header {
  background: #ffffff;
  padding: 1.5rem 5%;
  border-bottom: 1px solid rgba(44, 62, 45, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-new-reservation {
  background: #c4a484;
  color: white;
  text-decoration: none;
  padding: 0.7rem 1.4rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-new-reservation:hover {
  background: #b08d6a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(196, 164, 132, 0.3);
}

.btn-notification {
  background: #f8f5f0;
  border: 1px solid rgba(44, 62, 45, 0.1);
  color: #4a5d4b;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-notification:hover {
  background: #eef2ef;
  color: #2c3e2d;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e53e3e;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.header-main h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #2c3e2d;
}

.text-muted {
  color: #6a7c6b;
  margin: 0.2rem 0 0 0;
  font-size: 0.9rem;
}

.status-badge {
  background: #eef2ef;
  padding: 0.6rem 1rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a5d4b;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #27ae60;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.2);
}

/* Layout Grid */
.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 5%;
}

.grid-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2.5rem;
}

/* Sidebar Tools */
.tool-card {
  background: white;
  padding: 1.8rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(44, 62, 45, 0.04);
  border: 1px solid rgba(44, 62, 45, 0.05);
}

.tool-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #2c3e2d;
}

.tool-title svg {
  color: #c4a484;
}

/* Form Elements */
.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #6a7c6b;
}

.premium-select, .premium-input {
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(44, 62, 45, 0.1);
  background: #fdfdfd;
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.premium-select:focus, .premium-input:focus {
  outline: none;
  border-color: #c4a484;
  box-shadow: 0 0 0 4px rgba(196, 164, 132, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Buttons */
.btn-premium {
  background: #2c3e2d;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.btn-premium:hover {
  background: #3e563f;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(44, 62, 45, 0.2);
}

/* Result Status */
.status-result {
  padding: 1.2rem;
  border-radius: 15px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.result-available {
  background: #eef9f1;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.result-busy {
  background: #fff5f5;
  border: 1px solid #feb2b2;
  color: #c53030;
}

.result-icon {
  margin-top: 2px;
}

.result-text strong {
  display: block;
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.result-text p {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.9;
}

/* Mini Service List */
.services-list-mini {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.service-item-mini {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(44, 62, 45, 0.05);
}

.service-dot {
  width: 6px;
  height: 6px;
  background: #c4a484;
  border-radius: 50%;
}

.service-info-mini {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 0.9rem;
}

.service-price {
  font-weight: 600;
  color: #4a5d4b;
}

/* Main Grid Area */
.main-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.section-header h2 {
  font-size: 1.8rem;
  margin: 0;
}

.filter-tabs {
  display: flex;
  gap: 10px;
  background: #f0ede8;
  padding: 5px;
  border-radius: 50px;
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  color: #6a7c6b;
}

.tab-btn.active {
  background: white;
  color: #2c3e2d;
  box-shadow: 0 2px 8px rgba(44, 62, 45, 0.1);
}

/* Room Grid */
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 20px;
  border: 2px dashed rgba(44, 62, 45, 0.1);
  color: #6a7c6b;
}

.room-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(44, 62, 45, 0.04);
  border: 1px solid rgba(44, 62, 45, 0.05);
  transition: all 0.3s ease;
}

.room-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(44, 62, 45, 0.08);
}

.room-image-placeholder {
  height: 140px;
  background: #eef2ef;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.room-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(44, 62, 45, 0.15);
}

.room-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 0.4rem 1rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.room-badge.disponible { background: #eef9f1; color: #27ae60; }
.room-badge.ocupada { background: #fff5f5; color: #c53030; }
.room-badge.mantenimiento { background: #fffaf0; color: #d69e2e; }
.room-badge.reservada { background: #f0f4ff; color: #3182ce; }
.room-badge.limpieza { background: #fdf2f8; color: #db2777; }

.room-details {
  padding: 1.5rem;
}

.room-type {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.room-piso {
  color: #6a7c6b;
  font-size: 0.85rem;
  margin: 0.3rem 0 1.2rem 0;
}

.room-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(44, 62, 45, 0.05);
}

.price-label {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #6a7c6b;
  font-weight: 600;
}

.price-value {
  font-size: 1.15rem;
  font-weight: 600;
  color: #2c3e2d;
}

.btn-action {
  background: #fcfaf7;
  color: #2c3e2d;
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(44, 62, 45, 0.1);
  transition: all 0.2s;
}

.btn-action:hover {
  background: #2c3e2d;
  color: white;
  border-color: #2c3e2d;
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.6s ease forwards;
}

.animate-slide-up {
  animation: slideUp 0.6s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Notificaciones Functional */
.notification-container {
  position: relative;
}

.notification-dropdown {
  position: absolute;
  top: 120%;
  right: 0;
  width: 320px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 15px 40px rgba(44, 62, 45, 0.15);
  border: 1px solid rgba(44, 62, 45, 0.08);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-header {
  padding: 1.2rem;
  background: #fdfaf7;
  border-bottom: 1px solid rgba(44, 62, 45, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.btn-clear {
  background: transparent;
  border: none;
  color: #c4a484;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.dropdown-body {
  max-height: 400px;
  overflow-y: auto;
}

.notif-item {
  display: flex;
  gap: 12px;
  padding: 1rem;
  border-bottom: 1px solid rgba(44, 62, 45, 0.03);
  transition: background 0.2s;
  cursor: pointer;
}

.notif-item:hover {
  background: #fcfaf7;
}

.notif-item.unread {
  background: rgba(196, 164, 132, 0.04);
}

.notif-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notif-icon.reserva { background: #eef2ef; color: #4a5d4b; }
.notif-icon.mantenimiento { background: #fffaf0; color: #d69e2e; }
.notif-icon.limpieza { background: #fdf2f8; color: #db2777; }

.notif-text {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
  color: #2c3e2d;
}

.notif-time {
  font-size: 0.75rem;
  color: #6a7c6b;
  margin-top: 4px;
  display: block;
}

.notif-empty {
  padding: 2rem;
  text-align: center;
  color: #6a7c6b;
  font-size: 0.9rem;
}

/* Animations */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>