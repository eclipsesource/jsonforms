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
import * as React from 'react';
import { ControlElement, HorizontalLayout, JsonSchema } from '@jsonforms/core';
import { JsonFormsDispatch, JsonFormsStateProvider } from '@jsonforms/react';
import { vanillaRenderers } from '../../src';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import HorizontalLayoutRenderer, {
  horizontalLayoutTester,
} from '../../src/layouts/HorizontalLayout';
import InputControl, {
  inputControlTester,
} from '../../src/controls/InputControl';
import BooleanCell, { booleanCellTester } from '../../src/cells/BooleanCell';
import TextCell, { textCellTester } from '../../src/cells/TextCell';
import DateCell, { dateCellTester } from '../../src/cells/DateCell';
import { initCore } from '../util';
import { JsonFormsStyleContext } from '../../src/styles';

Enzyme.configure({ adapter: new Adapter() });

const fixture = {
  data: { foo: true },
  schema: {
    type: 'object',
    properties: {
      foo: {
        type: 'boolean',
      },
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/foo',
  },
};

test('tester', () => {
  expect(inputControlTester(undefined, undefined, undefined)).toBe(-1);
  expect(inputControlTester(null, undefined, undefined)).toBe(-1);
  expect(inputControlTester({ type: 'Foo' }, undefined, undefined)).toBe(-1);
  expect(inputControlTester({ type: 'Control' }, undefined, undefined)).toBe(
    -1
  );
  const control: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
  };
  expect(inputControlTester(control, undefined, undefined)).toBe(1);
});

describe('Input control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test('autofocus on first element', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        firstBooleanCell: { type: 'boolean' },
        secondBooleanCell: { type: 'boolean' },
      },
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/firstBooleanCell',
      options: {
        focus: true,
      },
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: 'properties/secondBooleanCell',
      options: {
        focus: true,
      },
    };
    const uischema: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [firstControlElement, secondControlElement],
    };
    const data = {
      firstBooleanCell: true,
      secondBooleanCell: false,
    };
    const core = initCore(schema, uischema, data);
    const renderes = [
      { tester: inputControlTester, renderer: InputControl },
      { tester: horizontalLayoutTester, renderer: HorizontalLayoutRenderer },
    ];
    const cells = [{ tester: booleanCellTester, cell: BooleanCell }];
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: vanillaRenderers, core, cells, renderes }}
      >
        <JsonFormsDispatch />
      </JsonFormsStateProvider>,
      // Attach to body to get focus to work with JSDom
      { attachTo: document.body }
    );
    const inputs = wrapper.find('input');
    expect(document.activeElement).not.toBe(inputs.at(0).getDOMNode());
    expect(document.activeElement).toBe(inputs.at(1).getDOMNode());
  });

  test('render', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const renderes = [{ tester: inputControlTester, renderer: InputControl }];
    const cells = [{ tester: booleanCellTester, cell: BooleanCell }];
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core, cells, renderes }}>
        <InputControl uischema={fixture.uischema} schema={fixture.schema} />
      </JsonFormsStateProvider>
    );

    const control = wrapper.find('.control').getDOMNode();
    expect(control).toBeDefined();
    expect(control.childNodes).toHaveLength(3);
    expect(wrapper.find('.root_properties_foo')).toBeDefined();

    const label = wrapper.find('label');
    expect(label.text()).toBe('Foo');

    const input = wrapper.find('input');
    expect(input).toBeDefined();
    expect(input).not.toBeNull();

    const validation = wrapper
      .find('.validation')
      .getDOMNode() as HTMLDivElement;
    expect(validation.tagName).toBe('DIV');
    expect(validation.children).toHaveLength(0);
  });

  test('render without label', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      label: false,
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    const renderes = [{ tester: inputControlTester, renderer: InputControl }];
    const cells = [{ tester: booleanCellTester, cell: BooleanCell }];
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: vanillaRenderers, core, cells, renderes }}
      >
        <JsonFormsDispatch />
      </JsonFormsStateProvider>
    );

    const control = wrapper.find('.control');
    expect(control).toBeDefined();
    expect(control.getDOMNode().childNodes).toHaveLength(3);
    expect(wrapper.find('.root_properties_foo')).toBeDefined();

    const label = wrapper.find('label');
    expect(label.text()).toBe('');

    const input = wrapper.find('input');
    expect(input).toBeDefined();
    expect(input).not.toBeNull();

    const validation = wrapper
      .find('.validation')
      .getDOMNode() as HTMLDivElement;
    expect(validation.tagName).toBe('DIV');
    expect(validation.children).toHaveLength(0);
  });

  test('hide', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const renderes = [{ tester: inputControlTester, renderer: InputControl }];
    const cells = [{ tester: booleanCellTester, cell: BooleanCell }];
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core, cells, renderes }}>
        <InputControl
          schema={fixture.schema}
          uischema={fixture.uischema}
          path={''}
          visible={false}
        />
      </JsonFormsStateProvider>
    );
    const control = wrapper.find('.control').getDOMNode() as HTMLElement;
    expect(control.hidden).toBe(true);
  });

  test('show by default', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const renderes = [{ tester: inputControlTester, renderer: InputControl }];
    const cells = [{ tester: booleanCellTester, cell: BooleanCell }];
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core, cells, renderes }}>
        <InputControl schema={fixture.schema} uischema={fixture.uischema} />
      </JsonFormsStateProvider>
    );
    const control = wrapper.find('.control').getDOMNode() as HTMLElement;
    expect(control.hidden);
  });

  test('single error', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const renderes = [{ tester: inputControlTester, renderer: InputControl }];
    const cells = [{ tester: booleanCellTester, cell: BooleanCell }];
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: vanillaRenderers, core, cells, renderes }}
      >
        <InputControl schema={fixture.schema} uischema={fixture.uischema} />
      </JsonFormsStateProvider>
    );
    const newCore = { ...core, data: { ...core.data, foo: 2 } };
    wrapper.setProps({
      initState: {
        renderers: vanillaRenderers,
        core: newCore,
        cells,
        renderes,
      },
    });
    const validation = wrapper.find('.validation');
    expect(validation.text()).toBe('must be boolean');
  });

  test('multiple errors', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const renderes = [{ tester: inputControlTester, renderer: InputControl }];
    const cells = [{ tester: booleanCellTester, cell: BooleanCell }];
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: vanillaRenderers, core, cells, renderes }}
      >
        <InputControl schema={fixture.schema} uischema={fixture.uischema} />
      </JsonFormsStateProvider>
    );
    const newCore = { ...core, data: { ...core.data, foo: 3 } };
    wrapper.setProps({
      initState: {
        renderers: vanillaRenderers,
        core: newCore,
        cells,
        renderes,
      },
    });
    const validation = wrapper.find('.validation');
    expect(validation.text()).toBe('must be boolean');
  });

  test('empty errors by default', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const renderes = [{ tester: inputControlTester, renderer: InputControl }];
    const cells = [{ tester: booleanCellTester, cell: BooleanCell }];
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: vanillaRenderers, core, cells, renderes }}
      >
        <JsonFormsDispatch />
      </JsonFormsStateProvider>
    );
    const validation = wrapper.find('.validation');
    expect(validation.text()).toBe('');
  });

  test('custom validation class', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const renderes = [{ tester: inputControlTester, renderer: InputControl }];
    const cells = [{ tester: booleanCellTester, cell: BooleanCell }];
    const styleContextValue = {
      styles: [
        {
          name: 'control.validation',
          classNames: ['custom-validation'],
        },
      ],
    };
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: vanillaRenderers, core, cells, renderes }}
      >
        <JsonFormsStyleContext.Provider value={styleContextValue}>
          <JsonFormsDispatch />
        </JsonFormsStyleContext.Provider>
      </JsonFormsStateProvider>
    );
    const validation = wrapper.find('.custom-validation');
    expect(validation.exists()).toBeTruthy();
  });

  test('reset validation message', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const renderes = [{ tester: inputControlTester, renderer: InputControl }];
    const cells = [{ tester: booleanCellTester, cell: BooleanCell }];
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: vanillaRenderers, core, cells, renderes }}
      >
        <JsonFormsDispatch />
      </JsonFormsStateProvider>
    );
    const validation = wrapper.find('.validation');
    core.data = { ...core.data, foo: 3 };
    core.data = { ...core.data, foo: true };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    expect(validation.text()).toBe('');
  });

  test('validation of nested schema', () => {
    const schema = {
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
    const uischema: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [
        firstControlElement,
        secondControlElement,
        thirdControlElement,
      ],
    };
    const data = {
      name: 'John Doe',
      personalData: {},
    };
    const core = initCore(schema, uischema, data);
    const renderes = [{ tester: inputControlTester, renderer: InputControl }];
    const cells = [{ tester: textCellTester, cell: TextCell }];
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: vanillaRenderers, core, cells, renderes }}
      >
        <HorizontalLayoutRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const validation = wrapper.find('.validation');
    expect(validation.at(0).text()).toBe('');
    expect(validation.at(1).text()).toBe('is a required property');
    expect(validation.at(2).text()).toBe('is a required property');
  });
  test('required cell is marked', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        dateCell: {
          type: 'string',
          format: 'date',
        },
      },
      required: ['dateCell'],
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/dateCell',
    };
    const core = initCore(schema, uischema, {});
    const renderes = [{ tester: inputControlTester, renderer: InputControl }];
    const cells = [{ tester: dateCellTester, cell: DateCell }];
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core, cells, renderes }}>
        <InputControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const label = wrapper.find('label');
    expect(label.text()).toBe('Date Cell*');
  });

  test('not required', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        dateCell: {
          type: 'string',
          format: 'date',
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/dateCell',
    };
    const core = initCore(schema, uischema, {});
    const renderes = [{ tester: inputControlTester, renderer: InputControl }];
    const cells = [{ tester: dateCellTester, cell: DateCell }];
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core, cells, renderes }}>
        <InputControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const label = wrapper.find('label');
    expect(label.text()).toBe('Date Cell');
  });

  test('show description on focus', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Enter your first name',
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
    };
    const data = { isFocused: false };
    const core = initCore(schema, uischema, data);
    const renderes = [{ tester: inputControlTester, renderer: InputControl }];
    const cells = [{ tester: textCellTester, cell: DateCell }];
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core, cells, renderes }}>
        <InputControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const control = wrapper.find('.control');
    control.simulate('focus');
    const description = wrapper.find('.input-description');
    expect(description.text()).toBe('Enter your first name');
  });

  test('hide description when input cell is not focused', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Enter your first name',
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
    };
    const data = { isFocused: false };
    const core = initCore(schema, uischema, data);
    const renderes = [{ tester: inputControlTester, renderer: InputControl }];
    const cells = [{ tester: textCellTester, cell: DateCell }];
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core, cells, renderes }}>
        <InputControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const description = wrapper.find('.input-description');
    expect(description.text()).toBe('');
  });

  test('hide description on blur', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Enter your first name',
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
    };
    const data = { isFocused: false };
    const core = initCore(schema, uischema, data);
    const renderes = [{ tester: inputControlTester, renderer: InputControl }];
    const cells = [{ tester: textCellTester, cell: DateCell }];
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: vanillaRenderers, core, cells, renderes }}
      >
        <JsonFormsDispatch />
      </JsonFormsStateProvider>
    );
    const control = wrapper.find('.control');
    control.simulate('focus');
    const description = wrapper.find('.input-description');
    expect(description.text()).toBe('Enter your first name');
    control.simulate('blur');
    const hiddenDescription = wrapper.find('.input-description');
    expect(hiddenDescription.text()).toBe('');
  });

  test('description undefined', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
    };
    const data = { isFocused: false };
    const core = initCore(schema, uischema, data);
    const renderes = [{ tester: inputControlTester, renderer: InputControl }];
    const cells = [{ tester: textCellTester, cell: DateCell }];
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: vanillaRenderers, core, cells, renderes }}
      >
        <JsonFormsDispatch />
      </JsonFormsStateProvider>
    );
    const description = wrapper.find('.input-description').getDOMNode();
    expect(description.textContent).toBe('');
  });

  test('undefined input control', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        expectedValue: {
          type: ['string', 'integer', 'number', 'boolean'],
        },
      },
    };
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/expectedValue',
    };
    const core = initCore(schema, uischema, {});
    const renderes = [{ tester: inputControlTester, renderer: InputControl }];
    const cells = [{ tester: textCellTester, cell: DateCell }];
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core, cells, renderes }}>
        <InputControl schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const control = wrapper.find('.control');
    expect(control).toHaveLength(1);
  });
});
