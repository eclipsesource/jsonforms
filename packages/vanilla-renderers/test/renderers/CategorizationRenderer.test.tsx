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
  Categorization,
  Category,
  ControlElement,
  JsonSchema,
  Layout,
} from '@jsonforms/core';
import { JsonFormsStateProvider } from '@jsonforms/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import CategorizationRenderer, {
  categorizationTester,
} from '../../src/complex/categorization';
import { initCore } from '../util';
import { vanillaRenderers } from '../../src';

Enzyme.configure({ adapter: new Adapter() });

const category: Category = {
  type: 'Category',
  label: 'B',
  elements: [],
};

const fixture = {
  data: {},
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
    },
  },
  uischema: {
    type: 'Categorization',
    label: 'A',
    elements: [category],
  },
};

describe('Categorization tester', () => {
  test('tester', () => {
    expect(categorizationTester(undefined, undefined, undefined)).toBe(-1);
    expect(categorizationTester(null, undefined, undefined)).toBe(-1);
    expect(categorizationTester({ type: 'Foo' }, undefined, undefined)).toBe(
      -1
    );
    expect(
      categorizationTester({ type: 'Categorization' }, undefined, undefined)
    ).toBe(-1);
  });

  test('tester with null elements and no schema', () => {
    const uischema: Layout = {
      type: 'Categorization',
      elements: null,
    };
    expect(categorizationTester(uischema, undefined, undefined)).toBe(-1);
  });

  test('tester with empty elements and no schema', () => {
    const uischema: Layout = {
      type: 'Categorization',
      elements: [],
    };
    expect(categorizationTester(uischema, undefined, undefined)).toBe(-1);
  });

  test('apply tester with single unknown element and no schema', () => {
    const uischema: Layout = {
      type: 'Categorization',
      elements: [
        {
          type: 'Foo',
        },
      ],
    };
    expect(categorizationTester(uischema, undefined, undefined)).toBe(-1);
  });

  test('tester with single category and no schema', () => {
    const categorization = {
      type: 'Categorization',
      elements: [
        {
          type: 'Category',
        },
      ],
    };
    expect(categorizationTester(categorization, undefined, undefined)).toBe(1);
  });

  test('tester with nested categorization and single category and no schema', () => {
    const nestedCategorization: Layout = {
      type: 'Categorization',
      elements: [
        {
          type: 'Category',
        },
      ],
    };
    const categorization: Layout = {
      type: 'Categorization',
      elements: [nestedCategorization],
    };
    expect(categorizationTester(categorization, undefined, undefined)).toBe(1);
  });

  test('tester with nested categorizations, but no category and no schema', () => {
    const categorization: any = {
      type: 'Categorization',
      elements: [
        {
          type: 'Categorization',
        },
      ],
    };
    expect(categorizationTester(categorization, undefined, undefined)).toBe(-1);
  });

  test('tester with nested categorizations, null elements and no schema', () => {
    const categorization: any = {
      type: 'Categorization',
      elements: [
        {
          type: 'Categorization',
          label: 'Test',
          elements: null,
        },
      ],
    };
    expect(categorizationTester(categorization, undefined, undefined)).toBe(-1);
  });

  test('tester with nested categorizations, empty elements and no schema', () => {
    const categorization: any = {
      type: 'Categorization',
      elements: [
        {
          type: 'Categorization',
          elements: [],
        },
      ],
    };
    expect(categorizationTester(categorization, undefined, undefined)).toBe(-1);
  });
});

describe('Categorization renderer', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test('render', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
      },
    };
    const nameControl = {
      type: 'Control',
      scope: '#/properties/name',
    };
    const innerCat: Categorization = {
      type: 'Categorization',
      label: 'Bar',
      elements: [
        {
          type: 'Category',
          label: 'A',
          elements: [nameControl],
        },
      ],
    };
    const uischema: Categorization = {
      type: 'Categorization',
      label: 'Root',
      elements: [
        innerCat,
        {
          type: 'Category',
          label: 'B',
          elements: [nameControl],
        },
      ],
    };
    const core = initCore(schema, uischema, fixture.data);

    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <CategorizationRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const div = wrapper.find('.categorization').getDOMNode();
    const master = wrapper.find('.categorization-master').getDOMNode();
    const ul = master.children[0];
    const liA = ul.children[0];
    const spanA = liA.children[0];
    const innerUlA = liA.children[1];
    const innerLiA = innerUlA.children[0];
    const innerSpanA = innerLiA.children[0];
    const liB = ul.children[1];
    const spanB = liB.children[0];
    // detail
    const detail = div.children[1] as HTMLDivElement;

    expect(div.className).toBe('categorization');
    expect(div.childNodes).toHaveLength(2);
    expect(master.className).toBe('categorization-master');
    expect(master.children).toHaveLength(1);
    expect(ul.children).toHaveLength(2);
    expect(liA.className).toBe('category-group');
    expect(liA.children).toHaveLength(2);
    expect(spanA.textContent).toBe('Bar');
    expect(innerUlA.className).toBe('category-subcategories');
    expect(innerUlA.children).toHaveLength(1);
    expect(innerLiA.children).toHaveLength(1);
    expect(innerSpanA.textContent).toBe('A');
    expect(liB.className).not.toBe('category-group');
    expect(liB.children).toHaveLength(1);
    expect(spanB.textContent).toBe('B');
    expect(detail.className).toBe('categorization-detail');
    expect(detail.children).toHaveLength(1);
    expect(detail.children.item(0).tagName).toBe('DIV');
    expect(detail.children.item(0).children).toHaveLength(1);
  });

  test('render on click', () => {
    const data = { name: 'Foo' };
    const nameControl: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
    };
    const innerCategorization: Categorization = {
      type: 'Categorization',
      label: 'Bar',
      elements: [
        {
          type: 'Category',
          label: 'A',
          elements: [nameControl],
        },
      ],
    };
    const uischema: Categorization = {
      type: 'Categorization',
      label: 'Root',
      elements: [
        innerCategorization,
        {
          type: 'Category',
          label: 'B',
          elements: [nameControl, nameControl],
        },
        {
          type: 'Category',
          label: 'C',
          elements: undefined,
        },
        {
          type: 'Category',
          label: 'D',
          elements: null,
        },
      ],
    };
    const core = initCore(fixture.schema, uischema, data);

    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <CategorizationRenderer schema={fixture.schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const div: HTMLDivElement = wrapper.find('.categorization').getDOMNode();
    const master = div.children[0] as HTMLDivElement;
    const ul = master.children[0];
    const listItems = wrapper.find('li');
    const liB = listItems.at(2);
    const liC = listItems.at(3);
    const liD = listItems.at(4);
    const detail = div.children[1] as HTMLDivElement;

    expect(div.className).toBe('categorization');
    expect(div.childNodes).toHaveLength(2);
    expect(master.children).toHaveLength(1);
    expect(ul.children).toHaveLength(4);
    expect(detail.children).toHaveLength(1);
    expect(detail.children.item(0).tagName).toBe('DIV');
    expect(detail.children.item(0).children).toHaveLength(1);

    liB.simulate('click');
    expect(detail.children).toHaveLength(1);
    expect(detail.children.item(0).tagName).toBe('DIV');
    expect(detail.children.item(0).children).toHaveLength(2);

    liC.simulate('click');
    expect(detail.children).toHaveLength(1);
    expect(detail.children.item(0).tagName).toBe('DIV');
    expect(detail.children.item(0).children).toHaveLength(0);

    liD.simulate('click');
    expect(detail.children).toHaveLength(1);
    expect(detail.children.item(0).tagName).toBe('DIV');
    expect(detail.children.item(0).children).toHaveLength(0);
  });

  test('hide', () => {
    const uischema: Categorization = {
      type: 'Categorization',
      label: '',
      elements: [
        {
          type: 'Category',
          label: 'B',
          elements: [],
        },
      ],
    };
    const core = initCore(fixture.schema, uischema, fixture.data);

    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <CategorizationRenderer
          schema={fixture.schema}
          uischema={uischema}
          visible={false}
        />
      </JsonFormsStateProvider>
    );

    const div = wrapper.find('.categorization').getDOMNode() as HTMLDivElement;
    expect(div.hidden).toBe(true);
  });

  test('showed by default', () => {
    const uischema: Categorization = {
      type: 'Categorization',
      label: '',
      elements: [
        {
          type: 'Category',
          label: 'B',
          elements: [],
        },
      ],
    };
    const core = initCore(fixture.schema, uischema, fixture.data);

    wrapper = mount(
      <JsonFormsStateProvider initState={{ renderers: vanillaRenderers, core }}>
        <CategorizationRenderer schema={fixture.schema} uischema={uischema} />
      </JsonFormsStateProvider>
    );

    const div: HTMLDivElement = wrapper.find('.categorization').getDOMNode();
    expect(div.hidden).toBe(false);
  });
});
