import {
  and,
  optionIs,
  rankWith,
  type JsonFormsRendererRegistryEntry,
} from '@jsonforms/core';
import controlRenderer from './MultiEnumSelectRenderer.vue';
import { isMultiEnumControl } from '../util/tester';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(
    10,
    and(optionIs('format', 'multiselect'), isMultiEnumControl),
  ),
};
