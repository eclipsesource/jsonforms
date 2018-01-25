import { initJsonFormsStore } from '@jsonforms/test';
import * as React from 'react';
import test from 'ava';
import { Provider } from 'react-redux';
import {
  Categorization,
  ControlElement,
  JsonSchema,
  Layout
} from '@jsonforms/core';
import * as TestUtils from 'react-dom/test-utils';
import CategorizationRenderer, { categorizationTester } from '../../src/complex/categorization';

test.beforeEach(t => {
  t.context.data = { };
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
    elements: [
      {
        type: 'Category',
        label: 'B'
      },
    ]
  };
  t.context.styles = [
    {
      name: 'categorization',
      classNames: ['jsf-categorization']
    },
    {
      name: 'categorization.master',
      classNames: ['jsf-categorization-master']
    },
    {
      name: 'category.group',
      classNames: ['jsf-category-group']
    },
    {
      name: 'category.subcategories',
      classNames: ['jsf-category-subcategories']
    },
    {
      name: 'categorization.detail',
      classNames: ['jsf-categorization-detail']
    }
  ];
});

test('tester', t => {
  t.is(categorizationTester(undefined, undefined), -1);
  t.is(categorizationTester(null, undefined), -1);
  t.is(categorizationTester({type: 'Foo'}, undefined), -1);
  t.is(categorizationTester({type: 'Categorization'}, undefined), -1);
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
  const categorization =  {
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
  const categorization: Layout = {
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
  const categorization = {
    type: 'Categorization',
    elements: [
      {
        type: 'Categorization',
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
  const categorization = {
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

  const store = initJsonFormsStore({
    data: t.context.data,
    schema,
    uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <CategorizationRenderer
        schema={schema}
        uischema={uischema}
      />
    </Provider>
  );

  // master tree
  const div = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'jsf-categorization'
  ) as HTMLDivElement;
  const master = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'jsf-categorization-master'
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

  t.is(div.className, 'jsf-categorization');
  t.is(div.childNodes.length, 2);
  t.is(master.className, 'jsf-categorization-master');
  t.is(master.children.length, 1);
  t.is(ul.children.length, 2);
  t.is(liA.className, 'jsf-category-group');
  t.is(liA.children.length, 2);
  t.is(spanA.textContent, 'Bar');
  t.is(innerUlA.className, 'jsf-category-subcategories');
  t.is(innerUlA.children.length, 1);
  t.is(innerLiA.children.length, 1);
  t.is(innerSpanA.textContent, 'A');
  t.not(liB.className, 'jsf-category-group');
  t.is(liB.children.length, 1);
  t.is(spanB.textContent, 'B');
  t.is(detail.className, 'jsf-categorization-detail');
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'DIV');
  t.is(detail.children.item(0).children.length, 1);
});

test('render on click', t => {
  const data = {'name': 'Foo'};
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
  const store = initJsonFormsStore({
    data,
    schema: t.context.schema,
    uischema,
    styles: t.context.styles
  });

  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <CategorizationRenderer
        schema={t.context.schema}
        uischema={uischema}
      />
    </Provider>
  );

  const div = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'jsf-categorization'
  ) as HTMLDivElement;
  const master = div.children[0] as HTMLDivElement;
  const ul = master.children[0];
  const liB = ul.children[1] as HTMLLIElement;
  const liC = ul.children[2] as HTMLLIElement;
  const liD = ul.children[3] as HTMLLIElement;
  const detail = div.children[1] as HTMLDivElement;

  t.is(div.className, 'jsf-categorization');
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
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema,
    styles: t.context.styles
  });

  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <CategorizationRenderer
        schema={t.context.schema}
        uischema={uischema}
        visible={false}
      />
    </Provider>
  );

  const div = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'jsf-categorization'
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
  const store = initJsonFormsStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema,
    styles: t.context.styles
  });
  const tree = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <CategorizationRenderer
        schema={t.context.schema}
        uischema={uischema}
      />
    </Provider>
  );

  const div = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'jsf-categorization'
  ) as HTMLDivElement;
  t.false(div.hidden);
});
