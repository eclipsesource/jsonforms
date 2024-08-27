/*
  The MIT License

  Copyright (c) 2017-2021 EclipseSource Munich
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
import * as React from 'react';
import {
  ControlElement,
  NOT_APPLICABLE,
  UISchemaElement,
} from '@jsonforms/core';
import BooleanToggleControl, {
  materialBooleanToggleControlTester,
} from '../../src/controls/MaterialBooleanToggleControl';
import * as ReactDOM from 'react-dom';
import { materialRenderers } from '../../src';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { JsonFormsStateProvider } from '@jsonforms/react';
import { initCore, TestEmitter } from './util';
import { Switch } from '@mui/material';

Enzyme.configure({ adapter: new Adapter() });

const data = { foo: true };
const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'boolean',
      description: 'My description',
    },
  },
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
  options: {
    toggle: true,
  },
};

describe('Material boolean toggle control tester', () => {
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    options: {
      toggle: true,
    },
  };

  it('should fail', () => {
    expect(
      materialBooleanToggleControlTester(undefined, undefined, undefined)
    ).toBe(NOT_APPLICABLE);
    expect(materialBooleanToggleControlTester(null, undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(
      materialBooleanToggleControlTester({ type: 'Foo' }, undefined, undefined)
    ).toBe(NOT_APPLICABLE);
    expect(
      materialBooleanToggleControlTester(
        { type: 'Control' },
        undefined,
        undefined
      )
    ).toBe(NOT_APPLICABLE);
    expect(
      materialBooleanToggleControlTester(
        control,
        {
          type: 'object',
          properties: { foo: { type: 'string' } },
        },
        undefined
      )
    ).toBe(NOT_APPLICABLE);
    expect(
      materialBooleanToggleControlTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'string',
            },
            bar: {
              type: 'boolean',
            },
          },
        },
        undefined
      )
    ).toBe(NOT_APPLICABLE);

    // Not applicable for boolean control if toggle option is false
    expect(
      materialBooleanToggleControlTester(
        {
          type: 'Control',
          scope: '#/properties/foo',
          options: {
            toggle: false,
          },
        } as UISchemaElement,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'boolean',
            },
          },
        },
        undefined
      )
    ).toBe(NOT_APPLICABLE);

    // Not applicable for boolean control if toggle option is not given
    expect(
      materialBooleanToggleControlTester(
        {
          type: 'Control',
          scope: '#/properties/foo',
        } as UISchemaElement,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'boolean',
            },
          },
        },
        undefined
      )
    ).toBe(NOT_APPLICABLE);
  });

  it('should succeed', () => {
    expect(
      materialBooleanToggleControlTester(
        control,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'boolean',
            },
          },
        },
        undefined
      )
    ).toBe(3);
  });
});

describe('Material boolean toggle control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  /** Use this container to render components */
  const container = document.createElement('div');

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
  });

  // seems to be broken in material-ui
  it('should autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: true,
        toggle: true,
      },
    };
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <BooleanToggleControl schema={schema} uischema={control} />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeTruthy();
  });

  it('should not autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: false,
        toggle: true,
      },
    };
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <BooleanToggleControl schema={schema} uischema={control} />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBe(false);
  });

  it('should not autofocus by default', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        toggle: true,
      },
    };
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <BooleanToggleControl schema={schema} uischema={control} />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should render', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <BooleanToggleControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    // Make sure a toggle is rendered by checking for the thumb element
    expect(wrapper.find(Switch)).toHaveLength(1);

    const input = wrapper.find('input').first();
    expect(input.props().type).toBe('checkbox');
    expect(input.props().checked).toBeTruthy();
  });

  it('should update via input event', () => {
    const core = initCore(schema, uischema, data);
    const onChangeData: any = {
      data: undefined,
    };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <BooleanToggleControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input');
    input.simulate('change', { target: { value: false } });
    expect(onChangeData.data.foo).toBeFalsy();
  });

  it('should update via action', () => {
    const core = initCore(schema, uischema, data);
    const onChangeData: any = {
      data: undefined,
    };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <BooleanToggleControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, foo: false };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().checked).toBeFalsy();
    expect(onChangeData.data.foo).toBeFalsy();
  });

  it('should update with undefined value', () => {
    const core = initCore(schema, uischema, data);
    const onChangeData: any = {
      data: undefined,
    };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <BooleanToggleControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, foo: undefined };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().checked).toBeFalsy();
  });

  it('should update with null value', () => {
    const core = initCore(schema, uischema, data);
    const onChangeData: any = {
      data: undefined,
    };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <BooleanToggleControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, foo: null };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().checked).toBeFalsy();
  });

  it('should not update with wrong ref', () => {
    const core = initCore(schema, uischema, data);
    const onChangeData: any = {
      data: undefined,
    };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <BooleanToggleControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, bar: 11 };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    const input = wrapper.find('input').first();
    expect(input.props().checked).toBeTruthy();
  });

  it('should not update with null ref', () => {
    const core = initCore(schema, uischema, data);
    const onChangeData: any = {
      data: undefined,
    };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <BooleanToggleControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, null: false };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    const input = wrapper.find('input').first();
    expect(input.props().checked).toBeTruthy();
  });

  it('should not update with an undefined ref', () => {
    const core = initCore(schema, uischema, data);
    const onChangeData: any = {
      data: undefined,
    };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <BooleanToggleControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, undefined: false };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().checked).toBeTruthy();
  });

  it('can be disabled', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <BooleanToggleControl
          schema={schema}
          uischema={uischema}
          enabled={false}
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <BooleanToggleControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeFalsy();
  });

  it('id should be present in output', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <BooleanToggleControl schema={schema} uischema={uischema} id='myid' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input');
    expect(input.props().id).toBe('myid-input');
  });

  it('unfocused description displays and is referenced by aria-describedby', () => {
    const core = initCore(schema, uischema, data);
    const config = { showUnfocusedDescription: true };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          renderers: materialRenderers,
          config: config,
          core,
        }}
      >
        <BooleanToggleControl schema={schema} uischema={uischema} id='myid' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input');
    expect(input.props()['aria-describedby']).toBe('myid-help1');
    const description = wrapper.find('#myid-help1').first();
    expect(description.text()).toBe('My description');
  });

  it('tooltip description is referenced by aria-describedby', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <BooleanToggleControl schema={schema} uischema={uischema} id='myid' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input');
    expect(input.props()['aria-describedby']).toBe('myid-tip');
  });
});
