import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import { BootstrapVue } from 'bootstrap-vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

const api = axios.create({
  baseURL: process.env.BACKEND_URL
    ? process.env.BACKEND_URL
    : 'http://localhost:5000'
});

Vue.prototype.$api = api;
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');
