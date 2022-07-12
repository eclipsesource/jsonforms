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
import React from 'react';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import type {
  ControlElement,
  ControlProps,
  DispatchCellProps,
  JsonFormsState,
  JsonFormsStore,
  JsonSchema,
  Layout,
  RendererProps,
  UISchemaElement,
} from '@jsonforms/core';
import {
  createAjv,
  jsonFormsReducerConfig,
  NOT_APPLICABLE,
  rankWith,
  registerCell,
  registerRenderer,
  schemaMatches,
  uiTypeIs,
  unregisterRenderer,
} from '@jsonforms/core';
import { isEqual } from 'lodash';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import type { StatelessRenderer } from '../../src/Renderer';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {
  JsonForms,
  JsonFormsDispatch,
  JsonFormsDispatchRenderer
} from '../../src/JsonForms';
import {
  JsonFormsStateProvider,
  useJsonForms,
  withJsonFormsControlProps
} from '../../src/JsonFormsContext';
import { JsonFormsReduxContext } from '../../src/redux';
import { DispatchCell } from '../../src/DispatchCell';

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

export const initJsonFormsStore = ({
  data,
  schema,
  uischema,
  ...props
}: JsonFormsInitialState): JsonFormsStore => {
  const initState: JsonFormsState = {
    jsonforms: {
      core: {
        data,
        schema,
        uischema
      },
      ...props
    }
  };
  const reducer = combineReducers({ jsonforms: combineReducers(jsonFormsReducerConfig) });
  return createStore(reducer, initState);
};

const CustomRenderer1: StatelessRenderer<RendererProps> = () => <h1>test</h1>;
const CustomRenderer2: StatelessRenderer<RendererProps> = () => <h2>test</h2>;
const CustomRenderer3: StatelessRenderer<RendererProps> = () => <h3>test</h3>;
const CellRenderer1: StatelessRenderer<DispatchCellProps> = () => (
  <h1 className='cell test 1'>test</h1>
);
const CellRenderer2: StatelessRenderer<DispatchCellProps> = () => (
  <h2 className='cell test 2'>test</h2>
);

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
      },
      stringArray: {
        type: 'array',
        items: { type: 'number' }
      }
    }
  }
};

test('JsonForms renderer should report about missing renderer', () => {
  const store = initJsonFormsStore({
    data: fixture.data,
    uischema: fixture.uischema
  });

  const wrapper = mount(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <JsonFormsDispatch />
      </JsonFormsReduxContext>
    </Provider>
  );

  expect(wrapper.text()).toContain('No applicable renderer found');
  wrapper.unmount();
});

test('JsonForms renderer should pick most applicable renderer', () => {
  const store = initJsonFormsStore({
    data: fixture.data,
    uischema: fixture.uischema
  });
  store.dispatch(registerRenderer(() => 10, CustomRenderer1));
  store.dispatch(registerRenderer(() => 5, CustomRenderer2));
  const wrapper = mount(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <JsonFormsDispatch />
      </JsonFormsReduxContext>
    </Provider>
  );

  expect(wrapper.find('h1').text()).toBe('test');
  wrapper.unmount();
});

test('JsonForms renderer should not consider any de-registered renderers', () => {
  const tester1 = () => 9;
  const tester2 = () => 8;
  const tester3 = () => 10;
  const store = initJsonFormsStore({
    data: fixture.data,
    uischema: fixture.uischema
  });
  store.dispatch(registerRenderer(tester1, CustomRenderer1));
  store.dispatch(registerRenderer(tester2, CustomRenderer2));
  store.dispatch(registerRenderer(tester3, CustomRenderer3));
  store.dispatch(unregisterRenderer(tester3, CustomRenderer2));
  const wrapper = mount(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <JsonFormsDispatch />
      </JsonFormsReduxContext>
    </Provider>
  );

  expect(wrapper.find('h1')).toBeDefined();
  wrapper.unmount();
});

test('deregister an unregistered renderer should be a no-op', () => {
  const store = initJsonFormsStore(fixture);
  store.dispatch(registerRenderer(() => 10, CustomRenderer1));
  store.dispatch(registerRenderer(() => 5, CustomRenderer2));
  const tester = () => 10;
  const nrOfRenderers = store.getState().jsonforms.renderers.length;
  store.dispatch(unregisterRenderer(tester, CustomRenderer3));
  expect(store.getState().jsonforms.renderers.length).toBe(nrOfRenderers);
});

test('ids should be unique within the same form', () => {
  const FakeLayout = (props: RendererProps) => {
    const layout = props.uischema as Layout;
    const children = layout.elements.map((e, idx) => (
      <JsonFormsDispatch
        uischema={e}
        schema={fixture.schema}
        path={props.path}
        key={`${props.path}-${idx}`}
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

  const store = initJsonFormsStore({
    data: fixture.data,
    schema: fixture.schema,
    uischema: uischema2,
    renderers: [
      {
        tester: rankWith(10, uiTypeIs('HorizontalLayout')),
        renderer: FakeLayout
      }
    ]
  });

  const ids: string[] = [];
  const MyCustomRenderer: StatelessRenderer<any> = props => {
    ids.push(props.id);
    return <div>Custom</div>;
  };
  store.dispatch(registerRenderer(() => 10, MyCustomRenderer));

  const wrapper = mount(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <JsonFormsDispatch uischema={uischema2} schema={fixture.schema} />
      </JsonFormsReduxContext>
    </Provider>
  );

  expect(ids.indexOf('#/properties/foo') > -1).toBeTruthy();
  expect(ids.indexOf('#/properties/foo2') > -1).toBeTruthy();
  wrapper.unmount();
});

test('render schema with $ref', () => {
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

  const tester = rankWith(1, schemaMatches(schema => schema.type === 'number'));

  const renderers = [
    {
      tester: tester,
      renderer: CustomRenderer2
    }
  ];

  const wrapper = mount(
    <JsonFormsDispatchRenderer
      path={''}
      uischema={fixture.uischema}
      schema={schemaWithRef}
      renderers={renderers}
      rootSchema={schemaWithRef}
      config={undefined}
    />
  );

  expect(wrapper.find(CustomRenderer2).length).toBe(1);
  wrapper.unmount();
});

test('updates schema with ref', () => {
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
  const resolvedSchema: any = {
    definitions: {
      n: {
        type: 'number'
      }
    },
    type: 'object',
    properties: {
      foo: {
        type: 'number'
      }
    }
  };

  const tester1 = rankWith(1, schemaMatches(schema => schema.type === 'string'))
  const tester2 = rankWith(1, schemaMatches(schema => schema.type === 'number'))

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
      rootSchema={resolvedSchema}
      config={undefined}
    />
  );
  expect(wrapper.find(CustomRenderer1).length).toBe(1);

  wrapper.setProps({ schema: schemaWithRef });

  wrapper.update();
  expect(wrapper.find(CustomRenderer2).length).toBe(1);
  wrapper.unmount();
});

test('JsonForms renderer should pick most applicable renderer via ownProps', () => {
  const store = initJsonFormsStore({
    data: fixture.data,
    uischema: fixture.uischema
  });
  store.dispatch(registerRenderer(() => 10, CustomRenderer1));
  store.dispatch(registerRenderer(() => 5, CustomRenderer2));

  const wrapper = mount(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <JsonFormsDispatch
          uischema={fixture.uischema}
          schema={fixture.schema}
          renderers={[
            { tester: () => 3, renderer: CustomRenderer3 },
            { tester: () => 1, renderer: CustomRenderer2 }
          ]}
        />
      </JsonFormsReduxContext>
    </Provider>
  );
  expect(wrapper.find('h3').text()).toBe('test');
  wrapper.unmount();
});

test('JsonForms renderer should pick most applicable cell renderer via ownProps', () => {
  const uiSchema = {
    type: 'Control',
    scope: '#/properties/stringArray'
  };
  const data = { stringArray: ['lol', 'pop'] };
  const schema = {
    type: 'object',
    properties: {
      stringArray: {
        type: 'array',
        items: { type: 'string' }
      }
    }
  };
  const store = initJsonFormsStore({
    data: data,
    uischema: uiSchema,
    schema: schema
  });
  store.dispatch(registerCell(() => 50, CellRenderer1));

  const ArrayRenderer: StatelessRenderer<RendererProps> = props => {
    return (
      <DispatchCell
        schema={props.schema}
        uischema={{
          type: 'Control',
          scope: '#/properties/stringArray',
          label: false
        }}
        path={props.path}
        enabled={true}
        renderers={props.renderers}
        cells={props.cells}
      />
    );
  };

  const wrapper = mount(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <JsonFormsDispatch
          renderers={[{ tester: () => 100, renderer: ArrayRenderer }]}
          cells={[{ tester: () => 1, cell: CellRenderer2 }]}
        />
      </JsonFormsReduxContext>
    </Provider>
  );
  expect(wrapper.find({ className: 'cell test 2' })).toHaveLength(1);
  wrapper.unmount();
});

test('JsonForms renderer should not fail when there are no renderers in store, but there are in ownProps', () => {
  const store = initJsonFormsStore({
    data: fixture.data,
    uischema: fixture.uischema
  });

  const wrapper = mount(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <JsonFormsDispatch
          uischema={fixture.uischema}
          schema={fixture.schema}
          renderers={[{ tester: () => 3, renderer: CustomRenderer3 }]}
        />
      </JsonFormsReduxContext>
    </Provider>
  );
  expect(wrapper.find('h3').text()).toBe('test');
  wrapper.unmount();
});

test('JsonForms renderer should pick uiSchema from ownProps', () => {
  const store = initJsonFormsStore({
    data: fixture.data,
    uischema: fixture.uischema
  });
  store.dispatch(
    registerRenderer(
      rankWith(10, uiTypeIs('HorizontalLayout')),
      CustomRenderer1
    )
  );
  store.dispatch(registerRenderer(() => 5, CustomRenderer2));

  const myUiSchema = {
    type: 'HorizontalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/foo'
      }
    ]
  };
  const wrapper = mount(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <JsonFormsDispatch uischema={myUiSchema} />
      </JsonFormsReduxContext>
    </Provider>
  );

  expect(wrapper.find('h1').text()).toBe('test');
  wrapper.unmount();
});

test('JsonForms renderer should pick schema from ownProps', () => {
  const mySchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'boolean'
      }
    }
  };
  const store = initJsonFormsStore({
    data: fixture.data,
    uischema: fixture.uischema,
    schema: fixture.schema
  });

  store.dispatch(
    registerRenderer(
      rankWith(10, (_, schema) => isEqual(schema, mySchema)),
      CustomRenderer1
    )
  );
  store.dispatch(registerRenderer(() => 5, CustomRenderer2));

  const wrapper = mount(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <JsonFormsDispatch schema={mySchema} />
      </JsonFormsReduxContext>
    </Provider>
  );
  expect(wrapper.find('h1').text()).toBe('test');
  wrapper.unmount();
});

test('JsonForms renderer should pick enabled prop from ownProps', () => {
  const CustomRenderer4: StatelessRenderer<RendererProps> = props => {
    return <h3>{`${props.enabled}`}</h3>;
  };

  const store = initJsonFormsStore({
    data: fixture.data,
    uischema: fixture.uischema,
    schema: fixture.schema
  });

  store.dispatch(registerRenderer(() => 5, CustomRenderer4));

  const wrapper = mount(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <JsonFormsDispatch enabled={false} />
      </JsonFormsReduxContext>
    </Provider>
  );
  expect(wrapper.find('h3').text()).toBe('false');
  wrapper.unmount();
});

test('JsonForms should support two isolated components', () => {
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
  const customRenderer1 = () => {
    const ctx = useJsonForms();
    const errors = ctx.core.errors;
    return <h1>{errors ? errors.length : 0}</h1>;
  };
  const customRenderer2 = () => {
    const ctx = useJsonForms();
    const errors = ctx.core.errors;
    return <h2>{errors ? errors.length : 0}</h2>;
  };
  const fooControl: ControlElement = { type: 'Control', scope: '#/properties/foo' };
  const barControl: ControlElement = { type: 'Control', scope: '#/properties/bar' };
  const wrapper = mount(
    <div>
      <JsonForms
        data={{ foo: '' }}
        uischema={fooControl}
        schema={schema1}
        renderers={[{ tester: () => 3, renderer: customRenderer1 }]}
      />
      <JsonForms
        data={{ bar: 0 }}
        schema={schema2}
        uischema={barControl}
        renderers={[{ tester: () => 3, renderer: customRenderer2 }]}
      />
    </div>
  );

  expect(wrapper.find('h2').text()).toBe('1');
  expect(wrapper.find('h1').text()).toBe('1');
  wrapper.unmount();
});

test('JsonForms should create a JsonFormsStateProvider with initState props', () => {
  const tester = (_uischema: UISchemaElement, s: JsonSchema) =>
    s.properties.foo.type === 'number' ? 1 : -1;

  const renderers = [
    {
      tester: tester,
      renderer: CustomRenderer2
    }
  ];

  const ajv = createAjv();

  const wrapper = mount(
    <JsonForms
      data={fixture.data}
      uischema={fixture.uischema}
      schema={fixture.schema}
      ajv={ajv}
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

  expect(jsonFormsStateProviderInitStateProp.renderers).toBe(renderers);
});

test('JsonForms should honor config passed via initState props', () => {

  const customRenderer = () => {
    const ctx = useJsonForms();
    return <h2>{ctx.config.myConfigProperty}</h2>;
  };
    const renderers = [
      { tester: () => 30, renderer: customRenderer }
  ];

  const wrapper = mount(
    <JsonForms
      data={fixture.data}
      uischema={fixture.uischema}
      schema={fixture.schema}
      renderers={renderers}
      config={{myConfigProperty: 'true'}}
    />
  );

    wrapper.update();
    expect(wrapper.find('h2').text()).toBe('true');
    wrapper.unmount();
});

test('JsonForms should generate an ui schema when uischema is not given', () => {
  const schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    }
  };
  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/foo'
      }
    ]
  };

  const wrapper = shallow(
    <JsonForms data={{}} schema={schema} renderers={undefined} />
  );

  const jsonFormsStateProviderInitStateProp = wrapper
    .find(JsonFormsStateProvider)
    .props().initState;
  expect(jsonFormsStateProviderInitStateProp.core.uischema).toStrictEqual(
    uischema
  );
});

test('JsonForms should generate an ui schema when uischema is not valid', () => {
  const schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    }
  };
  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/foo'
      }
    ]
  };

  const wrapper = shallow(
    <JsonForms
      data={{}}
      schema={schema}
      uischema={true as any}
      renderers={undefined}
    />
  );

  const jsonFormsStateProviderInitStateProp = wrapper
    .find(JsonFormsStateProvider)
    .props().initState;
  expect(jsonFormsStateProviderInitStateProp.core.uischema).toStrictEqual(
    uischema
  );
});

test('JsonForms should generate a schema when schema is not given', () => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    },
    additionalProperties: true,
    required: ['foo']
  };
  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/foo'
      }
    ]
  };

  const wrapper = shallow(
    <JsonForms data={{ foo: 'bar' }} renderers={undefined} />
  );

  const jsonFormsStateProviderInitStateProp = wrapper
    .find(JsonFormsStateProvider)
    .props().initState;
  expect(jsonFormsStateProviderInitStateProp.core.schema).toStrictEqual(schema);
  expect(jsonFormsStateProviderInitStateProp.core.uischema).toStrictEqual(
    uischema
  );
});

test('JsonForms should use uischemas', () => {
  const schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'object',
        properties: {
          bar: {
            type: 'string',
          },
          baz: {
            type: 'number'
          }
        }
      }
    }
  };

  const uischemas = [
    {
      tester: (_jsonSchema: JsonSchema, schemaPath: string) => {
        return schemaPath === '#/properties/foo' ? 2 : NOT_APPLICABLE;
      },
      uischema: {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/bar'
          },
          {
            type: 'Control',
            scope: '#/properties/baz'
          }
        ]
      }
    }
  ];

  const wrapper = shallow(
    <JsonForms
      data={{}}
      schema={schema}
      uischema={true as any}
      renderers={undefined}
      uischemas={uischemas}
    />
  );

  const jsonFormsStateProviderInitStateProp = wrapper
    .find(JsonFormsStateProvider)
    .props().initState;
  expect(jsonFormsStateProviderInitStateProp.uischemas).toStrictEqual(
    uischemas
  );
});

test('JsonForms should not crash with undefined uischemas', () => {
  const schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      }
    }
  };

  const wrapper = shallow(
    <JsonForms
      data={{}}
      schema={schema}
      uischema={true as any}
      renderers={undefined}
      uischemas={undefined}
    />
  );

  const jsonFormsStateProviderInitStateProp = wrapper
    .find(JsonFormsStateProvider)
    .props().initState;
  expect(jsonFormsStateProviderInitStateProp.uischemas).toStrictEqual(
    undefined
  );
});

test('JsonForms should call onChange handler with new data', (done) => {
  const onChangeHandler = jest.fn();
  const TestInputRenderer = withJsonFormsControlProps(props => (
    <input onChange={ev => props.handleChange('foo', ev.target.value)} />
  ));

  const renderers = [
    {
      tester: () => 10,
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

  wrapper.find('input').simulate('change', {
    target: {
      value: 'Test Value'
    }
  });

  // events are debounced for some time, so let's wait
  setTimeout(() => {
    const calls = onChangeHandler.mock.calls;
    const lastCallParameter = calls[calls.length - 1][0];
    expect(lastCallParameter.data).toEqual({ foo: 'Test Value' });
    expect(lastCallParameter.errors).toEqual([]);
    done();
  }, 50);
  
});

test('JsonForms should call onChange handler with errors', (done) => {
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
      tester: () => 10,
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

  wrapper.find('input').simulate('change', {
    target: {
      value: 'xyz'
    }
  });

  // events are debounced for some time, so let's wait
  setTimeout(() => {
    const calls = onChangeHandler.mock.calls;
    const lastCallParameter = calls[calls.length - 1][0];
    expect(lastCallParameter.data).toEqual({ foo: 'xyz' });
    expect(lastCallParameter.errors.length).toEqual(1);
    expect(lastCallParameter.errors[0].keyword).toEqual('minLength');
    done();
  }, 50);

});

test('JsonForms should update if data prop is updated', () => {
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
      tester: () => 10,
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

  wrapper.setProps({ data: { foo: 'Another name' } });
  wrapper.update();
  expect(wrapper.props().data.foo).toBe('Another name');
});

test('JsonForms should use additionalErrors if provided', () => {

  const CustomRendererWithError: StatelessRenderer<ControlProps> = ({errors}) => { 
    return (<h5>{errors}</h5>) 
  };

  const renderers = [
    {
      tester: () => 1000,
      renderer: withJsonFormsControlProps(CustomRendererWithError)
    }
  ];
  const additionalErrors = [{
    instancePath: '',
    dataPath: '',
    schemaPath: '#/required',
    keyword: 'required',
    params: {
      missingProperty: 'foo'
    },
    message: 'Lorem ipsum'
  }];
  const wrapper = mount(
    <JsonForms
      data={fixture.data}
      uischema={fixture.uischema}
      schema={fixture.schema}
      renderers={renderers}
      additionalErrors={additionalErrors}
    />
  );
  expect(wrapper.find('h5').text()).toBe('Lorem ipsum');
  wrapper.unmount();
});

test('JsonForms should use react to additionalErrors update', () => {

  const CustomRendererWithError: StatelessRenderer<ControlProps> = ({ errors }) => {
    return (<h5>{errors}</h5>)
  };

  const renderers = [
    {
      tester: () => 1000,
      renderer: withJsonFormsControlProps(CustomRendererWithError)
    }
  ];
  const additionalErrors = [{
    instancePath: '',
    dataPath: '',
    schemaPath: '#/required',
    keyword: 'required',
    params: {
      missingProperty: 'foo'
    },
    message: 'Lorem ipsum'
  }];
  const wrapper = mount(
    <JsonForms
      data={fixture.data}
      uischema={fixture.uischema}
      schema={fixture.schema}
      renderers={renderers}
      additionalErrors={additionalErrors}
    />
  );
  expect(wrapper.find('h5').text()).toBe('Lorem ipsum');

  wrapper.setProps({
    additionalErrors: [{
      instancePath: '',
      dataPath: '',
      schemaPath: '#/required',
      keyword: 'required',
      params: {
        missingProperty: 'foo'
      },
      message: 'Foobar'
    }]
  });
  wrapper.update();
  expect(wrapper.find('h5').text()).toBe('Foobar');
  wrapper.unmount();
});