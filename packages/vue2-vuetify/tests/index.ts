import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

export const wait = (timeout?: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
