import type { DefineComponent, InjectionKey } from 'vue';
import type { Styles } from '../styles';
import type { useControlAppliedOptions } from './composition';

export const IsDynamicPropertyContext: InjectionKey<boolean> = Symbol.for(
  'jsonforms-vue-vuetify:IsDynamicPropertyContext',
);

export type AppliedOptions = ReturnType<typeof useControlAppliedOptions>;
export interface ControlWrapperProps {
  id?: string;
  description?: string;
  errors?: string;
  label?: string;
  visible?: boolean;
  required?: boolean;
  isFocused?: boolean;
  styles?: Styles;
  appliedOptions?: AppliedOptions;
}

export type ControlWrapperType = DefineComponent<
  ControlWrapperProps,
  any,
  any,
  any
>;

export const ControlWrapperSymbol: InjectionKey<ControlWrapperType> =
  Symbol.for('jsonforms-vue-vuetify:ControlWrapper');
