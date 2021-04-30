import Vue, { VNode } from 'vue';
import App from './components/App.vue';
import VueCompositionAPI from '@vue/composition-api'

Vue.use(VueCompositionAPI)

Vue.config.productionTip = false;

new Vue({
  render: (h): VNode => h(App),
}).$mount('#app');
