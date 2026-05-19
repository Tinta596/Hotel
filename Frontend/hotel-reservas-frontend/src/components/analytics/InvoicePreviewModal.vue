<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">Previsualización de Factura</h3>
        <div class="header-actions">
          <InvoiceDownloadButton :reserva-id="reservaId" label="Descargar PDF" />
          <button class="btn-close" @click="close">✕</button>
        </div>
      </div>
      <div class="modal-body">
        <div v-if="loading" class="loading-state">
          <Loader2 class="animate-spin" :size="48" />
          <p>Generando documento profesional...</p>
        </div>
        <iframe 
          v-else 
          :src="pdfUrl" 
          class="pdf-viewer"
          frameborder="0"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Loader2 } from 'lucide-vue-next';
import api from '../../services/api';
import InvoiceDownloadButton from './InvoiceDownloadButton.vue';

const props = defineProps({
  isOpen: Boolean,
  reservaId: [Number, String]
});

const emit = defineEmits(['close']);

const pdfUrl = ref(null);
const loading = ref(false);

const cargarPreview = async () => {
  if (!props.reservaId) return;
  loading.value = true;
  try {
    const response = await api.get(`/reservas/${props.reservaId}/factura/preview`, {
      responseType: 'blob'
    });
    
    if (pdfUrl.value) window.URL.revokeObjectURL(pdfUrl.value);
    pdfUrl.value = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  } catch (error) {
    console.error('Error al cargar preview:', error);
  } finally {
    loading.value = false;
  }
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) cargarPreview();
});

const close = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(16, 18, 14, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 2rem;
}

.modal-container {
  background: white;
  width: 100%;
  max-width: 1000px;
  height: 90vh;
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-header {
  padding: 1.25rem 2rem;
  border-bottom: 1px solid #f0ede8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fdfaf7;
}

.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: #6a7c6b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #fee2e2;
  color: #991b1b;
}

.modal-body {
  flex: 1;
  background: #525659; /* Color fondo estándar de visores PDF */
  display: flex;
  position: relative;
}

.pdf-viewer {
  width: 100%;
  height: 100%;
}

.loading-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  background: white;
  color: #4a5d4b;
}

.loading-state p {
  font-weight: 700;
  font-size: 1.1rem;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
