import Vue from 'vue';

import App from './App.vue';
import router from './router';
import http from './http';
import store from './store';

import './assets/styles/global.scss';

import './assets/fonts/linearicons/style.css';

Vue.config.productionTip = false;

Vue.prototype.$http = http;

const token = localStorage.getItem('token');
if (token)
  http.defaults.headers.common['Authorization'] = `Bearer ${token}`;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
