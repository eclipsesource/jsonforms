import { createApp } from 'vue';
import App from './App.vue';
import buildVuetify from './plugins/vuetify';

createApp(App).use(buildVuetify()).mount('#app');
