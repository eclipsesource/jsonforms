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
import '@jsonforms/test';
import * as React from 'react';
import anyTest, { TestInterface } from 'ava';
import { Provider } from 'react-redux';
import {
  Categorization,
  ControlElement,
  JsonSchema,
  Layout
} from '@jsonforms/core';
import { JsonFormsReduxContext } from '@jsonforms/react';
import * as TestUtils from 'react-dom/test-utils';
import CategorizationRenderer, { categorizationTester } from '../../src/complex/categorization';
import { initJsonFormsVanillaStore } from '../vanillaStore';
import { StyleDef } from '../../src';

interface CategorizationRendererTestContext {
  data: any;
  schema: JsonSchema;
  uischema: Categorization;
  styles: StyleDef[];
}

const test = anyTest as TestInterface<CategorizationRendererTestContext>;

test.beforeEach(t => {
  t.context.data = {};
  t.context.schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    }
  };
  t.context.uischema = {
    type: 'Categorization',
    label: 'A',
    elements: [{
      type: 'Category',
      label: 'B',
      elements: []
    }]
  };
  t.context.styles = [
    {
      name: 'categorization',
      classNames: ['categorization']
    },
    {
      name: 'categorization.master',
      classNames: ['categorization-master']
    },
    {
      name: 'category.group',
      classNames: ['category-group']
    },
    {
      name: 'category.subcategories',
      classNames: ['category-subcategories']
    },
    {
      name: 'categorization.detail',
      classNames: ['categorization-detail']
    }
  ];
});

test('tester', t => {
  t.is(categorizationTester(undefined, undefined), -1);
  t.is(categorizationTester(null, undefined), -1);
  t.is(categorizationTester({ type: 'Foo' }, undefined), -1);
  t.is(categorizationTester({ type: 'Categorization' }, undefined), -1);
});

test('tester with null elements and no schema', t => {
  const uischema: Layout = {
    type: 'Categorization',
    elements: null
  };
  t.is(
    categorizationTester(
      uischema,
      undefined
    ),
    -1
  );
});

test('tester with empty elements and no schema', t => {
  const uischema: Layout = {
    type: 'Categorization',
    elements: []
  };
  t.is(
    categorizationTester(
      uischema,
      undefined
    ),
    -1
  );
});

test('apply tester with single unknown element and no schema', t => {
  const uischema: Layout = {
    type: 'Categorization',
    elements: [
      {
        type: 'Foo'
      },
    ]
  };
  t.is(
    categorizationTester(
      uischema,
      undefined
    ),
    -1
  );
});

test('tester with single category and no schema', t => {
  const categorization = {
    type: 'Categorization',
    elements: [
      {
        type: 'Category'
      }
    ]
  };
  t.is(
    categorizationTester(
      categorization,
      undefined
    ),
    1
  );
});

test('tester with nested categorization and single category and no schema', t => {
  const nestedCategorization: Layout = {
    type: 'Categorization',
    elements: [
      {
        type: 'Category'
      }
    ]
  };
  const categorization: Layout = {
    type: 'Categorization',
    elements: [nestedCategorization]
  };
  t.is(
    categorizationTester(
      categorization,
      undefined),
    1
  );
});

test('tester with nested categorizations, but no category and no schema', t => {
  const categorization: any = {
    type: 'Categorization',
    elements: [
      {
        type: 'Categorization'
      }
    ]
  };
  t.is(
    categorizationTester(
      categorization,
      undefined
    ),
    -1
  );
});

test('tester with nested categorizations, null elements and no schema', t => {
  const categorization: any = {
    type: 'Categorization',
    elements: [
      {
        type: 'Categorization',
        label: 'Test',
        elements: null
      }
    ]
  };
  t.is(
    categorizationTester(
      categorization,
      undefined
    ),
    -1
  );
});

test('tester with nested categorizations, empty elements and no schema', t => {
  const categorization: any = {
    type: 'Categorization',
    elements: [
      {
        type: 'Categorization',
        elements: []
      }
    ]
  };
  t.is(
    categorizationTester(
      categorization,
      undefined
    ),
    -1
  );
});

test('render', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    }
  };
  const nameControl = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const innerCat: Categorization = {
    type: 'Categorization',
    label: 'Bar',
    elements: [
      {
        type: 'Category',
        label: 'A',
        elements: [nameControl]
      }
    ]
  };
  const uischema: Categorization = {
    type: 'Categorization',
    label: 'Root',
    elements: [
      innerCat,
      {
        type: 'Category',
        label: 'B',
        elements: [nameControl]
      }
    ]
  };

  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema,
    uischema,
    styles: t.context.styles
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <CategorizationRenderer
          schema={schema}
          uischema={uischema}
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;

  // master tree
  const div = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'categorization'
  ) as HTMLDivElement;
  const master = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'categorization-master'
  );
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

  t.is(div.className, 'categorization');
  t.is(div.childNodes.length, 2);
  t.is(master.className, 'categorization-master');
  t.is(master.children.length, 1);
  t.is(ul.children.length, 2);
  t.is(liA.className, 'category-group');
  t.is(liA.children.length, 2);
  t.is(spanA.textContent, 'Bar');
  t.is(innerUlA.className, 'category-subcategories');
  t.is(innerUlA.children.length, 1);
  t.is(innerLiA.children.length, 1);
  t.is(innerSpanA.textContent, 'A');
  t.not(liB.className, 'category-group');
  t.is(liB.children.length, 1);
  t.is(spanB.textContent, 'B');
  t.is(detail.className, 'categorization-detail');
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'DIV');
  t.is(detail.children.item(0).children.length, 1);
});

test('render on click', t => {
  const data = { 'name': 'Foo' };
  const nameControl: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const innerCategorization: Categorization = {
    type: 'Categorization',
    label: 'Bar',
    elements: [
      {
        type: 'Category',
        label: 'A',
        elements: [nameControl]
      },
    ]
  };
  const uischema: Categorization = {
    type: 'Categorization',
    label: 'Root',
    elements: [
      innerCategorization,
      {
        type: 'Category',
        label: 'B',
        elements: [nameControl, nameControl]
      },
      {
        type: 'Category',
        label: 'C',
        elements: undefined
      },
      {
        type: 'Category',
        label: 'D',
        elements: null
      },
    ]
  };
  const store = initJsonFormsVanillaStore({
    data,
    schema: t.context.schema,
    uischema,
    styles: t.context.styles
  });

  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <CategorizationRenderer
          schema={t.context.schema}
          uischema={uischema}
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;

  const div: HTMLDivElement = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'categorization'
  ) as HTMLDivElement;
  const master = div.children[0] as HTMLDivElement;
  const ul = master.children[0];
  const liB = ul.children[1] as HTMLLIElement;
  const liC = ul.children[2] as HTMLLIElement;
  const liD = ul.children[3] as HTMLLIElement;
  const detail = div.children[1] as HTMLDivElement;

  t.is(div.className, 'categorization');
  t.is(div.childNodes.length, 2);
  t.is(master.children.length, 1);
  t.is(ul.children.length, 4);
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'DIV');
  t.is(detail.children.item(0).children.length, 1);
  TestUtils.Simulate.click(liB);
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'DIV');
  t.is(detail.children.item(0).children.length, 2);

  TestUtils.Simulate.click(liC);
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'DIV');
  t.is(detail.children.item(0).children.length, 0);

  TestUtils.Simulate.click(liD);
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'DIV');
  t.is(detail.children.item(0).children.length, 0);
});

test('hide', t => {
  const uischema: Categorization = {
    type: 'Categorization',
    label: '',
    elements: [
      {
        type: 'Category',
        label: 'B',
        elements: []
      }
    ]
  };
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema,
    styles: t.context.styles
  });

  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <CategorizationRenderer
          schema={t.context.schema}
          uischema={uischema}
          visible={false}
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;

  const div = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'categorization'
  ) as HTMLDivElement;
  t.true(div.hidden);
});

test('showed by default', t => {
  const uischema: Categorization = {
    type: 'Categorization',
    label: '',
    elements: [
      {
        type: 'Category',
        label: 'B',
        elements: []
      }
    ]
  };
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema,
    styles: t.context.styles
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <CategorizationRenderer
          schema={t.context.schema}
          uischema={uischema}
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;

  const div: HTMLDivElement = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'categorization'
  ) as HTMLDivElement;
  t.false(div.hidden);
});
