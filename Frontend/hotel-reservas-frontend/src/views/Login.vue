<template>
  <div class="wrapper">
    <div class="main-container">
      <img class="avatar" :src="usersIcon" alt="Usuario" />
      <h2>Iniciar Sesión</h2>
      <p>Bienvenido al sistema</p>

      <form @submit.prevent="login">
        <div class="icon-input">
          <img class="icon" :src="userIcon" alt="Usuario" />
          <input v-model="email" type="email" placeholder="Correo electrónico" required />
        </div>

        <div class="icon-input">
          <img class="icon" :src="userXIcon" alt="Contraseña" />
          <input v-model="password" type="password" placeholder="Contraseña" required />
        </div>

        <button type="submit">Ingresar</button>
      </form>

      <p class="mensaje" :class="{ mostrar: mensaje }">{{ mensaje }}</p>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import userIcon from '../assets/icons/user.svg';
import userXIcon from '../assets/icons/user-x.svg';
import usersIcon from '../assets/icons/users.svg';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const mensaje = ref('');
    const router = useRouter();
    const store = useStore();

    const login = async () => {
      try {
        const response = await store.dispatch('login', {
          email: email.value,
          password: password.value
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));

        const rol = response.data.usuario.rol;
        if (rol === 'admin') {
          router.push('/dashboard-admin');
        } else if (rol === 'trabajador') {
          router.push('/dashboard-trabajador');
        } else {
          router.push('/home');
        }
      } catch (error) {
        mensaje.value = error.response?.data?.error || 'Credenciales incorrectas o usuario inactivo.';
      }
    };


    return {
      email,
      password,
      mensaje,
      login,
      userIcon,
      userXIcon,
      usersIcon
    };
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #4facfe, #00f2fe);
}

body {
  margin: 0;
  font-family: "Segoe UI", sans-serif;
  background: linear-gradient(to right, #4facfe, #00f2fe);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-container {
  background-color: #ffffffee; /* blanco con un poco de transparencia */
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
}

h2 {
  margin: 0;
  font-weight: bold;
}

p {
  color: #444;
  margin-bottom: 20px;
}

.icon-input {
  position: relative;
  margin-bottom: 10px;
}

.icon-input img {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  opacity: 0.7;
}

.icon-input input {
  width: 100%;
  padding: 12px 12px 12px 42px;
  border: 2px solid black;
  border-radius: 12px;
  font-size: 16px;
  background-color: #e5e9ef;
}

.icon-input input:focus {
  outline: none;
  border-color: black;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #00c3ff;
  color: white;
  border: 2px solid black;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #009dc4;
}

.mensaje {
  margin-top: 15px;
  color: #008cff;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.mensaje.mostrar {
  opacity: 1;
}
</style>