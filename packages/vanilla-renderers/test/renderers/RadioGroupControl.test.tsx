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
import { isEnumControl, isOneOfEnumControl, rankWith } from '@jsonforms/core';
import { JsonFormsStateProvider } from '@jsonforms/react';
import * as React from 'react';
import * as _ from 'lodash';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import {
  vanillaStyles,
  RadioGroupControl,
  OneOfRadioGroupControl,
  JsonFormsStyleContext,
} from '../../src';
import { initCore } from '../util';

Enzyme.configure({ adapter: new Adapter() });

const fixture = {
  data: { foo: 'D' },
  schema: {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        enum: ['A', 'B', 'C', 'D'],
      },
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/foo',
  },
};

const oneOfFixture = {
  data: { foo: 'b' },
  schema: {
    type: 'object',
    properties: {
      foo: {
        oneOf: [
          { const: 'a', title: 'A' },
          { const: 'b', title: 'B' },
          { const: 'c', title: 'C' },
        ],
      },
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/foo',
  },
};

describe('Radio group control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test('render enum', () => {
    const renderers = [
      { tester: rankWith(10, isEnumControl), renderer: RadioGroupControl },
    ];
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core, renderers }}>
        <RadioGroupControl
          schema={fixture.schema}
          uischema={fixture.uischema}
        />
      </JsonFormsStateProvider>
    );

    const radioButtons = wrapper.find('input[type="radio"]');
    expect(radioButtons).toHaveLength(4);

    // make sure one option is selected and expect "D"
    const currentlyChecked = radioButtons.filter('input[checked=true]');
    expect(currentlyChecked).toHaveLength(1);
    expect((currentlyChecked.getDOMNode() as HTMLInputElement).value).toBe('D');
  });

  test('render enum with CSS classes', () => {
    const renderers = [
      { tester: rankWith(10, isEnumControl), renderer: RadioGroupControl },
    ];
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core, renderers }}>
        <RadioGroupControl
          schema={fixture.schema}
          uischema={fixture.uischema}
        />
      </JsonFormsStateProvider>
    );

    const radioControl = wrapper.find('.radio');
    expect(radioControl).toHaveLength(1);
    expect(radioControl.prop('style')).toEqual({
      display: 'flex',
      flexDirection: 'row',
    });

    const radioOptions = wrapper.find('.radio-option');
    expect(radioOptions).toHaveLength(4);

    const radioInput = wrapper.find('.radio-input');
    expect(radioInput).toHaveLength(4);

    const radioLabel = wrapper.find('.radio-label');
    expect(radioLabel).toHaveLength(4);
  });

  test('do not render inline styles in radio if radio class is overwritten', () => {
    const renderers = [
      { tester: rankWith(10, isEnumControl), renderer: RadioGroupControl },
    ];
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const customStyles = vanillaStyles.map((style) => {
      if (style.name !== 'control.radio') {
        return style;
      }

      return {
        name: style.name,
        classNames: ['radio-custom-class'],
      };
    });
    wrapper = mount(
      <JsonFormsStyleContext.Provider value={{ styles: customStyles }}>
        <JsonFormsStateProvider initState={{ core, renderers }}>
          <RadioGroupControl
            schema={fixture.schema}
            uischema={fixture.uischema}
          />
        </JsonFormsStateProvider>
      </JsonFormsStyleContext.Provider>
    );

    const radioControl = wrapper.find('.radio-custom-class');
    expect(radioControl.prop('style')).toEqual({});
  });

  test('render oneOf', () => {
    const renderers = [
      {
        tester: rankWith(10, isOneOfEnumControl),
        renderer: OneOfRadioGroupControl,
      },
    ];
    const core = initCore(
      oneOfFixture.schema,
      oneOfFixture.uischema,
      oneOfFixture.data
    );
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core, renderers }}>
        <OneOfRadioGroupControl
          schema={oneOfFixture.schema}
          uischema={oneOfFixture.uischema}
        />
      </JsonFormsStateProvider>
    );

    const radioButtons = wrapper.find('input[type="radio"]');
    expect(radioButtons).toHaveLength(3);
    const currentlyChecked = radioButtons.filter('input[checked=true]');
    expect(currentlyChecked).toHaveLength(1);
    expect((currentlyChecked.getDOMNode() as HTMLInputElement).value).toBe('b');
  });

  test('Radio group should have only one selected option', () => {
    const renderers = [
      { tester: rankWith(10, isEnumControl), renderer: RadioGroupControl },
    ];
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core, renderers }}>
        <RadioGroupControl
          schema={fixture.schema}
          uischema={fixture.uischema}
        />
      </JsonFormsStateProvider>
    );

    // change and verify selection
    core.data = { ...core.data, foo: 'A' };
    core.data = { ...core.data, foo: 'B' };
    wrapper.setProps({ initState: { core } });
    wrapper.update();
    const currentlyChecked = wrapper.find('input[checked=true]');
    expect(currentlyChecked).toHaveLength(1);
    expect((currentlyChecked.getDOMNode() as HTMLInputElement).value).toBe('B');
  });
});
