import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import './plugins';

// Vue.config.productionTip = false;

createApp(App).use(store).use(router).use(vuetify).mount('#app');

// new Vue({
//   router,
//   store,
//   vuetify,
//   render: (h) => h(App),
// }).$mount('#app');
