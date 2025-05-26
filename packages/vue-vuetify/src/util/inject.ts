import type { InjectionKey } from 'vue';

export const IsDynamicPropertyContext: InjectionKey<boolean> = Symbol.for(
  'jsonforms-vue-vuetify:IsDynamicPropertyContext',
);
