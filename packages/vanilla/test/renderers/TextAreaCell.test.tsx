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
  getData,
  HorizontalLayout,
  JsonSchema,
  update
} from '@jsonforms/core';
import { JsonFormsReduxContext } from '@jsonforms/react/lib/redux';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import TextAreaCell, { textAreaCellTester, } from '../../src/cells/TextAreaCell';
import HorizontalLayoutRenderer from '../../src/layouts/HorizontalLayout';
import { initJsonFormsVanillaStore } from '../vanillaStore';

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
    const store = initJsonFormsVanillaStore({
      data,
      schema,
      uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <HorizontalLayoutRenderer schema={schema} uischema={uischema} />
      </Provider>
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
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <TextAreaCell schema={fixture.schema} uischema={uischema} path='name' />
      </Provider>
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
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <TextAreaCell schema={fixture.schema} uischema={uischema} path='name' />
      </Provider>
    );
    const input = wrapper.find('textarea').getDOMNode() as HTMLInputElement;
    expect(input.autofocus).toBe(false);
  });

  test('autofocus inactive by default', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <TextAreaCell schema={fixture.schema} uischema={uischema} path='name' />
      </Provider>
    );
    const input = wrapper.find('textarea').getDOMNode() as HTMLInputElement;
    expect(input.autofocus).toBe(false);
  });

  test('render', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const textarea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    expect(textarea.value).toBe('Foo');
  });

  test('has classes set', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );

    const input = wrapper.find('textarea');
    expect(input.hasClass('input')).toBe(true);
    expect(input.hasClass('validate')).toBe(true);
    expect(input.hasClass('valid')).toBe(true);
  });

  test('update via input event', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );

    const textarea = wrapper.find('textarea');
    textarea.simulate('change', { target: { value: 'Bar' } });
    expect(getData(store.getState()).name).toBe('Bar');
  });

  test('update via action', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('name', () => 'Bar'));
    const textarea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    expect(textarea.value).toBe('Bar');
  });

  test('update with undefined value', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const textArea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    store.dispatch(update('name', () => undefined));
    expect(textArea.value).toBe('');
  });

  test('update with null value', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('name', () => null));
    const textArea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    expect(textArea.value).toBe('');
  });

  test('update with wrong ref', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('firstname', () => 'Bar'));
    const textArea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    expect(textArea.value).toBe('Foo');
  });

  test('update with null ref', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update(null, () => 'Bar'));
    const textArea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    expect(textArea.value).toBe('Foo');
  });

  test('update with undefined ref', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const textArea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    store.dispatch(update(undefined, () => 'Bar'));
    expect(textArea.value).toBe('Foo');
  });

  test('disable', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} enabled={false} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const textArea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    expect(textArea.disabled).toBe(true);
  });

  test('enabled by default', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextAreaCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const textArea = wrapper.find('textarea').getDOMNode() as HTMLTextAreaElement;
    expect(textArea.disabled).toBe(false);
  });
});

describe('Text area cell tester', () => {
  test('tester', () => {
    expect(textAreaCellTester(undefined, undefined)).toBe(-1);
    expect(textAreaCellTester(null, undefined)).toBe(-1);
    expect(textAreaCellTester({ type: 'Foo' }, undefined)).toBe(-1);
    expect(textAreaCellTester({ type: 'Control' }, undefined)).toBe(-1);
    expect(textAreaCellTester({ type: 'Control', options: { multi: true } }, undefined)).toBe(2);
  });
});
