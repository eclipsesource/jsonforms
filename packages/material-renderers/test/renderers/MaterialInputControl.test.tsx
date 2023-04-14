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
import './MatchMediaMock';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import { materialRenderers } from '../../src';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import * as React from 'react';
import {
  ControlElement,
  ControlProps,
  ControlState,
  HorizontalLayout,
  isControl,
  JsonSchema,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import {
  Control,
  JsonFormsStateProvider,
  withJsonFormsControlProps,
} from '@jsonforms/react';
import { MaterialInputControl } from '../../src/controls/MaterialInputControl';
import MaterialHorizontalLayoutRenderer from '../../src/layouts/MaterialHorizontalLayout';
import { MuiInputText } from '../../src/mui-controls';
import { initCore } from './util';

Enzyme.configure({ adapter: new Adapter() });

const data = { foo: 'bar' };
const schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
    },
  },
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
};
class TestControlInner extends Control<ControlProps, ControlState> {
  render() {
    return <MaterialInputControl {...this.props} input={MuiInputText} />;
  }
}
export const testControlTester: RankedTester = rankWith(1, isControl);
const TestControl = withJsonFormsControlProps(TestControlInner);

describe('Material input control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => {
    wrapper.unmount();
  });

  it('render', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const control = wrapper.find('div').first();
    expect(control.children()).toHaveLength(4);

    const label = wrapper.find('label');
    expect(label.text()).toBe('Foo');

    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(1);

    const validation = wrapper.find('p').first();
    expect(validation.props().className).toContain('MuiFormHelperText-root');
    expect(validation.children()).toHaveLength(0);
  });

  it('should render without label', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      label: false,
    };
    const core = initCore(schema, uischema);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestControl schema={schema} uischema={control} />
      </JsonFormsStateProvider>
    );

    const div = wrapper.find('div').first();
    expect(div.children()).toHaveLength(4);

    const label = wrapper.find('label');
    expect(label.text()).toBe('');

    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(1);

    const validation = wrapper.find('p').first();
    expect(validation.props().className).toContain('MuiFormHelperText-root');
    expect(validation.children()).toHaveLength(0);
  });

  it('can be hidden', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestControl schema={schema} uischema={uischema} visible={false} />
      </JsonFormsStateProvider>
    );
    const inputs = wrapper.find('input');
    expect(inputs.length).toBe(0);
  });

  it('should be shown by default', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const control = wrapper.find('div').first();
    expect(control.props().hidden).toBeFalsy();
  });

  it('should display a single error', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    core.data = { ...core.data, foo: 2 };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    const validation = wrapper.find('p').first();
    expect(validation.text()).toBe('must be string');
  });

  it('should display multiple errors', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, foo: 3 };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    const validation = wrapper.find('p').first();
    expect(validation.text()).toBe('must be string');
  });

  it('should not show any errors', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const validation = wrapper.find('p').first();
    expect(validation.text()).toBe('');
  });

  it('should handle validation updates', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, foo: 3 };
    core.data = { ...core.data, foo: 'bar' };
    wrapper.setProps({ initState: { renderers: materialRenderers, core } });
    wrapper.update();
    const validation = wrapper.find('p').first();
    expect(validation.text()).toBe('');
  });

  it('should handle validation with nested schemas', () => {
    const jsonSchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        personalData: {
          type: 'object',
          properties: {
            middleName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
          },
          required: ['middleName', 'lastName'],
        },
      },
      required: ['name'],
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/personalData/properties/middleName',
    };
    const thirdControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/personalData/properties/lastName',
    };
    const layout: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [
        firstControlElement,
        secondControlElement,
        thirdControlElement,
      ],
    };
    const newData = {
      name: 'John Doe',
      personalData: {},
    };
    const core = initCore(jsonSchema, layout, newData);
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <MaterialHorizontalLayoutRenderer
          schema={jsonSchema}
          uischema={layout}
          direction='row'
          enabled
          visible
          path=''
        />
      </JsonFormsStateProvider>
    );
    const validation = wrapper.find('p');
    expect(validation).toHaveLength(6);
    expect(validation.at(0).text()).toBe('');
    expect(validation.at(2).text()).toBe('is a required property');
    expect(validation.at(4).text()).toBe('is a required property');
  });

  it('should display a marker for a required prop', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        dateCell: {
          type: 'string',
          format: 'date',
        },
      },
      required: ['dateCell'],
    };
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/dateCell',
    };

    const core = initCore(jsonSchema, control, {});
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestControl schema={jsonSchema} uischema={control} />
      </JsonFormsStateProvider>
    );
    const label = wrapper.find('label').first();
    expect(label.text()).toBe('Date Cell *');
  });

  it('should not display a marker for a non-required prop', () => {
    const jsonSchema: JsonSchema = {
      type: 'object',
      properties: {
        dateCell: {
          type: 'string',
          format: 'date',
        },
      },
    };
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/dateCell',
    };

    const core = initCore(jsonSchema, control, {});
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestControl schema={jsonSchema} uischema={control} />
      </JsonFormsStateProvider>
    );
    const label = wrapper.find('label').first();
    expect(label.text()).toBe('Date Cell');
  });

  it('should display a password cell if the password option is set', () => {
    const jsonSchema = {
      type: 'object',
      properties: {
        password: { type: 'string' },
      },
    };
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/password',
      options: { format: 'password' },
    };
    const core = initCore(jsonSchema, control, {});
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestControl schema={jsonSchema} uischema={control} />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input');
    expect(input.props().type).toBe('password');
  });

  it('should render own id and create/use input id', () => {
    const jsonSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
    };
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
    };
    const core = initCore(jsonSchema, control, {});
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core }}
      >
        <TestControl
          schema={jsonSchema}
          uischema={control}
          id={control.scope}
        />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().id).toBe('#/properties/name-input');

    const label = wrapper.find('label').first();
    expect(label.props().htmlFor).toBe('#/properties/name-input');

    const rootDiv = wrapper.find('div').first();
    expect(rootDiv.props().id).toBe('#/properties/name');
  });
});
