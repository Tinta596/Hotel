<template>
<<<<<<< HEAD
  <div class="container mt-4">
    <h2>Panel de Administrador</h2>

    <div class="btn-group my-3">
      <button class="btn btn-primary" @click="seccion = 'reservas'">Reservas</button>
      <button class="btn btn-primary" @click="seccion = 'usuarios'">Usuarios</button>
      <button class="btn btn-primary" @click="seccion = 'habitaciones'">Habitaciones</button>
      <button class="btn btn-primary" @click="seccion = 'servicios'">Servicios</button>
    </div>

    <!-- Mostrar carga si no hay datos -->
    <div v-if="cargando">Cargando datos...</div>


    <!-- Modal edición reserva -->
    <div v-if="modalVisible" class="modal-backdrop">
      <div class="modal-contenido p-3 bg-white rounded shadow">
        <h5>Editar Reserva</h5>
        <label>Check-in:</label>
        <input type="date" v-model="reservaEditada.fecha_checkin" class="form-control mb-2"/>
        <label>Check-out:</label>
        <input type="date" v-model="reservaEditada.fecha_checkout" class="form-control mb-2"/>
        <label>Habitación #:</label>
        <input type="number" v-model="reservaEditada.habitacion_id" class="form-control mb-2"/>
        <label>Precio Total:</label>
        <input type="number" v-model="reservaEditada.precio_total" class="form-control mb-3"/>

        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary me-2" @click="cerrarModal">Cancelar</button>
          <button class="btn btn-success" @click="actualizarReserva">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Modal edición precio habitación -->
    <div v-if="modalPrecioVisible" class="modal-backdrop">
      <div class="modal-contenido p-3 bg-white rounded shadow">
        <h5>Editar Precio – Hab. {{ habitacionEditada.numero }}</h5>
        <label>Precio Base:</label>
        <input type="number" v-model="habitacionEditada.precio" class="form-control mb-3"/>
        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary me-2" @click="cerrarModalPrecio">Cancelar</button>
          <button class="btn btn-success" @click="actualizarPrecio">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Sección Reservas -->
    <ul class="list-group" v-if="seccion === 'reservas'">
      <li v-for="r in reservas" :key="r.id" class="list-group-item d-flex justify-content-between align-items-center">
        <span>#{{ r.id }} – Habitación {{ r.habitacion_id }} de {{ r.fecha_checkin }} a {{ r.fecha_checkout }} – 💵 ${{ r.precio_total }}</span>
        <div v-if="['admin','trabajador'].includes(user.rol)" class="btn-group">
          <button class="btn btn-danger btn-sm" @click="eliminarReserva(r.id)">🗑️ Eliminar</button>
          <button class="btn btn-warning btn-sm" @click="abrirModalEdicion(r)">✏️ Editar</button>
        </div>
      </li>
    </ul>

    <!-- Sección Usuarios -->
    <div v-if="seccion === 'usuarios'">
      <h4>👥 Usuarios</h4>
      <ul class="list-group">
        <li v-for="u in usuarios" :key="u.id" class="list-group-item">
          {{ u.nombre }} – {{ u.email }} – Rol: {{ u.rol }}
        </li>
      </ul>
    </div>

    <!-- Sección Habitaciones -->
    <div v-if="seccion === 'habitaciones'">
      <h4>🛌 Habitaciones</h4>
      <p v-if="habitaciones.length === 0" class="text-muted">No hay habitaciones disponibles.</p>
      <ul class="list-group">
        <li v-for="h in habitaciones" :key="h.id" class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>Habitación {{ h.numero }}</strong><br />
            Estado: <span :class="estadoClase(h.estado)">{{ h.estado }}</span><br />
            Tipo: {{ h.tipo_nombre }}<br />
            Precio: 💵 ${{ h.precio }}
            <!-- Debug (muestra datos crudos) -->
            <pre>{{ h }}</pre>
          </div>
          <div v-if="user.rol === 'admin'">
            <button class="btn btn-sm btn-outline-primary" @click="abrirModalPrecio(h)">💲 Cambiar Precio</button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Sección Servicios -->
    <div v-if="seccion === 'servicios'">
      <h4>📮️ Servicios</h4>
      <ul class="list-group mb-3">
        <li v-for="s in servicios" :key="s.id" class="list-group-item d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <img v-if="s.imagen_url" :src="s.imagen_url" class="rounded me-3 service-img" alt="Servicio"/>
            <div>
              <strong>{{ s.nombre }}</strong><br/>
              {{ s.descripcion }}<br/>
              💰 ${{ s.precio }}<br/>
              <small class="text-muted">Estado: {{ s.activo ? 'Activo' : 'Oculto' }}</small>
            </div>
          </div>
          <div v-if="user.rol === 'admin'" class="btn-group">
            <button class="btn btn-warning btn-sm" @click="cargarServicio(s)">✏️ Editar</button>
            <button class="btn btn-sm" :class="s.activo ? 'btn-outline-warning' : 'btn-outline-success'" @click="toggleServicioActivo(s)">
              {{ s.activo ? 'Ocultar' : 'Activar' }}
            </button>
          </div>
        </li>
      </ul>

      <!-- Formulario de Servicio -->
      <form @submit.prevent="guardarServicio" enctype="multipart/form-data" class="mb-4">
        <div class="row g-2">
          <div class="col-md-6">
            <input class="form-control" type="text" v-model="servicio.nombre" placeholder="Nombre" required/>
          </div>
          <div class="col-md-6">
            <input class="form-control" type="number" v-model="servicio.precio" placeholder="Precio"/>
          </div>
          <div class="col-12">
            <textarea class="form-control" v-model="servicio.descripcion" placeholder="Descripción"></textarea>
          </div>
          <div class="col-md-6">
            <input class="form-control" type="number" v-model="servicio.capacidad_maxima" placeholder="Capacidad"/>
          </div>
          <div class="col-md-3">
            <input class="form-control" type="time" v-model="servicio.horario_inicio"/>
          </div>
          <div class="col-md-3">
            <input class="form-control" type="time" v-model="servicio.horario_fin"/>
          </div>
          <div class="col-6 form-check">
            <input class="form-check-input" type="checkbox" v-model="servicio.requiere_reserva" id="reqRes"/>
            <label class="form-check-label" for="reqRes">Requiere reserva</label>
          </div>
          <div class="col-6 form-check">
            <input class="form-check-input" type="checkbox" v-model="servicio.activo" id="activoServ"/>
            <label class="form-check-label" for="activoServ">Activo</label>
          </div>
          <div class="col-12">
            <input class="form-control" type="file" @change="handleImagen" accept="image/*"/>
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-primary w-100">Guardar Servicio</button>
          </div>
        </div>
      </form>
    </div>
=======
    <div class="container mt-4">
        <h2>Panel de Administrador</h2>


        <div class="btn-group my-3">
            <button class="btn btn-primary" @click="seccion = 'reservas'">Reservas</button>
            <button class="btn btn-primary" @click="seccion = 'usuarios'">Usuarios</button>
            <button class="btn btn-primary" @click="seccion = 'habitaciones'">Habitaciones</button>
            <button class="btn btn-primary" @click="seccion = 'servicios'">Servicios</button>
        </div>

        <div v-if="seccion === 'reservas'">
            <h4>📋 Reservas</h4>
            <ul class="list-group">
                <li v-for="r in reservas" :key="r.id" class="list-group-item">
                    Reserva #{{ r.id }} -Habitacion {{ r.habitacion_id }} - {{ r.fecha_checkin }} a {{ r.fecha_checkout }}
                </li>
            </ul>
        </div>

        <div v-if="seccion === 'usuarios'">
            <h4>👥 Usuarios</h4>
            <ul class="list-group">
                <li v-for="u in usuarios" :key="u.id" class="list-group-item">
                {{ u.nombre }} - {{ u.email }} - Rol: {{ u.rol }}
                </li>
            </ul>
        </div>

        <div v-if="seccion === 'habitaciones'">
            <h4>🛏️ Habitaciones</h4>
            <ul class="list-group">
                <li v-for="h in habitaciones" :key="h.id" class="list-group-item">
                #{{ h.numero }} - {{ h.tipo_nombre }} - {{ h.estado }} - ${{ h.precio_base }}
                </li>
            </ul>
        </div>

        <div v-if="seccion === 'servicios'">
            <h4>🛎️ Servicios</h4>
            <ul class="list-group">
                <li v-for="s in servicios" :key="s.id" class="list-group-item">
                {{ s.nombre }} - {{ s.descripcion }}
                </li>
            </ul>
        </div>
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
  </div>
</template>

<script>
<<<<<<< HEAD
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

export default {
  setup() {
=======
import {ref, onMounted} from 'vue';
import api from '../services/api';
import {useToast} from 'vue-toastification';
import { useRouter } from 'vue-router';

export default {
    setup() {
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
    const seccion = ref('reservas');
    const reservas = ref([]);
    const usuarios = ref([]);
    const habitaciones = ref([]);
    const servicios = ref([]);
<<<<<<< HEAD
    const servicio = ref({
      id: null,
      nombre: '',
      descripcion: '',
      precio: 0,
      capacidad_maxima: 0,
      horario_inicio: '',
      horario_fin: '',
      requiere_reserva: false,
      activo: true
    });
    const imagen = ref(null);
    const modalVisible = ref(false);
    const modalPrecioVisible = ref(false);
    const reservaEditada = ref({});
    const habitacionEditada = ref({});
    const toast = useToast();
    const router = useRouter();
    const user = JSON.parse(localStorage.getItem('usuario') || '{}');
    const cargando = ref(false);

    const estadoClase = est => ({
      ocupada: 'text-danger',
      disponible: 'text-success'
    }[est] || 'text-secondary');

    const cargarDatos = async () => {
    try {
      const [res1, res2, res3, res4] = await Promise.all([
        api.get('/reservas', { headers: { 'Cache-Control': 'no-cache' } }),
        api.get('/usuarios', { headers: { 'Cache-Control': 'no-cache' } }),
        api.get('/habitaciones', { headers: { 'Cache-Control': 'no-cache' } }),
        api.get('/servicios', { headers: { 'Cache-Control': 'no-cache' } })
      ]);
      console.log('📦 Habitaciones cargadas:', res3.data);

      reservas.value = res1.data;
      usuarios.value = res2.data;
      habitaciones.value = res3.data;
      servicios.value = res4.data;
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar datos');
    }
    finally{
      cargando.value = false;
    }
  };


    const abrirModalEdicion = r => {
      reservaEditada.value = { ...r };
      modalVisible.value = true;
    };
    const cerrarModal = () => modalVisible.value = false;
    const actualizarReserva = async () => {
      try {
        await api.put(`/reservas/${reservaEditada.value.id}`, reservaEditada.value);
        toast.success('Reserva actualizada');
        cerrarModal(); cargarDatos();
      } catch {
        toast.error('Error al actualizar');
      }
    };
    const eliminarReserva = async id => {
      if (!confirm('¿Eliminar reserva?')) return;
      await api.delete(`/reservas/${id}`);
      toast.success('Reserva eliminada');
      cargarDatos();
    };
    const abrirModalPrecio = h => {
      habitacionEditada.value = { ...h };
      modalPrecioVisible.value = true;
    };
    const cerrarModalPrecio = () => modalPrecioVisible.value = false;
    const actualizarPrecio = async () => {
      try {
        await api.put(`/habitaciones/${habitacionEditada.value.id}/precio`, { precio_base: habitacionEditada.value.precio });
        toast.success('Precio actualizado');
        cerrarModalPrecio(); cargarDatos();
      } catch {
        toast.error('Error al actualizar precio');
      }
    };

    const handleImagen = e => imagen.value = e.target.files[0];

    const guardarServicio = async () => {
      const form = new FormData();
      Object.entries(servicio.value).forEach(([k, v]) => form.append(k, v));
      if (imagen.value) form.append('imagen', imagen.value);

      try {
        if (servicio.value.id) {
          await api.put(`/servicios/${servicio.value.id}`, form);
          toast.success('Servicio actualizado');
        } else {
          await api.post('/servicios', form);
          toast.success('Servicio creado');
        }
        servicio.value = { id: null, nombre: '', descripcion: '', precio: 0, capacidad_maxima: 0, horario_inicio: '', horario_fin: '', requiere_reserva: false, activo: true };
        imagen.value = null;
        cargarDatos();
      } catch {
        toast.error('Error guardando servicio');
      }
    };

    const cargarServicio = s => {
      servicio.value = { ...s };
    };

    const toggleServicioActivo = async (servicioItem) => {
      try {
        await api.put(`/servicios/${servicioItem.id}/toggle`);
        toast.success(servicioItem ? 'Servicio ocultado' : 'Servicio activado');
        cargarDatos();
      } catch (error) {
        toast.error('Error al cambiar visibilidad');
      }
    }
    onMounted(cargarDatos);

    return {
      seccion, reservas, usuarios, habitaciones, servicios,
      servicio, user,
      modalVisible, modalPrecioVisible, cargando,
      reservaEditada, habitacionEditada,
      abrirModalEdicion, cerrarModal, actualizarReserva,
      eliminarReserva, abrirModalPrecio, cerrarModalPrecio,
      actualizarPrecio, estadoClase,
      handleImagen, guardarServicio, cargarServicio, toggleServicioActivo
    };
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
}
.modal-contenido {
  width: 100%; max-width: 500px;
}
.service-img {
  width: 60px; height: 60px; object-fit: cover;
}
</style>
=======
    const toast = useToast();
    const router = useRouter();
    const user = JSON.parse(localStorage.getItem('usuario'));


    const cargarDatos = async () => {
            try {
                const [res1,res2,res3,res4] = await Promise.all([
                    api.get('/reservas'),
                    api.get('/usuarios'),
                    api.get('/habitaciones'),
                    api.get('/servicios')
                ]);
                
                reservas.value = res1.data;
                usuarios.value = res2.data;
                habitaciones.value = res3.data;
                servicios.value = res4.data;
            } 
            catch (error) {
                toast.error('Error al cargar datos del administrador');
            }
        };

        onMounted(cargarDatos);

         onMounted(() => {
            if (!user || user.rol !== 'admin') {
            router.push('/'); // redirige al home si no es admin
            }
        });
        return{
            seccion,
            reservas,
            usuarios,
            habitaciones,
            servicios
        };
    }
};
</script>
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
