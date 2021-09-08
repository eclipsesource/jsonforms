import Vue from 'vue';
import App from './App.vue';

import VueCompositionAPI from '@vue/composition-api';
import vuetify from './plugins/vuetify';

Vue.use(VueCompositionAPI);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
