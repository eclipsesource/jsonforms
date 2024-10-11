import { describe, it, expect, beforeEach } from 'vitest';
import { clearAllIds, type Translator } from '@jsonforms/core';
import OneOfControlRenderer from '../../../src/complex/OneOfRenderer.vue';
import { entry as oneOfControlRendererEntry } from '../../../src/complex/OneOfRenderer.entry';
import { mountJsonForms } from '../util';

describe('OneOfRenderer.vue', () => {
  const renderers = [oneOfControlRendererEntry];

  const data: unknown[] = [[{ name: 'foo', done: false }]];
  const schema = {
    oneOf: [
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            done: { type: 'boolean' },
          },
        },
      },
      {
        type: 'object',
        properties: {
          name: { type: 'string' },
          done: { type: 'boolean' },
        },
      },
    ],
  };
  const uischema = {
    type: 'Control',
    scope: '#',
  };

  let wrapper: ReturnType<typeof mountJsonForms>;

  beforeEach(() => {
    // clear all ids to guarantee that the snapshots will always be generated with the same ids
    clearAllIds();
    wrapper = mountJsonForms(data, schema, renderers, uischema, undefined, {
      translate: ((id, defaultMessage) => {
        if (id.endsWith('clearDialogAccept')) {
          return 'Do the clear!';
        }
        return defaultMessage;
      }) as Translator,
    });
  });

  it('check if child OneOfControl exists', () => {
    expect(wrapper.getComponent(OneOfControlRenderer));
  });

  it('respects translations', async () => {
    // trigger the selection change
    wrapper.getComponent(OneOfControlRenderer).vm.handleSelectChange();
    // wait until the dialog is rendered
    await wrapper.vm.$nextTick();
    // dialog is rendered in document outside of the wrapper
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    // search for text in children of the add buton
    let found = false;
    document
      .querySelector('[data-testid="clear-dialog-accept"]')
      ?.querySelectorAll('*')
      .forEach((el) => {
        if (el.textContent?.includes('Do the clear!')) {
          found = true;
        }
      });
    expect(found).toBeTruthy();
  });

  it('should render component and match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
