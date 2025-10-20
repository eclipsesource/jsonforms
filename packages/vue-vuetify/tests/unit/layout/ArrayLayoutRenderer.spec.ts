import { describe, it, expect, beforeEach } from 'vitest';
import { clearAllIds, type Translator } from '@jsonforms/core';
import ArrayLayoutRenderer from '../../../src/layouts/ArrayLayoutRenderer.vue';
import { entry as arrayLayoutRendererEntry } from '../../../src/layouts/ArrayLayoutRenderer.entry';
import { mountJsonForms } from '../util';

describe('ArrayLayoutRenderer.vue', () => {
  const renderers = [arrayLayoutRendererEntry];

  const data: unknown[] = [];
  const schema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        done: { type: 'boolean' },
        person: { type: 'object', properties: { name: { type: 'string' } } },
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
      translate: ((id, defaultMessage) => {
        if (id.endsWith('addAriaLabel')) {
          return 'MyAdd';
        }
        return defaultMessage;
      }) as Translator,
    });
  });

  it('check if child ArrayLayout exists', () => {
    expect(wrapper.getComponent(ArrayLayoutRenderer));
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
