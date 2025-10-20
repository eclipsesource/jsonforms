import { describe, it, expect, beforeEach } from 'vitest';
import { clearAllIds, type Translator } from '@jsonforms/core';
import ListWithDetailRenderer from '../../../src/additional/ListWithDetailRenderer.vue';
import { entry as listWithDetailRendererEntry } from '../../../src/additional/ListWithDetailRenderer.entry';
import { mountJsonForms } from '../util';

describe('ListWithDetailRenderer.vue', () => {
  const renderers = [listWithDetailRendererEntry];

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
    type: 'ListWithDetail',
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

  it('check if child ListWithDetail exists', () => {
    expect(wrapper.getComponent(ListWithDetailRenderer));
  });

  it('renders an add button', () => {
    expect(wrapper.find('.list-with-detail-add').exists()).toBeTruthy();
  });

  it('respects translations', () => {
    expect(wrapper.find('[aria-label="MyAdd"]').exists()).toBeTruthy();
  });

  it('should render component and match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
