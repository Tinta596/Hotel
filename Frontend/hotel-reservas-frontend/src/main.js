import { createApp } from 'vue';
import App from './App.vue';
import './styles/global.css';
import router from './router/index.js';
import store from './store/index.js';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);
app.use(router);
app.use(store);
app.use(Toast);
app.mount('#app');
