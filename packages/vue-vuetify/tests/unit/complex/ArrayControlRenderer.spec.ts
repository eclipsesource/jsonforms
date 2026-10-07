import { describe, it, expect, beforeEach } from 'vitest';
import { clearAllIds, createTranslator } from '@jsonforms/core';
import ArrayControlRenderer from '../../../src/complex/ArrayControlRenderer.vue';
import { entry as arrayControlRendererEntry } from '../../../src/complex/ArrayControlRenderer.entry';
import { mountJsonForms } from '../util';

describe('ArrayControlRenderer.vue', () => {
  const renderers = [arrayControlRendererEntry];

  const data: unknown[] = [];
  const schema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        done: { type: 'boolean' },
      },
    },
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
      translate: createTranslator((id, defaultMessage) => {
        if (id.endsWith('addAriaLabel')) {
          return 'MyAdd';
        }
        return defaultMessage;
      }),
    });
  });

  it('check if child ArrayControl exists', () => {
    expect(wrapper.getComponent(ArrayControlRenderer));
  });

  it('renders an add button', () => {
    expect(wrapper.find('.array-list-add').exists()).toBeTruthy();
  });

  it('respects translations', () => {
    expect(wrapper.find('[aria-label="MyAdd"]').exists()).toBeTruthy();
  });

  it('should render component and match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
