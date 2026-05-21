import { describe, it, expect } from 'vitest';
import type { ErrorObject } from 'ajv';
import { computed, defineComponent, h, nextTick, provide, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { useVuetifyArrayControl } from '../../../src/util/composition';

const makeError = (instancePath: string): ErrorObject => ({
  keyword: 'required',
  message: 'is required',
  instancePath,
  schemaPath: '#/required',
  params: {},
});

describe('useVuetifyArrayControl', () => {
  it('exposes a reactive rawChildErrors that reflects child error changes', async () => {
    const childErrors = ref<ErrorObject[]>([]);

    let captured: ReturnType<typeof useVuetifyArrayControl> | undefined;

    const Child = defineComponent({
      setup() {
        const control = computed(() => ({
          label: '',
          required: false,
          config: {},
          uischema: { type: 'Control', scope: '#' },
          schema: { type: 'array' },
          data: [],
          childErrors: childErrors.value,
          i18nKeyPrefix: '',
        }));
        captured = useVuetifyArrayControl({ control });
        return () => h('div');
      },
    });

    const Host = defineComponent({
      components: { Child },
      setup() {
        provide('jsonforms', {
          core: { data: {}, schema: {}, uischema: { type: 'Control' } },
          i18n: {
            translate: (_id: string, defaultMessage?: string) => defaultMessage,
          },
        });
        return () => h(Child);
      },
    });

    mount(Host);

    expect(captured).toBeDefined();
    expect(captured!.rawChildErrors.value).toEqual([]);

    const next = [makeError('/0/name')];
    childErrors.value = next;
    await nextTick();

    expect(captured!.rawChildErrors.value).toEqual(next);

    const updated = [makeError('/0/name'), makeError('/1/name')];
    childErrors.value = updated;
    await nextTick();

    expect(captured!.rawChildErrors.value).toEqual(updated);
  });
});
