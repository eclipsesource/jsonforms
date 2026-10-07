import {
  and,
  optionIs,
  rankWith,
  uiTypeIs,
  type JsonFormsRendererRegistryEntry,
} from '@jsonforms/core';
import controlRenderer from './MultiEnumSelectRenderer.vue';
import { isMultiEnumControl } from '../util/tester';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(
    10,
    and(
      uiTypeIs('Control'),
      optionIs('format', 'multiselect'),
      isMultiEnumControl
    )
  ),
};
