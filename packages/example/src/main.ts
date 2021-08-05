import Vue from 'vue';
import App from './App.vue';

import VueCompositionAPI from '@vue/composition-api';
Vue.use(VueCompositionAPI);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
