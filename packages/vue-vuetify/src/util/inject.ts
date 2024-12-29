import type { InjectionKey } from 'vue';

export const UseDefaultValueKey: InjectionKey<boolean> = Symbol.for(
  'jsonforms-vue-vuetify:useDefaultValue',
);
