import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import { initJsonFormsStore } from '../helpers/setup';
import TableArrayControl from '../../src/renderers/additional/table-array.control';
import { JsonForms } from '../../src/core';
import {
  findRenderedDOMElementWithClass,
  findRenderedDOMElementWithTag,
  renderIntoDocument,
  scryRenderedDOMElementsWithTag
} from '../helpers/test';
import { Provider } from '../../src/common/binding';

test.before(() => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'array-table',
      classNames: ['array-table-layout', 'control']
    }
  ]);
});

test.beforeEach(t => {
  t.context.schema = {
    'type': 'object',
    'properties': {
      'test': {
        'type': 'array',
        'items': {
          'type': 'object',
          'properties': {
            'x': {'type': 'integer'},
            'y': {'type': 'integer'}
          }
        }
      }
    }
  };
  t.context.uischema = {
    'type': 'Control',
    'scope': {
      '$ref': '#/properties/test'
    }
  };
  t.context.data = {
    'test': [{
      x: 1,
      y: 3
    }]
  };
});

test('render two children', t => {
  const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <TableArrayControl schema={t.context.schema}
                         uischema={t.context.uischema}
      />
    </Provider>
  );

  const header = findRenderedDOMElementWithTag(tree, 'header') as HTMLInputElement;
  const legendChildren = header.children;

  const label = legendChildren.item(0);
  t.is(label.tagName, 'LABEL');
  t.is(label.innerHTML, 'Test');

  const button = legendChildren.item(1);
  t.is(button.tagName, 'BUTTON');
  t.is(button.innerHTML, 'Add to Test');

  const table = findRenderedDOMElementWithTag(tree, 'table') as HTMLInputElement;
  const tableChildren = table.children;
  t.is(tableChildren.length, 2);
  const tHead = tableChildren.item(0);
  t.is(tHead.tagName, 'THEAD');
  t.is(tHead.children.length, 1);
  const headRow = tHead.children.item(0);
  t.is(headRow.tagName, 'TR');
  t.is(headRow.children.length, 2);

  const headColumn1 = headRow.children.item(0);
  t.is(headColumn1.tagName, 'TH');
  t.is((headColumn1 as HTMLTableHeaderCellElement).textContent, 'x');

  const headColumn2 = headRow.children.item(1);
  t.is(headColumn2.tagName, 'TH');
  t.is((headColumn2 as HTMLTableHeaderCellElement).textContent, 'y');

  const tBody = tableChildren.item(1);
  t.is(tBody.tagName, 'TBODY');
  t.is(tBody.children.length, 1);
  const bodyRow = tBody.children.item(0);
  t.is(bodyRow.tagName, 'TR');
  t.is(bodyRow.children.length, 2);

  const tds = scryRenderedDOMElementsWithTag(tree, 'td');
  t.is(tds.length, 2);

  t.not(
    findRenderedDOMElementWithClass(tree, 'root_properties_x'),
    undefined
  );

  t.not(
    findRenderedDOMElementWithClass(tree, 'root_properties_y'),
    undefined
  );
});

// test('render empty data', t => {
//   t.context.uischema = {
//     'label': false,
//     'type': 'Control',
//     'scope': {
//       '$ref': '#/properties/test'
//     }
//   };
//   const data = {};
//   const store = initJsonFormsStore(data, t.context.schema, t.context.uischema);
//   const tree = renderIntoDocument(
//     <Provider store={store}>
//       <TableArrayControl schema={t.context.schema}
//                          uischema={t.context.uischema}
//       />
//     </Provider>
//   );
//
//   const header = findRenderedDOMElementWithTag(tree, 'header') as HTMLInputElement;
//   const legendChildren = header.children;
//   const label = legendChildren.item(0) as HTMLLabelElement;
//   t.is(label.tagName, 'LABEL');
//   t.is(label.textContent, '');
//
//   const button = legendChildren.item(1);
//   t.is(button.tagName, 'BUTTON');
//   t.is(button.innerHTML, 'Add to Test');
//
//   const table = findRenderedDOMElementWithTag(tree, 'table') as HTMLTableElement;
//   const tableChildren = table.children;
//   t.is(tableChildren.length, 2);
//
//   const tHead = tableChildren.item(0);
//   t.is(tHead.tagName, 'THEAD');
//   t.is(tHead.children.length, 1);
//
//   const headRow = tHead.children.item(0);
//   t.is(headRow.tagName, 'TR');
//   t.is(headRow.children.length, 2);
//
//   const headColumn1 = headRow.children.item(0);
//   t.is(headColumn1.tagName, 'TH');
//   t.is((headColumn1 as HTMLTableHeaderCellElement).textContent, 'x');
//
//   const headColumn2 = headRow.children.item(1);
//   t.is(headColumn2.tagName, 'TH');
//   t.is((headColumn2 as HTMLTableHeaderCellElement).textContent, 'y');
//
//   const tBody = tableChildren.item(1);
//   t.is(tBody.tagName, 'TBODY');
//   t.is(tBody.children.length, 0);
// });
//
// test('render new child (empty init data)', t => {
//   const data = { test: [] };
//   const store = initJsonFormsStore(data, t.context.schema, t.context.uischema);
//   const tree = renderIntoDocument(
//     <Provider store={store}>
//       <TableArrayControl schema={t.context.schema}
//                          uischema={t.context.uischema}
//       />
//     </Provider>
//   );
//
//   const control = findRenderedDOMElementWithClass(tree, 'root_properties_test');
//   t.not(control, undefined);
//
//   const button = findRenderedDOMElementWithTag(tree, 'button') as HTMLButtonElement;
//   button.click();
//   t.is(getData(store.getState()).test.length, 1);
// });
//
// test('render new child', t => {
//   const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
//   const tree = renderIntoDocument(
//     <Provider store={store}>
//       <TableArrayControl schema={t.context.schema}
//                          uischema={t.context.uischema}
//       />
//     </Provider>
//   );
//
//   const button = findRenderedDOMElementWithTag(tree, 'button') as HTMLButtonElement;
//   button.click();
//   t.is(getData(store.getState()).test.length, 2);
// });
//
// test('update via action', t => {
//   const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
//   const tree = renderIntoDocument(
//     <Provider store={store}>
//       <TableArrayControl schema={t.context.schema}
//                          uischema={t.context.uischema}
//       />
//     </Provider>
//   );
//
//   const children = findRenderedDOMElementWithTag(tree, 'tbody');
//   t.is(children.childNodes.length, 1);
//
//   store.dispatch(
//     update(
//       'test',
//       () => [{x: 1, y: 3}, {x: 2, y: 3}]
//     )
//   );
//   t.is(children.childNodes.length, 2);
//
//   store.dispatch(
//     update(
//       undefined,
//       () => [{x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}]
//     )
//   );
//   t.is(children.childNodes.length, 2);
// });
//
// test('tester', t => {
//   t.is(tableArrayTester({type: 'Foo'}, null), -1);
// });
//
// test('tester with recursive document ref only', t => {
//   const control: ControlElement = {
//     type: 'Control',
//     scope: {
//       $ref: '#'
//     }
//   };
//   t.is(
//     tableArrayTester(
//       control,
//       undefined
//     ),
//     -1
//   );
// });
//
// test(' tester with prop of wrong type', t => {
//   const control: ControlElement = {
//     type: 'Control',
//     scope: {
//       $ref: '#/properties/x'
//     }
//   };
//   t.is(
//     tableArrayTester(
//       control,
//       {type: 'object', properties: {x: {type: 'integer'}}}
//     ),
//     -1
//   );
// });
//
// test('tester with correct prop type, but without items', t => {
//   const control: ControlElement = {
//     type: 'Control',
//     scope: {
//       $ref: '#/properties/foo'
//     }
//   };
//   t.is(
//     tableArrayTester(
//       control,
//       {type: 'object', properties: {foo: {type: 'array'}}}
//     ),
//     -1
//   );
// });
//
// test('tester with correct prop type, but different item types', t => {
//   const control: ControlElement = {
//     type: 'Control',
//     scope: {
//       $ref: '#/properties/foo'
//     }
//   };
//   t.is(
//     tableArrayTester(
//       control,
//       {
//         type: 'object',
//         properties: {
//           foo: {
//             type: 'array',
//             items: [
//               {type: 'integer'},
//               {type: 'string'},
//             ]
//           }
//         }
//       }
//     ),
//     -1
//   );
// });
//
// test('tester with primitive item type', t => {
//   const control: ControlElement = {
//     type: 'Control',
//     scope: {
//       $ref: '#/properties/foo'
//     }
//   };
//   t.is(
//     tableArrayTester(
//       control,
//       {
//         type: 'object',
//         properties: {
//           foo: {
//             type: 'array',
//             items: {type: 'integer'}
//           }
//         }
//       }
//     ),
//     -1
//   );
// });
//
// test('tester', t => {
//   const schema: JsonSchema = {
//     type: 'object',
//     properties: {
//       test: {
//         type: 'array',
//         items: {
//           type: 'object',
//           properties: {
//             x: {type: 'integer'},
//             y: {type: 'integer'}
//           }
//         }
//       }
//     }
//   };
//
//   const uischema: ControlElement = {
//       type: 'Control',
//       scope: {
//           $ref: '#/properties/test'
//       }
//   };
//
//   const uischema2: ControlElement = {
//       type: 'Control',
//       scope: {
//           $ref: '#/properties/test'
//       },
//       options: {
//         table: true
//       }
//   };
//
//   t.is(tableArrayTester(uischema, schema), -1);
//   t.is(tableArrayTester(uischema2, schema), 10);
// });
