import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import axios from 'axios'


Vue.config.productionTip = false
Vue.prototype.$http = axios

axios.defaults.baseURL = 'https://desafio-unbox-api.herokuapp.com/api/'
axios.defaults.headers.get['Accept'] = 'application/json'

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
