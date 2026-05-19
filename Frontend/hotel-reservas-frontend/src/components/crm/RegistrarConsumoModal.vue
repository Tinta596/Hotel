<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-card">
        <header class="modal-header">
          <h3 class="modal-title">🍽️ Registrar Consumo</h3>
          <button class="btn-close" @click="closeModal">✕</button>
        </header>

        <div class="modal-body">
          <div class="reserva-summary">
            <span class="summary-label">Habitación:</span>
            <span class="summary-value">Hab. {{ reserva?.habitacion_numero }} ({{ reserva?.tipo_habitacion }})</span>
            <span class="summary-label">Huésped:</span>
            <span class="summary-value">{{ reserva?.cliente_nombre }}</span>
          </div>

          <div v-if="error" class="error-banner">
            ⚠️ {{ error }}
          </div>

          <form @submit.prevent="submitConsumo" class="consumo-form">
            <!-- Servicio -->
            <div class="form-group">
              <label class="form-label">Servicio Consumido</label>
              <select v-model="selectedServicioId" class="form-select" required>
                <option :value="null" disabled>Selecciona un servicio</option>
                <option v-for="s in servicios" :key="s.id" :value="s.id">
                  {{ s.nombre }} — ${{ s.precio?.toLocaleString() }} ({{ s.categoria }})
                </option>
              </select>
            </div>

            <!-- Cantidad -->
            <div class="form-group">
              <label class="form-label">Cantidad</label>
              <input 
                type="number" 
                v-model.number="cantidad" 
                class="form-input" 
                min="1" 
                max="50" 
                required 
              />
            </div>

            <!-- Resumen de Costo -->
            <div class="cost-summary" v-if="selectedServicio">
              <div class="cost-row">
                <span>Precio Unitario:</span>
                <span>${{ selectedServicio.precio?.toLocaleString() }}</span>
              </div>
              <div class="cost-row">
                <span>Cantidad:</span>
                <span>x{{ cantidad }}</span>
              </div>
              <div class="cost-row cost-total">
                <span>Total Estimado:</span>
                <span>${{ totalConsumo?.toLocaleString() }}</span>
              </div>
            </div>
          </form>
        </div>

        <footer class="modal-footer">
          <button class="btn-cancel" @click="closeModal" :disabled="loading">
            Cancelar
          </button>
          <button 
            class="btn-save" 
            @click="submitConsumo" 
            :disabled="loading || !selectedServicioId"
          >
            {{ loading ? 'Registrando...' : 'Registrar Consumo' }}
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import api from '../../services/api';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  reserva: { type: Object, default: null }
});

const emit = defineEmits(['close', 'saved']);

const servicios = ref([]);
const selectedServicioId = ref(null);
const cantidad = ref(1);
const loading = ref(false);
const error = ref('');

// Cargar la lista de servicios activos
const fetchServicios = async () => {
  try {
    const res = await api.get('/servicios?activos=true');
    servicios.value = res.data;
  } catch (err) {
    console.error('Error al cargar servicios:', err);
    error.value = 'No se pudieron cargar los servicios.';
  }
};

// Servicio actualmente seleccionado
const selectedServicio = computed(() => {
  return servicios.value.find(s => s.id === selectedServicioId.value) || null;
});

// Total estimado de este consumo
const totalConsumo = computed(() => {
  if (!selectedServicio.value) return 0;
  return selectedServicio.value.precio * (cantidad.value || 1);
});

// Watcher para cargar servicios cuando el modal se abre
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    fetchServicios();
    selectedServicioId.value = null;
    cantidad.value = 1;
    error.value = '';
  }
});

const closeModal = () => {
  emit('close');
};

const submitConsumo = async () => {
  if (!selectedServicioId.value || !props.reserva?.id) return;
  loading.value = true;
  error.value = '';

  try {
    await api.post(`/reservas/${props.reserva.id}/consumos`, {
      servicio_id: selectedServicioId.value,
      cantidad: cantidad.value
    });
    emit('saved');
    closeModal();
  } catch (err) {
    console.error('Error al registrar consumo:', err);
    error.value = err.response?.data?.error || 'Error al guardar el consumo.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(16, 18, 14, 0.6);
  backdrop-filter: blur(5px);
  display: grid;
  place-items: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-card {
  background: #fdfbf7;
  border: 1px solid #e3dec9;
  border-radius: 1.25rem;
  box-shadow: 0 24px 64px rgba(16, 18, 14, 0.25);
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modal-enter 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-enter {
  from { transform: translateY(16px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e3dec9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f2e6;
}

.modal-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: #2b3a2c;
  letter-spacing: -0.01em;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1rem;
  color: #6a7c6b;
  cursor: pointer;
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  transition: background 150ms;
}

.btn-close:hover {
  background: #e3dec9;
  color: #2b3a2c;
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.reserva-summary {
  background: #f5f2e6;
  border: 1px solid #e3dec9;
  border-radius: 0.75rem;
  padding: 1rem;
  display: grid;
  grid-template-columns: auto 1fr;
  row-gap: 0.5rem;
  column-gap: 0.75rem;
  font-size: 0.88rem;
}

.summary-label {
  font-weight: 700;
  color: #6a7c6b;
}

.summary-value {
  color: #2b3a2c;
  font-weight: 600;
}

.error-banner {
  background: #fdf0ed;
  border: 1px solid #f5c7bc;
  color: #8f2619;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.consumo-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #6a7c6b;
  letter-spacing: 0.05em;
}

.form-select, .form-input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  background: white;
  border: 1px solid #c5ccb6;
  border-radius: 0.75rem;
  color: #2b3a2c;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  transition: border-color 150ms, box-shadow 150ms;
}

.form-select:focus, .form-input:focus {
  border-color: #4a5d4b;
  box-shadow: 0 0 0 3px rgba(74, 93, 75, 0.15);
}

.cost-summary {
  background: #f2f7f2;
  border: 1px solid #cce3cc;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #3b4d3c;
}

.cost-row {
  display: flex;
  justify-content: space-between;
}

.cost-total {
  border-top: 1px solid #cce3cc;
  padding-top: 0.5rem;
  margin-top: 0.25rem;
  font-size: 1rem;
  font-weight: 800;
  color: #1e331f;
}

.modal-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #e3dec9;
  background: #f5f2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-cancel {
  background: white;
  color: #6a7c6b;
  border: 1px solid #c5ccb6;
  padding: 0.65rem 1.2rem;
  border-radius: 0.75rem;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 150ms, color 150ms;
}

.btn-cancel:hover {
  background: #f5f2e6;
  color: #2b3a2c;
}

.btn-save {
  background: #4a5d4b;
  color: white;
  border: none;
  padding: 0.65rem 1.2rem;
  border-radius: 0.75rem;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 150ms, transform 150ms;
}

.btn-save:hover {
  background: #3b4d3c;
}

.btn-save:disabled, .btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Transitions */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 250ms ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>
