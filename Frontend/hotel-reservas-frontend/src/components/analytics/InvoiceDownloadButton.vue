<template>
  <button 
    class="invoice-btn" 
    :class="{ 'invoice-btn--loading': loading }"
    @click="handleDownload"
    :disabled="loading"
  >
    <div class="invoice-btn__icon">
      <FileText v-if="!loading" :size="iconSize" />
      <Loader2 v-else :size="iconSize" class="animate-spin" />
    </div>
    <span v-if="!iconOnly">{{ label }}</span>
  </button>
</template>

<script setup>
import { ref } from 'vue';
import { FileText, Loader2 } from 'lucide-vue-next';
import api from '../../services/api';

const props = defineProps({
  reservaId: {
    type: [Number, String],
    required: true
  },
  label: {
    type: String,
    default: 'Descargar Factura'
  },
  iconOnly: {
    type: Boolean,
    default: false
  },
  iconSize: {
    type: Number,
    default: 18
  }
});

const loading = ref(false);

const handleDownload = async () => {
  loading.value = true;
  try {
    const response = await api.get(`/reservas/${props.reservaId}/factura`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Factura-${props.reservaId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error al descargar factura:', error);
    const message = error.response?.data?.message || 'No se pudo generar la factura en este momento.';
    alert(`Error: ${message}`);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.invoice-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.6rem 1.1rem;
  background: white;
  border: 1px solid #f0ede8;
  border-radius: 0.75rem;
  color: #4a5d4b;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.invoice-btn:hover:not(:disabled) {
  background: #f4f6f2;
  border-color: #4a5d4b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 93, 75, 0.12);
}

.invoice-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.invoice-btn__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
