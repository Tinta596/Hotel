import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default function useAuth() {
  const store = useStore();
  const router = useRouter();

  const isAuthenticated = computed(() => !!store.state.token);
  const usuario = computed(() => store.state.usuario);
  const role = computed(() => usuario.value?.rol || null);

  const redirectByRole = user => {
    const userRole = user?.rol;

    if (userRole === 'admin') return router.push('/admin');
    if (userRole === 'trabajador') return router.push('/dashboard-trabajador');
    return router.push('/');
  };

  const login = async credentials => {
    const { user } = await store.dispatch('login', credentials);
    await redirectByRole(user);
    return user;
  };

  const register = async payload => {
    const { user } = await store.dispatch('register', payload);
    await redirectByRole(user);
    return user;
  };

  const logout = () => {
    store.dispatch('logout');
    router.push('/login');
  };

  return {
    isAuthenticated,
    usuario,
    role,
    login,
    register,
    redirectByRole,
    logout
  };
}
