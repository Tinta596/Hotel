import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default function useAuth() {
  const store = useStore();
  const router = useRouter();

  const isAuthenticated = computed(() => !!store.state.token);
  const usuario = computed(() => store.state.usuario);

  const login = (usuarioData) => {
    store.dispatch('login', usuarioData);
    router.push('/');
  };

  const logout = () => {
    store.dispatch('logout');
    router.push('/login');
  };

  return {
    isAuthenticated,
    usuario,
    login,
    logout
  };
}