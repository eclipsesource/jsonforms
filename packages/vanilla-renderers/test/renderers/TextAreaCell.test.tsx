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
import {
  ControlElement,
  HorizontalLayout,
  JsonSchema,
} from '@jsonforms/core';
import { JsonFormsStateProvider } from '@jsonforms/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import TextAreaCell, { textAreaCellTester, } from '../../src/cells/TextAreaCell';
import HorizontalLayoutRenderer from '../../src/layouts/HorizontalLayout';
import { initCore, TestEmitter } from '../util';

Enzyme.configure({ adapter: new Adapter() });

const controlElement: ControlElement = {
  type: 'Control',
  scope: '#/properties/name'
};

const fixture = {
  data: { 'name': 'Foo' },
  schema: {
    type: 'string',
    minLength: 3
  },
  uischema: controlElement,
  styles: [
    {
      name: 'control',
      classNames: ['control']
    },
    {
      name: 'control.validation',
      classNames: ['validation']
    }
  ]
};

describe('Text area cell', () => {

  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test.skip('autofocus on first element', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        firstName: { type: 'string', minLength: 3 },
        lastName: { type: 'string', minLength: 3 }
      }
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/firstName',
      options: {
        focus: true
      }
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/lastName',
      options: {
        focus: true
      }
    };
    const uischema: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [
        firstControlElement,
        secondControlElement
      ]
    };
    const data = {
      'firstName': 'Foo',
      'lastName': 'Boo'
    };
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <HorizontalLayoutRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );
    const inputs = wrapper.find('input');
    expect(document.activeElement).not.toBe(inputs.at(0).getDOMNode());
    expect(document.activeElement).toBe(inputs.at(1).getDOMNode());
  });

  test('autofocus active', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        focus: true
      }
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextAreaCell schema={fixture.schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('textarea').getDOMNode();
    expect(document.activeElement).toBe(input);
  });

  test('autofocus inactive', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        focus: false
      }
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextAreaCell schema={fixture.schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('textarea').getDOMNode() as HTMLInputElement;
    expect(input.autofocus).toBe(false);
  });

  test('autofocus inactive by default', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextAreaCell schema={fixture.schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('textarea').getDOMNode() as HTMLInputElement;
    expect(input.autofocus).toBe(false);
  });

  test('render', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const textarea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    expect(textarea.value).toBe('Foo');
  });

  test('has classes set', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('textarea');
    expect(input.hasClass('input')).toBe(true);
    expect(input.hasClass('validate')).toBe(true);
    expect(input.hasClass('valid')).toBe(true);
  });

  test('update via input event', () => {
    const onChangeData: any = {
      data: undefined
    };
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );

    const textarea = wrapper.find('textarea');
    textarea.simulate('change', { target: { value: 'Bar' } });
    expect(onChangeData.data.name).toBe('Bar');
  });

  test('update via action', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, name: 'Bar' };
    wrapper.setProps({ initState: { core }} );
    wrapper.update();
    const textarea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    expect(textarea.value).toBe('Bar');
  });

  test('update with undefined value', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const textArea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    core.data = { ...core.data, name: undefined };
    wrapper.setProps({ initState: { core }} );
    wrapper.update();
    expect(textArea.value).toBe('');
  });

  test('update with null value', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, name: null };
    wrapper.setProps({ initState: { core }} );
    wrapper.update();
    const textArea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    expect(textArea.value).toBe('');
  });

  test('update with wrong ref', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, firstname: 'Bar' };
    wrapper.setProps({ initState: { core }} );
    wrapper.update();
    const textArea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    expect(textArea.value).toBe('Foo');
  });

  test('update with null ref', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, null: 'Bar' };
    wrapper.setProps({ initState: { core }} );
    wrapper.update();
    const textArea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    expect(textArea.value).toBe('Foo');
  });

  test('update with undefined ref', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const textArea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    core.data = { ...core.data, undefined: 'Bar' };
    wrapper.setProps({ initState: { core }} );
    wrapper.update();
    expect(textArea.value).toBe('Foo');
  });

  test('disable', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} enabled={false} />
      </JsonFormsStateProvider>
    );
    const textArea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    expect(textArea.disabled).toBe(true);
  });

  test('enabled by default', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const textArea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    expect(textArea.disabled).toBe(false);
  });

  test('accept placeholder attribute', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        placeholder: 'Placeholder for name field'
      }
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextAreaCell schema={fixture.schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const textArea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    expect(textArea.placeholder).toBe('Placeholder for name field');
  });
});

describe('Text area cell tester', () => {
  test('tester', () => {
    expect(textAreaCellTester(undefined, undefined, undefined)).toBe(-1);
    expect(textAreaCellTester(null, undefined, undefined)).toBe(-1);
    expect(textAreaCellTester({ type: 'Foo' }, undefined, undefined)).toBe(-1);
    expect(textAreaCellTester({ type: 'Control' }, undefined, undefined)).toBe(-1);
    expect(textAreaCellTester({ type: 'Control', options: { multi: true } }, undefined, undefined)).toBe(2);
  });
});
