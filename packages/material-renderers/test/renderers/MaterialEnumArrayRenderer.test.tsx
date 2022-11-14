import './MatchMediaMock';
import { ControlElement, NOT_APPLICABLE } from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import {
  materialEnumArrayRendererTester,
  MaterialEnumArrayRenderer
} from '../../src';

const MaterialEnumArrayRendererRegistration = {
  tester: materialEnumArrayRendererTester,
  renderer: MaterialEnumArrayRenderer
};
const data = ['bar'];
const oneOfSchema = {
  type: 'array',
  items: {
    oneOf: [
      {
        const: 'foo',
        title: 'My Title'
      },
      {
        const: 'bar'
      }
    ]
  },
  uniqueItems: true
};

const enumSchema = {
  type: 'array',
  items: {
    type: 'string',
    enum: ['a', 'b', 'c']
  },
  uniqueItems: true
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#'
};

Enzyme.configure({ adapter: new Adapter() });

describe('EnumArrayControl tester', () => {
  test('should fail', () => {
    expect(
      materialEnumArrayRendererTester(uischema, {
        type: 'array',
        items: {}
      },
      undefined)
    ).toBe(NOT_APPLICABLE);
    expect(
      materialEnumArrayRendererTester(uischema, {
        type: 'array',
        items: {
          anyOf: []
        }
      },
      undefined)
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed for schema with enum items', () => {
    expect(materialEnumArrayRendererTester(uischema, enumSchema, undefined)).toBe(5);
  });
});

describe('EnumArrayControl', () => {
  let wrapper: ReactWrapper;

  afterEach(() => {
    wrapper.unmount();
  });

  test('oneOf items - renders', () => {
    wrapper = mount(
      <JsonForms
        schema={oneOfSchema}
        uischema={uischema}
        data={undefined}
        renderers={[MaterialEnumArrayRendererRegistration]}
      />
    );
    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(2);
  });

  test('oneOf items - renders with data', () => {
    wrapper = mount(
      <JsonForms
        schema={oneOfSchema}
        uischema={uischema}
        data={data}
        renderers={[MaterialEnumArrayRendererRegistration]}
      />
    );
    const inputs = wrapper.find('input');
    expect(inputs.first().props().checked).toBeFalsy();
    expect(inputs.last().props().checked).toBeTruthy();
  });

  test('oneOf items - renders labels for options', () => {
    wrapper = mount(
      <JsonForms
        schema={oneOfSchema}
        uischema={uischema}
        data={data}
        renderers={[MaterialEnumArrayRendererRegistration]}
      />
    );
    const labels = wrapper.find('label');
    expect(labels.first().text()).toBe('My Title');
    expect(labels.last().text()).toBe('bar');
  });

  test('oneOf items - updates data', (done) => {
    let myData: any = undefined;
    wrapper = mount(
      <JsonForms
        schema={oneOfSchema}
        uischema={uischema}
        data={myData}
        renderers={[MaterialEnumArrayRendererRegistration]}
        onChange={({ data }) => {
          myData = data;
        }}
      />
    );
    const input = wrapper.find('input').first();
    input.simulate('change', { target: { checked: true } });
    // events are debounced for some time, so let's wait
    setTimeout(() => {
      expect(myData).toStrictEqual(['foo']);
      done();
    }, 50);
  });

  test('enum items - renders', () => {
    wrapper = mount(
      <JsonForms
        schema={enumSchema}
        uischema={uischema}
        data={undefined}
        renderers={[MaterialEnumArrayRendererRegistration]}
      />
    );
    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(3);
  });

  test('enum items - renders with data', () => {
    wrapper = mount(
      <JsonForms
        schema={enumSchema}
        uischema={uischema}
        data={['b']}
        renderers={[MaterialEnumArrayRendererRegistration]}
      />
    );
    const inputs = wrapper.find('input');
    expect(inputs.at(0).props().checked).toBeFalsy();
    expect(inputs.at(1).props().checked).toBeTruthy();
    expect(inputs.at(2).props().checked).toBeFalsy();
  });

  test('enum items - renders labels for options', () => {
    wrapper = mount(
      <JsonForms
        schema={enumSchema}
        uischema={uischema}
        data={['b']}
        renderers={[MaterialEnumArrayRendererRegistration]}
      />
    );
    const labels = wrapper.find('label');
    expect(labels.at(0).text()).toBe('a');
    expect(labels.at(1).text()).toBe('b');
    expect(labels.at(2).text()).toBe('c');
  });

  test('enum items - updates data', (done) => {
    let myData: any = undefined;
    wrapper = mount(
      <JsonForms
        schema={enumSchema}
        uischema={uischema}
        data={myData}
        renderers={[MaterialEnumArrayRendererRegistration]}
        onChange={({ data }) => {
          myData = data;
        }}
      />
    );
    const input = wrapper.find('input').first();
    input.simulate('change', { target: { checked: true } });
    // events are debounced for some time, so let's wait
    setTimeout(() => {
      expect(myData).toStrictEqual(['a']);
      done();
    }, 50);
  });
});
