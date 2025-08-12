import { createApp } from 'vue';
import App from './App.vue';
import './styles/global.css';
import router from './router/index.js';
import store from './store/index.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);
app.use(router);
app.use(store);
app.use(Toast);
app.mount('#app');
