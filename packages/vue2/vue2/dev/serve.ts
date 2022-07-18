import Vue, { VNode, CreateElement } from 'vue';
import App from './components/App.vue';

Vue.config.productionTip = false;

new Vue({
  render: (h: CreateElement): VNode => h(App),
}).$mount('#app');
