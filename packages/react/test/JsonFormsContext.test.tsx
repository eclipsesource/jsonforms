import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ControlProps, OwnPropsOfEnum, rankWith } from '@jsonforms/core';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { JsonForms, JsonFormsDispatchRenderer } from '../src/JsonForms';
import { withJsonFormsEnumProps } from '../src/JsonFormsContext';

Enzyme.configure({ adapter: new Adapter() });

test('withJsonFormsEnumProps - constant: should supply control and enum props', async () => {
  const MockEnumControlUnwrapped = (_: ControlProps & OwnPropsOfEnum) => {
    return <></>;
  };

  const MockEnumControl = withJsonFormsEnumProps(MockEnumControlUnwrapped);

  const schema = {
    type: 'object',
    properties: {
      name: {
        const: 'Cambodia'
      }
    },
    required: ['country']
  };

  const renderers = [
    {
      tester: rankWith(1, async () => true),
      renderer: MockEnumControl
    }
  ];

  const uischema = {
    type: 'Control',
    scope: '#/properties/name'
  };

  const wrapper = mount(
    <JsonForms
      data={{}}
      schema={schema}
      uischema={uischema}
      renderers={renderers}
      cells={[]}
    />
  );

  await (act(async () => wrapper.find(JsonFormsDispatchRenderer).state('renderer') !== undefined));
  wrapper.update();

  const mockEnumControlUnwrappedProps = wrapper
    .find(MockEnumControlUnwrapped)
    .props();

  expect(mockEnumControlUnwrappedProps.uischema).toEqual(uischema);
  expect(mockEnumControlUnwrappedProps.schema).toEqual(schema.properties.name);
  expect(mockEnumControlUnwrappedProps.path).toEqual('name');
  expect(mockEnumControlUnwrappedProps.id).toEqual('#/properties/name');
  expect(mockEnumControlUnwrappedProps.options).toEqual(['Cambodia']);
});

test('withJsonFormsEnumProps - enum: should supply control and enum props', async () => {
  const MockEnumControlUnwrapped = (_: ControlProps & OwnPropsOfEnum) => {
    return <></>;
  };

  const MockEnumControl = withJsonFormsEnumProps(MockEnumControlUnwrapped);

  const schema = {
    type: 'object',
    properties: {
      color: {
        type: 'string',
        enum: ['red', 'amber', 'green', null]
      }
    },
    required: ['color']
  };

  const renderers = [
    {
      tester: rankWith(1, async () => true),
      renderer: MockEnumControl
    }
  ];

  const uischema = {
    type: 'Control',
    scope: '#/properties/color'
  };

  const wrapper = mount(
    <JsonForms
      data={{}}
      schema={schema}
      uischema={uischema}
      renderers={renderers}
      cells={[]}
    />
  );
  await (act(async () => wrapper.find(JsonFormsDispatchRenderer).state('renderer') !== undefined));
  wrapper.update();
  const mockEnumControlUnwrappedProps = wrapper
    .find(MockEnumControlUnwrapped)
    .props();
  expect(mockEnumControlUnwrappedProps.uischema).toEqual(uischema);
  expect(mockEnumControlUnwrappedProps.schema).toEqual(schema.properties.color);
  expect(mockEnumControlUnwrappedProps.path).toEqual('color');
  expect(mockEnumControlUnwrappedProps.id).toEqual('#/properties/color');
  expect(mockEnumControlUnwrappedProps.options).toEqual([
    'red',
    'amber',
    'green',
    null
  ]);
});
