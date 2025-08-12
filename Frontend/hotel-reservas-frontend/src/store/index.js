// store/index.js
import { createStore } from 'vuex';
import api from '../services/api';

export default createStore({
  state: {
    usuario: JSON.parse(localStorage.getItem('usuario')) || null,
    token: localStorage.getItem('token') || null
  },
  mutations: {
    setUsuario(state, usuario) {
      state.usuario = usuario;
      localStorage.setItem('usuario', JSON.stringify(usuario));
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    logout(state) {
      state.usuario = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
  },
  actions: {
    async login({ commit }, { email, password }) {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      commit('setToken', token);
      commit('setUsuario', user);
    }
  }
});
