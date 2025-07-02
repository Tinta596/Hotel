<template>
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
  </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import api from '../services/api';
import {useToast} from 'vue-toastification';
import { useRouter } from 'vue-router';

export default {
    setup() {
    const seccion = ref('reservas');
    const reservas = ref([]);
    const usuarios = ref([]);
    const habitaciones = ref([]);
    const servicios = ref([]);
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