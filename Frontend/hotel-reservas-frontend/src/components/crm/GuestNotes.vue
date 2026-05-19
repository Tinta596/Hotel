<template>
  <div class="guest-notes" :class="{ 'gn--premium': isPremium }">
    <div class="notes-header">
      <h3 class="notes-title">Notas y Preferencias</h3>
      <button class="btn-add" @click="showForm = true">+ Añadir nota</button>
    </div>

    <!-- Add note form -->
    <transition name="slide-fade">
      <div v-if="showForm" class="note-form">
        <div class="form-row">
          <select v-model="form.tipo" class="form-select">
            <option value="preferencia">🟢 Preferencia</option>
            <option value="alerta">🔴 Alerta</option>
            <option value="vip">⭐ VIP</option>
            <option value="interna">🔒 Interna</option>
          </select>
          <input v-model="form.titulo" class="form-input" placeholder="Título de la nota" />
        </div>
        <textarea v-model="form.contenido" class="form-textarea" placeholder="Descripción..." rows="3"></textarea>
        <div class="form-actions">
          <label class="form-check">
            <input type="checkbox" v-model="form.privada" />
            Nota privada (solo staff)
          </label>
          <div class="form-btns">
            <button class="btn-cancel" @click="cancelForm">Cancelar</button>
            <button class="btn-save" @click="saveNote" :disabled="!form.titulo || !form.contenido">Guardar</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Notes list -->
    <div v-if="notes.length === 0 && !showForm" class="notes-empty">
      <p>No hay notas registradas.</p>
    </div>

    <div class="notes-grid">
      <div
        v-for="note in notes"
        :key="note.id"
        class="note-card"
        :class="`note--${note.tipo}`"
      >
        <div class="note-card-header">
          <div class="note-tipo-badge">{{ tipoIcon(note.tipo) }} {{ tipoLabel(note.tipo) }}</div>
          <div v-if="note.privada" class="note-private">🔒</div>
          <div class="note-actions">
            <button @click="startEdit(note)" class="btn-icon">✎</button>
            <button @click="$emit('delete', note.id)" class="btn-icon btn-icon--danger">✕</button>
          </div>
        </div>
        <h4 class="note-titulo">{{ note.titulo }}</h4>
        <p class="note-contenido">{{ note.contenido }}</p>
        <span class="note-date">{{ formatDate(note.creado_en) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  notes: { type: Array, default: () => [] },
  isPremium: { type: Boolean, default: false }
});
const emit = defineEmits(['create', 'update', 'delete']);

const showForm = ref(false);
const editingId = ref(null);
const form = ref({ tipo: 'preferencia', titulo: '', contenido: '', privada: false });

const tipoIcon  = (t) => ({ preferencia:'🟢', alerta:'🔴', vip:'⭐', interna:'🔒' }[t] ?? '🟢');
const tipoLabel = (t) => ({ preferencia:'Preferencia', alerta:'Alerta', vip:'VIP', interna:'Interna' }[t] ?? t);

const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' }) : '';

const cancelForm = () => { showForm.value = false; editingId.value = null; form.value = { tipo:'preferencia', titulo:'', contenido:'', privada:false }; };

const saveNote = () => {
  if (editingId.value) {
    emit('update', editingId.value, { ...form.value });
  } else {
    emit('create', { ...form.value });
  }
  cancelForm();
};

const startEdit = (note) => {
  form.value = { tipo: note.tipo, titulo: note.titulo, contenido: note.contenido, privada: note.privada };
  editingId.value = note.id;
  showForm.value = true;
};
</script>

<style scoped>
.guest-notes { display: flex; flex-direction: column; gap: 1.25rem; }
.notes-header { display: flex; justify-content: space-between; align-items: center; }
.notes-title  { font-size: 1.05rem; font-weight: 800; color: #1a1a1a; margin: 0; }
.gn--premium .notes-title { color: #d4af37; }

.btn-add { background: #4a5d4b; color: white; border: none; padding: .5rem 1rem;
           border-radius: .65rem; font-size: .82rem; font-weight: 700; cursor: pointer;
           transition: all 180ms ease; }
.btn-add:hover { background: #3a4d3b; }
.gn--premium .btn-add { background: #d4af37; color: #1a1a1a; box-shadow: 0 4px 12px rgba(212,175,55,0.3); }
.gn--premium .btn-add:hover { background: #f0d080; transform: translateY(-1px); }

/* Form */
.note-form { background: #fdfaf7; border: 1px solid #e8e2d8; border-radius: 1rem; padding: 1.25rem; display: flex; flex-direction: column; gap: .75rem; }
.gn--premium .note-form { background: #151515; border-color: rgba(212,175,55,0.2); }
.form-row   { display: flex; gap: .75rem; }
.form-select, .form-input {
  border: 1px solid #e8e2d8; border-radius: .65rem; padding: .5rem .85rem;
  font-size: .85rem; color: #1a1a1a; background: white; outline: none;
}
.gn--premium .form-select, .gn--premium .form-input, .gn--premium .form-textarea {
  background: #222; border-color: #333; color: #e5e5e5;
}
.gn--premium .form-input:focus, .gn--premium .form-textarea:focus { border-color: #d4af37; }
.form-select { flex: 0 0 auto; }
.form-input  { flex: 1; }
.form-textarea { border: 1px solid #e8e2d8; border-radius: .65rem; padding: .5rem .85rem;
                 font-size: .85rem; resize: none; outline: none; font-family: inherit; }
.form-actions { display: flex; justify-content: space-between; align-items: center; }
.form-check   { display: flex; align-items: center; gap: .4rem; font-size: .82rem; color: #6a7c6b; cursor: pointer; }
.form-btns    { display: flex; gap: .5rem; }
.btn-cancel   { background: none; border: 1px solid #d8d0c4; border-radius: .65rem; padding: .4rem .85rem; font-size: .82rem; cursor: pointer; }
.btn-save     { background: #4a5d4b; color: white; border: none; border-radius: .65rem; padding: .4rem .85rem; font-size: .82rem; font-weight: 700; cursor: pointer; }
.gn--premium .btn-save { background: #d4af37; color: #1a1a1a; }
.btn-save:disabled { opacity: .45; cursor: not-allowed; }

/* Notes grid */
.notes-empty { text-align: center; color: #9aa89b; padding: 2rem 0; }
.notes-grid  { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }

.note-card { border-radius: 1rem; padding: 1.1rem; border: 1px solid transparent; display: flex; flex-direction: column; gap: .5rem; transition: transform 180ms; }
.note-card:hover { transform: translateY(-2px); }
.gn--premium .note--preferencia { background: rgba(212,175,55,0.05); border-color: rgba(212,175,55,0.15); }
.gn--premium .note--alerta      { background: rgba(220,38,38,0.1); border-color: rgba(220,38,38,0.2); }
.gn--premium .note--vip         { background: rgba(212,175,55,0.1); border-color: rgba(212,175,55,0.4); }
.gn--premium .note--interna     { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); }

.note--preferencia { background: #f0faf0; border-color: #c5e8c6; }
.note--alerta      { background: #fff4f4; border-color: #f5c5c5; }
.note--vip         { background: #fffbec; border-color: #f5e6a3; }
.note--interna     { background: #f4f6f2; border-color: #d8d8d8; }

.note-card-header { display: flex; align-items: center; gap: .5rem; }
.note-tipo-badge  { font-size: .72rem; font-weight: 700; color: #4a5d4b; }
.gn--premium .note-tipo-badge { color: #d4af37; }
.note-private     { font-size: .8rem; margin-left: auto; }
.note-actions     { display: flex; gap: .25rem; margin-left: auto; }
.btn-icon         { background: none; border: none; cursor: pointer; font-size: .85rem; color: #6a7c6b; padding: .2rem .35rem; border-radius: .4rem; transition: background 150ms; }
.btn-icon:hover   { background: rgba(0,0,0,.06); }
.btn-icon--danger:hover { background: #fee2e2; color: #b91c1c; }

.note-titulo    { font-size: .9rem; font-weight: 800; color: #1a1a1a; margin: 0; }
.gn--premium .note-titulo { color: #f0d080; }
.note-contenido { font-size: .82rem; color: #4a5a4c; margin: 0; line-height: 1.5; }
.gn--premium .note-contenido { color: #ccc; }
.note-date      { font-size: .7rem; color: #9aa89b; align-self: flex-end; }

/* Transition */
.slide-fade-enter-active { transition: all 200ms ease; }
.slide-fade-leave-active { transition: all 150ms ease; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
