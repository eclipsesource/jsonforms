/**
 * Vuetify Vue CLI Preset
 *
 * store/index.js
 *
 * vuex documentation: https://vuex.vuejs.org/
 */

// Vue
import { createStore } from 'vuex';
import { RootState } from './types';

// Utilities
// https://davestewart.github.io/vuex-pathify/#/
import pathify from '../plugins/vuex-pathify';

// Modules
// https://vuex.vuejs.org/guide/modules.html
import appModule from './modules/app';

export default createStore<RootState>({
  state: {
    version: '1.0.0',
  },
  modules: {
    app: appModule,
  },
  plugins: [pathify.plugin],
});

// A reusable const for making root commits and dispatches
// https://vuex.vuejs.org/guide/modules.html#accessing-global-assets-in-namespaced-modules
export const ROOT_DISPATCH = Object.freeze({ root: true });
