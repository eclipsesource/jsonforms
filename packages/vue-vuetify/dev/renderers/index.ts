import { rankWith, scopeEndsWith } from '@jsonforms/core';
import type { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import DisplayNameWithIconRenderer from './DisplayNameWithIconRenderer.vue';
import PasswordStrengthRenderer from './PasswordStrengthRenderer.vue';
import UsernameCheckerRenderer from './UsernameCheckerRenderer.vue';
import StringWithCopyRenderer from './StringWithCopyRenderer.vue';
import TemperatureRenderer from './TemperatureRenderer.vue';

export const prependAppendExampleRenderers: JsonFormsRendererRegistryEntry[] = [
  {
    renderer: DisplayNameWithIconRenderer,
    tester: rankWith(10, scopeEndsWith('displayName')),
  },
  {
    renderer: PasswordStrengthRenderer,
    tester: rankWith(10, scopeEndsWith('password')),
  },
  {
    renderer: UsernameCheckerRenderer,
    tester: rankWith(10, scopeEndsWith('username')),
  },
  {
    renderer: StringWithCopyRenderer,
    tester: rankWith(10, scopeEndsWith('email')),
  },
  {
    renderer: TemperatureRenderer,
    tester: rankWith(10, scopeEndsWith('temperature')),
  },
];

export function getCustomRenderersForExample(exampleName: string): JsonFormsRendererRegistryEntry[] {
  return exampleName === 'prepend-append-slots' ? prependAppendExampleRenderers : [];
}
