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
import { JsonFormsStateProvider } from '@jsonforms/react';
import ArrayControl from '../../src/complex/array/ArrayControlRenderer';
import { vanillaRenderers } from '../../src/index';
import { initCore } from '../util';
import IntegerCell, { integerCellTester } from '../../src/cells/IntegerCell';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

const fixture = {
  schema: {
    type: 'object',
    properties: {
      test: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            x: { type: 'integer' },
            y: { type: 'integer' },
          },
        },
      },
    },
  },
  uischema: {
    type: 'Control',
    scope: '#/properties/test',
  },
  data: {
    test: [{ x: 1, y: 3 }],
  },
};

describe('Array control renderer', () => {
  test('render two children', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const cells = [{ tester: integerCellTester, cell: IntegerCell }];
    const wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: vanillaRenderers, cells, core }}
      >
        <ArrayControl schema={fixture.schema} uischema={fixture.uischema} />
      </JsonFormsStateProvider>
    );

    const controls = wrapper.find('.control');

    expect(controls).toHaveLength(3);
  });

  test('renders buttons', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const cells = [{ tester: integerCellTester, cell: IntegerCell }];
    const wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          renderers: vanillaRenderers,
          cells,
          core,
          uischemas: [{ tester: () => 1, uischema: { type: 'Control' } }],
        }}
      >
        <ArrayControl schema={fixture.schema} uischema={fixture.uischema} />
      </JsonFormsStateProvider>
    );

    const buttons = wrapper.find('button');
    expect(buttons).toHaveLength(4);
    buttons.forEach((button) => {
      expect(button.prop('disabled')).toBe(false);
    });
  });

  test('disabled control renders disabled buttons', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    const cells = [{ tester: integerCellTester, cell: IntegerCell }];
    const wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          renderers: vanillaRenderers,
          cells,
          core,
          uischemas: [{ tester: () => 1, uischema: { type: 'Control' } }],
        }}
      >
        <ArrayControl
          schema={fixture.schema}
          uischema={fixture.uischema}
          enabled={false}
        />
      </JsonFormsStateProvider>
    );

    const buttons = wrapper.find('button');
    expect(buttons).toHaveLength(4);
    buttons.forEach((button) => {
      expect(button.prop('disabled')).toBe(true);
    });
  });
});
