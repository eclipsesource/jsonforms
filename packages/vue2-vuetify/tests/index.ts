import Vue from 'vue';
import Vuetify from 'vuetify';
import VueCompositionAPI from '@vue/composition-api';

Vue.use(Vuetify);
Vue.use(VueCompositionAPI);

export const wait = (timeout?: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
