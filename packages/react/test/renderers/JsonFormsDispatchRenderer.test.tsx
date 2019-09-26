/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import React, { useLayoutEffect } from 'react';
import { act } from 'react-dom/test-utils';
import {
  createAjv,
  JsonSchema,
  Layout,
  rankWith,
  RendererProps,
  schemaMatches,
  UISchemaElement,
  uiTypeIs,
  resetRefCache
} from '@jsonforms/core';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mount } from 'enzyme';
import { StatelessRenderer } from '../../src/Renderer';

import { JsonForms, JsonFormsDispatchRenderer } from '../../src/JsonForms';
import waitUntil from 'async-wait-until';
import { JsonFormsStateProvider, withJsonFormsControlProps } from '../../src/JsonFormsContext';

Enzyme.configure({ adapter: new Adapter() });

/**
 * Describes the initial state of the JSON Form's store.
 */
export interface JsonFormsInitialState {
  /**
   * Data instance to be rendered.
   */
  data: any;

  /**
   * JSON Schema describing the data to be rendered.
   */
  schema?: JsonSchema;

  /**
   * UI Schema describing the UI to be rendered.
   */
  uischema?: UISchemaElement;

  /**
   * Any additional state.
   */
  [x: string]: any;
}

const CustomRenderer1: StatelessRenderer<RendererProps> = () => <h1>test</h1>;
const CustomRenderer2: StatelessRenderer<RendererProps> = () => <h2>test</h2>;

const fixture = {
  data: { foo: 'John Doe' },
  uischema: {
    type: 'Control',
    scope: '#/properties/foo'
  },
  schema: {
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    }
  }
};

afterEach(() => {
  resetRefCache();
});

test('JsonForms renderer should report about missing renderer', async () => {
  const wrapper = mount(
    <JsonFormsDispatchRenderer
      schema={fixture.schema}
      uischema={fixture.uischema}
      path={''}
      rootSchema={fixture.schema}
      renderers={[]}
    />
  );

  await act(
    async () => await waitUntil(() => wrapper.state('renderer') !== undefined)
  );

  expect(wrapper.text()).toContain('No applicable renderer found');
  wrapper.unmount();
});

test('JsonForms renderer should pick most applicable renderer', async () => {
  const renderers = [
    {
      tester: async () => 10,
      renderer: CustomRenderer1
    },
    {
      tester: async () => 5,
      renderer: CustomRenderer2
    }
  ];
  const wrapper = mount(
    <JsonFormsDispatchRenderer
      schema={fixture.schema}
      uischema={fixture.uischema}
      path={''}
      rootSchema={fixture.schema}
      renderers={renderers}
    />
  );
  await act(
    async () => await waitUntil(() => wrapper.state('renderer') !== undefined)
  );
  wrapper.update();
  expect(wrapper.find('h1').text()).toBe('test');
  wrapper.unmount();
});

test('ids should be unique within the same form', async () => {
  const ids: string[] = [];
  const MyCustomRenderer: StatelessRenderer<any> = props => {
    useLayoutEffect(() => { ids.push(props.id); }, [props.id]);
    return <div>Custom</div>;
  };
  const FakeLayout = (props: RendererProps) => {
    const layout = props.uischema as Layout;
    const children = layout.elements.map((e, idx) => (
      <JsonFormsDispatchRenderer
        uischema={e}
        schema={fixture.schema}
        path={props.path}
        key={`${props.path}-${idx}`}
        rootSchema={props.schema}
        renderers={[
          {
            tester: rankWith(10, async () => true),
            renderer: MyCustomRenderer
          }
        ]}
      />
    ));
    return <div className='layout'>{children}</div>;
  };

  const uischema2 = {
    type: 'HorizontalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/foo'
      },
      {
        type: 'Control',
        scope: '#/properties/foo'
      }
    ]
  };

  const wrapper = mount(
    <JsonFormsDispatchRenderer
      schema={fixture.schema}
      rootSchema={fixture.schema}
      uischema={uischema2}
      renderers={
        [
          {
            tester: rankWith(10, uiTypeIs('HorizontalLayout')),
            renderer: FakeLayout
          },
          {
            tester: rankWith(10, async () => true),
            renderer: MyCustomRenderer
          }
        ]}
    />
  );

  await act(
    async () => await waitUntil(() => wrapper.find(JsonFormsDispatchRenderer).first().state('renderer') !== undefined)
  );

  expect(ids.indexOf('#/properties/foo') > -1).toBeTruthy();
  expect(ids.indexOf('#/properties/foo2') > -1).toBeTruthy();
  wrapper.unmount();
});

test('render schema with $ref', async () => {
  const schemaWithRef = {
    definitions: {
      n: {
        type: 'number'
      }
    },
    type: 'object',
    properties: {
      foo: {
        $ref: '#/definitions/n'
      }
    }
  };

  const tester = rankWith(10, schemaMatches(s => s.type === 'number'));

  const renderers = [
    {
      tester,
      renderer: CustomRenderer2
    },
    //{
    //  tester: refResolverTester,
    //  renderer: RefResolver
    //}
  ];

  const wrapper = mount(
    <JsonFormsDispatchRenderer
      path={''}
      uischema={fixture.uischema}
      schema={schemaWithRef}
      renderers={renderers}
      rootSchema={schemaWithRef}
    />
  );
  await act(
    async () => await waitUntil(() => wrapper.state('renderer') !== undefined)
  );

  wrapper.update();
  expect(wrapper.find(CustomRenderer2).length).toBe(1);
});

test('updates schema with ref', async () => {
  const schemaWithRef = {
    definitions: {
      n: {
        type: 'number'
      }
    },
    type: 'object',
    properties: {
      foo: {
        $ref: '#/definitions/n'
      }
    }
  };

  const tester1 = rankWith(10, schemaMatches(s => s.type === 'string'));
  const tester2 = rankWith(10, schemaMatches(s => s.type === 'number'));

  const renderers = [
    {
      tester: tester1,
      renderer: CustomRenderer1
    },
    {
      tester: tester2,
      renderer: CustomRenderer2
    }
  ];

  const wrapper = mount(
    <JsonFormsDispatchRenderer
      path={''}
      uischema={fixture.uischema}
      schema={fixture.schema}
      renderers={renderers}
      rootSchema={fixture.schema}
    />
  );

  await act(
    async () => await waitUntil(() => wrapper.state('renderer') !== undefined)
  );
  wrapper.update();
  expect(wrapper.find(CustomRenderer1).length).toBe(1);

  resetRefCache();
  wrapper.setProps({ rootSchema: schemaWithRef });
  await act(
    async () => await waitUntil(() => wrapper.state('renderer') !== undefined)
  );
  wrapper.update();
  expect(wrapper.find(CustomRenderer2).length).toBe(1);
  wrapper.unmount();
});

test('JsonForms should support two isolated components', async () => {
  const schema1 = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        minLength: 1
      }
    }
  };
  const schema2 = {
    type: 'object',
    properties: {
      bar: {
        type: 'number',
        minimum: 1
      }
    }
  };
  const customRenderer1 = withJsonFormsControlProps(({ errors }) => {
    return <h1>{errors ? errors : 0}</h1>;
  });
  const customRenderer2 = withJsonFormsControlProps(({ errors }) => {
    return <h2>{errors ? errors : 0}</h2>;
  });
  const fooControl = { type: 'Control', scope: '#/properties/foo' };
  const barControl = { type: 'Control', scope: '#/properties/bar' };
  const wrapper = mount(
    <div>
      <JsonForms
        data={{ foo: '' }}
        uischema={fooControl}
        schema={schema1}
        renderers={[{ tester: async () => 3, renderer: customRenderer1 }]}
      />
      <JsonForms
        data={{ bar: 0 }}
        schema={schema2}
        uischema={barControl}
        renderers={[{ tester: async () => 3, renderer: customRenderer2 }]}
      />
    </div>
  );

  await act(
    async () => await waitUntil(() =>
      wrapper.find(JsonFormsDispatchRenderer).first().state('renderer') !== undefined
    )
  );
  await act(
    async () => await waitUntil(
      () => wrapper.find(JsonFormsDispatchRenderer).at(1).state('renderer') !== undefined
    )
  );

  wrapper.update();
  expect(wrapper.find('h1').getDOMNode().textContent).toBe('should NOT be shorter than 1 characters');
  expect(wrapper.find('h2').getDOMNode().textContent).toBe('should be >= 1');
  wrapper.unmount();
});

test('JsonForms should create a JsonFormsStateProvider with initState props', async () => {
  const tester = async (_uischema: UISchemaElement, s: JsonSchema) =>
    s.properties.foo.type === 'number' ? 1 : -1;

  const renderers = [
    {
      tester: tester,
      renderer: CustomRenderer2
    }
  ];

  const ajv = createAjv();

  const refParserOptions = {
    resolve: {
      geo: {
        order: 1,
        canRead: (file: any) => {
          return file.url.indexOf('geographical-location.schema.json') !== -1;
        },
        read: () => {
          return JSON.stringify(fixture.schema);
        }
      }
    } as any
  };

  const wrapper = mount(
    <JsonForms
      data={fixture.data}
      uischema={fixture.uischema}
      schema={fixture.schema}
      ajv={ajv}
      refParserOptions={refParserOptions}
      renderers={renderers}
    />
  );

  const jsonFormsStateProviderInitStateProp = wrapper
    .find(JsonFormsStateProvider)
    .props().initState;
  expect(jsonFormsStateProviderInitStateProp.core.data).toBe(fixture.data);
  expect(jsonFormsStateProviderInitStateProp.core.uischema).toBe(
    fixture.uischema
  );
  expect(jsonFormsStateProviderInitStateProp.core.schema).toBe(fixture.schema);
  expect(jsonFormsStateProviderInitStateProp.core.ajv).toBe(ajv);
  expect(jsonFormsStateProviderInitStateProp.core.refParserOptions).toBe(
    refParserOptions
  );

  expect(jsonFormsStateProviderInitStateProp.renderers).toBe(renderers);
});

test('JsonForms should call onChange handler with new data', async () => {
  const onChangeHandler = jest.fn();
  const TestInputRenderer = withJsonFormsControlProps(props => (
    <input onChange={ev => props.handleChange('foo', ev.target.value)} />
  ));

  const renderers = [
    {
      tester: async () => 10,
      renderer: TestInputRenderer
    }
  ];
  const wrapper = mount(
    <JsonForms
      data={fixture.data}
      uischema={fixture.uischema}
      schema={fixture.schema}
      onChange={onChangeHandler}
      renderers={renderers}
    />
  );

  await act(async () => await waitUntil(
    () => wrapper.find(JsonFormsDispatchRenderer).first().state('renderer') !== undefined
  ));
  wrapper.update();
  wrapper.find('input').simulate('change', {
    target: {
      value: 'Test Value'
    }
  });

  const calls = onChangeHandler.mock.calls;
  const lastCallParameter = calls[calls.length - 1][0];
  expect(lastCallParameter.data).toEqual({ foo: 'Test Value' });
  expect(lastCallParameter.errors).toEqual([]);
});

test('JsonForms should call onChange handler with errors', async () => {
  const onChangeHandler = jest.fn();
  const TestInputRenderer = withJsonFormsControlProps(props => (
    <input onChange={ev => props.handleChange('foo', ev.target.value)} />
  ));

  const schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        minLength: 5
      }
    },
    required: ['foo']
  };

  const renderers = [
    {
      tester: async () => 10,
      renderer: TestInputRenderer
    }
  ];
  const wrapper = mount(
    <JsonForms
      data={fixture.data}
      uischema={fixture.uischema}
      schema={schema}
      onChange={onChangeHandler}
      renderers={renderers}
    />
  );

  await act(async () => await waitUntil(
    () => wrapper.find(JsonFormsDispatchRenderer).first().state('renderer') !== undefined
  ));
  wrapper.update();

  wrapper.find('input').simulate('change', {
    target: {
      value: 'xyz'
    }
  });

  const calls = onChangeHandler.mock.calls;
  const lastCallParameter = calls[calls.length - 1][0];
  expect(lastCallParameter.data).toEqual({ foo: 'xyz' });
  expect(lastCallParameter.errors.length).toEqual(1);
  expect(lastCallParameter.errors[0].keyword).toEqual('minLength');
});

test('JsonForms should update if data prop is updated', async () => {
  const onChangeHandler = jest.fn();
  const TestInputRenderer = withJsonFormsControlProps(props => (
    <input onChange={ev => props.handleChange('foo', ev.target.value)} />
  ));

  const schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        minLength: 5
      }
    },
    required: ['foo']
  };

  const renderers = [
    {
      tester: async () => 10,
      renderer: TestInputRenderer
    }
  ];
  const wrapper = mount(
    <JsonForms
      data={fixture.data}
      uischema={fixture.uischema}
      schema={schema}
      onChange={onChangeHandler}
      renderers={renderers}
    />
  );

  await (act(async () => wrapper.setProps({ data: { foo: 'Another name' } })));
  wrapper.update();
  expect(wrapper.props().data.foo).toBe('Another name');
});
