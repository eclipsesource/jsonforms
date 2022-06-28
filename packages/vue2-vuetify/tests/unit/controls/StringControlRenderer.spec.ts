import { clearAllIds } from '@jsonforms/core';
import { Wrapper } from '@vue/test-utils';
import StringControlRenderer, {
  entry as stringControlRendererEntry,
} from '../../../src/controls/StringControlRenderer.vue';
import { wait } from '../../../tests';
import { mountJsonForms } from '../util';

describe('StringControlRenderer.vue', () => {
  const renderers = [stringControlRendererEntry];

  const data = 'a';
  const schema = {
    type: 'string',
    title: 'My String',
  };
  const uischema = {
    type: 'Control',
    scope: '#',
    options: {
      placeholder: 'string placeholder',
    },
  };

  let wrapper: Wrapper<any, Element>;

  beforeEach(() => {
    // clear all ids to guarantee that the snapshots will always be generated with the same ids
    clearAllIds();
    wrapper = mountJsonForms(data, schema, renderers, uischema);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('check if child StringControlRenderer exists', () => {
    expect(wrapper.getComponent(StringControlRenderer));
  });

  it('renders a string input', () => {
    const input = wrapper.find('input[type="text"]');
    expect(input.exists()).toEqual(true);
  });

  it('renders title as label', () => {
    expect(wrapper.find('label').text()).toEqual('My String');
  });

  it('emits a data change', async () => {
    const input = wrapper.find('input[type="text"]');
    await input.setValue('b');
    // 300 ms debounceWait
    await wait(300);
    expect(wrapper.vm.$data.data).toEqual('b');
  });

  it('should have a placeholder', async () => {
    const input = wrapper.find('input[type="text"]');
    await input.trigger('focus');
    const placeholder = input.attributes('placeholder');
    expect(placeholder).toEqual('string placeholder');
  });

  it('should render component and match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});

describe('StringControlRenderer.vue with suggestion', () => {
  const renderers = [stringControlRendererEntry];

  const data = '';

  const schema = {
    type: 'string',
    title: 'Select Continent',
  };
  const uischema = {
    type: 'Control',
    scope: '#',
    options: {
      placeholder: 'Enter your continent',
      suggestion: [
        'Asia',
        'Africa',
        'Europe',
        'North America',
        'South America',
        'Australia/Oceania',
        'Antarctica',
      ],
    },
  };

  let wrapper: Wrapper<any, Element>;

  beforeEach(() => {
    // clear all ids to guarantee that the snapshots will always be generated with the same ids
    clearAllIds();
    wrapper = mountJsonForms(data, schema, renderers, uischema);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('check if child StringControlRenderer exists', () => {
    expect(wrapper.getComponent(StringControlRenderer));
  });

  it('renders a string input', () => {
    const input = wrapper.find('input[type="text"]');
    expect(input.exists()).toEqual(true);
    expect(input.attributes('type')).toEqual('text');
  });

  it('renders title as label', () => {
    expect(wrapper.find('label').text()).toEqual('Select Continent');
  });

  it('emits a data change', async () => {
    const input = wrapper.find('input[type="text"]');
    await input.setValue('Europe');
    // select the element
    await input.trigger('keydown.enter');
    // 300 ms debounceWait
    await wait(300);
    expect(wrapper.vm.$data.data).toEqual('Europe');
  });

  it('should have a placeholder', async () => {
    const input = wrapper.find('input[type="text"]');
    // select the input so the placeholder is generated
    await input.trigger('click');

    const placeholder = input.attributes('placeholder');
    expect(placeholder).toEqual('Enter your continent');
  });

  it('should render component and match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render component and match snapshot when clicked', async () => {
    const input = wrapper.find('input[type="text"]');
    await input.trigger('click');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
