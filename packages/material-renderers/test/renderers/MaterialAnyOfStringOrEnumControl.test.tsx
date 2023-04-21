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
import React from 'react';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { ControlElement, JsonSchema } from '@jsonforms/core';
import {
  MaterialAnyOfStringOrEnumControl,
  materialAnyOfStringOrEnumControlTester,
  materialRenderers,
} from '../../src';
import { JsonForms } from '@jsonforms/react';

Enzyme.configure({ adapter: new Adapter() });

const schema: JsonSchema = {
  anyOf: [{ type: 'string' }, { enum: ['foo', 'bar'] }],
};

const uischema: ControlElement = {
  type: 'Control',
  scope: '#',
};

describe('Material simple any of control tester', () => {
  it('should only be applicable for simple any of cases', () => {
    expect(
      materialAnyOfStringOrEnumControlTester({ type: 'Foo' }, schema, undefined)
    ).toBe(-1);
    expect(
      materialAnyOfStringOrEnumControlTester(uischema, schema, undefined)
    ).toBe(5);

    const nestedSchema: JsonSchema = {
      properties: {
        foo: { anyOf: [{ type: 'string' }, { enum: ['foo', 'bar'] }] },
      },
    };
    const nestedUischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    expect(
      materialAnyOfStringOrEnumControlTester(
        nestedUischema,
        nestedSchema,
        undefined
      )
    ).toBe(5);
    const schemaNoEnum: JsonSchema = {
      anyOf: [{ type: 'string' }],
    };
    const schemaConflictTypes: JsonSchema = {
      anyOf: [{ type: 'string' }, { type: 'integer', enum: [1, 2] }],
    };
    const schemaAdditionalProps: JsonSchema = {
      anyOf: [{ type: 'string' }, { enum: ['foo', 'bar'] }, { maxLength: 5 }],
    };
    const schemaNoString: JsonSchema = {
      anyOf: [{ type: 'integer' }, { enum: [1, 2] }],
    };
    expect(
      materialAnyOfStringOrEnumControlTester(uischema, schemaNoEnum, undefined)
    ).toBe(-1);
    expect(
      materialAnyOfStringOrEnumControlTester(
        uischema,
        schemaConflictTypes,
        undefined
      )
    ).toBe(-1);
    expect(
      materialAnyOfStringOrEnumControlTester(
        uischema,
        schemaAdditionalProps,
        undefined
      )
    ).toBe(5);
    expect(
      materialAnyOfStringOrEnumControlTester(
        uischema,
        schemaNoString,
        undefined
      )
    ).toBe(-1);
  });
});

describe('Material any of string or enum control', () => {
  let wrapper: ReactWrapper;

  afterEach(() => {
    wrapper.unmount();
  });

  it('render', () => {
    wrapper = mount(
      <JsonForms
        data={'foo'}
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );
    expect(wrapper.find(MaterialAnyOfStringOrEnumControl).length).toBeTruthy();
    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(1);

    const datalist = wrapper.find('datalist');
    expect(datalist).toHaveLength(1);
    expect(datalist.children()).toHaveLength(2);

    const validation = wrapper.find('p').first();
    expect(validation.props().className).toContain('MuiFormHelperText-root');
    expect(validation.children()).toHaveLength(0);
  });
});
