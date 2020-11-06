import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  CellProps,
  ControlProps,
  JsonSchema,
  NOT_APPLICABLE,
  OwnPropsOfEnum,
  rankWith,
  StatePropsOfControlWithDetail
} from '@jsonforms/core';

import { JsonForms } from '../src/JsonForms';
import { withJsonFormsDetailProps, withJsonFormsEnumCellProps, withJsonFormsEnumProps } from '../src/JsonFormsContext';

Enzyme.configure({ adapter: new Adapter() });

test('withJsonFormsEnumProps - constant: should supply control and enum props', () => {
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
      tester: rankWith(1, () => true),
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
    />
  );
  const mockEnumControlUnwrappedProps = wrapper
    .find(MockEnumControlUnwrapped)
    .props();

  expect(mockEnumControlUnwrappedProps.uischema).toEqual(uischema);
  expect(mockEnumControlUnwrappedProps.schema).toEqual(schema.properties.name);
  expect(mockEnumControlUnwrappedProps.path).toEqual('name');
  expect(mockEnumControlUnwrappedProps.id).toEqual('#/properties/name');
  expect(mockEnumControlUnwrappedProps.options).toEqual([{value: 'Cambodia', label: 'Cambodia'}]);
});

test('withJsonFormsEnumProps - enum: should supply control and enum props', () => {
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
      tester: rankWith(1, () => true),
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
    />
  );
  const mockEnumControlUnwrappedProps = wrapper.find(MockEnumControlUnwrapped).props();
  expect(mockEnumControlUnwrappedProps.uischema).toEqual(uischema);
  expect(mockEnumControlUnwrappedProps.schema).toEqual(schema.properties.color);
  expect(mockEnumControlUnwrappedProps.path).toEqual('color');
  expect(mockEnumControlUnwrappedProps.id).toEqual('#/properties/color');
  expect(mockEnumControlUnwrappedProps.options).toEqual([
    {value: 'red', label: 'red'},
    {value: 'amber', label: 'amber'},
    {value: 'green', label: 'green'},
    {value: null, label: 'null'}
  ]);
});

test('withJsonFormsEnumCellProps - constant: should supply control and enum props', () => {
  const MockEnumCellUnwrapped = (_: CellProps & OwnPropsOfEnum) => {
    return <></>;
  };

  const MockEnumControl = withJsonFormsEnumCellProps(MockEnumCellUnwrapped);

  const schema = {
    const: 'Cambodia'
  };

  const renderers = [
    {
      tester: rankWith(1, () => true),
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
    />
  );
  const mockEnumControlUnwrappedProps = wrapper
    .find(MockEnumCellUnwrapped)
    .props();

  expect(mockEnumControlUnwrappedProps.uischema).toEqual(uischema);
  expect(mockEnumControlUnwrappedProps.schema).toEqual(schema);
  expect(mockEnumControlUnwrappedProps.options).toEqual([{label: 'Cambodia', value: 'Cambodia'}]);
});

test('withJsonFormsEnumCellProps - enum: should supply control and enum props', () => {
  const MockEnumCellUnwrapped = (_: CellProps & OwnPropsOfEnum) => {
    return <></>;
  };

  const MockEnumControl = withJsonFormsEnumCellProps(MockEnumCellUnwrapped);

  const schema = {
    type: 'string',
    enum: ['red', 'amber', 'green', null]
  };

  const renderers = [
    {
      tester: rankWith(1, () => true),
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
    />
  );
  const mockEnumControlUnwrappedProps = wrapper.find(MockEnumCellUnwrapped).props();
  expect(mockEnumControlUnwrappedProps.uischema).toEqual(uischema);
  expect(mockEnumControlUnwrappedProps.schema).toEqual(schema);
  expect(mockEnumControlUnwrappedProps.options).toEqual([
    {value: 'red', label: 'red'},
    {value: 'amber', label: 'amber'},
    {value: 'green', label: 'green'},
    {value: null, label: 'null'}
  ]);
});

test('withJsonFormsDetailProps - should use uischemas props', () => {
  const MockUISchemas = (_: StatePropsOfControlWithDetail) => {
    return <></>;
  };

  const MockBasicRenderer = withJsonFormsDetailProps(MockUISchemas);

  const schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
      },
      bar: {
        type: 'number'
      }
    }
  };

  const renderers = [
    {
      tester: rankWith(1, () => true),
      renderer: MockBasicRenderer
    }
  ];

  const uischemas = [
    {
      tester: (_jsonSchema: JsonSchema, schemaPath: string) => {
        return schemaPath === '#/properties/color' ? 2 : NOT_APPLICABLE;
      },
      uischema: {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/foo'
          },
          {
            type: 'Control',
            scope: '#/properties/bar'
          }
        ]
      }
    }
  ];

  const uischema = {
    type: 'Control',
    scope: '#'
  };

  const wrapper = mount(
    <JsonForms
      data={{}}
      schema={schema}
      uischema={uischema}
      renderers={renderers}
      uischemas={uischemas}
    />
  );
  const mockUISchemasProps = wrapper.find(MockUISchemas).props();
  expect(mockUISchemasProps.uischema).toEqual(uischema);
  expect(mockUISchemasProps.schema).toEqual(schema);
  expect(mockUISchemasProps.uischemas).toEqual(uischemas);
});
