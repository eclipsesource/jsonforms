import test from 'ava';
// inject window, document etc.
import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare var global;
installCE(global, 'force');
import {JsonSchema} from '../../src/models/jsonSchema';
import {ControlElement} from '../../src/models/uischema';
import {TableArrayControlRenderer, tableArrayTester} from
  '../../src/renderers/additional/table-array.control';
import {DataService } from '../../src/core/data.service';
import {JsonForms} from '../../src/core';


test('generate array child control', t => {

    const renderer: TableArrayControlRenderer = new TableArrayControlRenderer;
    const schema: JsonSchema = {
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
    const uiSchema: ControlElement = {
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/test'
        }
    };
    const data = {
        'test': [{
            x: 1,
            y: 3
        }]
    };
    renderer.setDataService(new DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    renderer.connectedCallback();
    const elements = renderer.getElementsByClassName('array-table-layout');
    t.is(elements.length, 1);
    t.is(elements.item(0).tagName, 'DIV');
    const fieldsetChildren = elements.item(0).children;
    t.is(fieldsetChildren.length, 2);
    const header = fieldsetChildren.item(0);
    t.is(header.tagName, 'HEADER');
    const legendChildren = header.children;
    const label = legendChildren.item(0);
    t.is(label.tagName, 'LABEL');
    t.is(label.innerHTML, 'Test');
    const button = legendChildren.item(1);
    t.is(button.tagName, 'BUTTON');
    t.is(button.innerHTML, 'Add to Test');
    const table = fieldsetChildren.item(1);
    t.is(table.tagName, 'TABLE');
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
    t.is((<HTMLTableHeaderCellElement>headColumn1).innerText, 'x');
    const headColumn2 = headRow.children.item(1);
    t.is(headColumn2.tagName, 'TH');
    t.is((<HTMLTableHeaderCellElement>headColumn2).innerText, 'y');

    const tBody = tableChildren.item(1);
    t.is(tBody.tagName, 'TBODY');
    t.is(tBody.children.length, 1);
    const bodyRow = tBody.children.item(0);
    t.is(bodyRow.tagName, 'TR');
    t.is(bodyRow.children.length, 2);
    const bodyColumn1 = bodyRow.children.item(0);
    t.is(bodyColumn1.tagName, 'TD');
    t.is(bodyColumn1.children.length, 1);
    t.is(bodyColumn1.children.item(0).tagName, 'JSON-FORMS');
    const bodyColumn2 = bodyRow.children.item(1);
    t.is(bodyColumn2.tagName, 'TD');
    t.is(bodyColumn2.children.length, 1);
    t.is(bodyColumn2.children.item(0).tagName, 'JSON-FORMS');
});

test('generate array child control w/o data', t => {

    const renderer: TableArrayControlRenderer = new TableArrayControlRenderer;
    const schema: JsonSchema = {
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
    const uiSchema: ControlElement = {
        'label': false,
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/test'
        }
    };
    const data = {};
    renderer.setDataService(new DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    renderer.connectedCallback();
    const elements = renderer.getElementsByClassName('array-table-layout');
    t.is(elements.length, 1);
    t.is(elements.item(0).tagName, 'DIV');
    const fieldsetChildren = elements.item(0).children;
    t.is(fieldsetChildren.length, 2);
    const header = fieldsetChildren.item(0);
    t.is(header.tagName, 'HEADER');
    const legendChildren = header.children;
    const label = <HTMLLabelElement>legendChildren.item(0);
    t.is(label.tagName, 'LABEL');
    t.is(label.textContent, '');
    const button = legendChildren.item(1);
    t.is(button.tagName, 'BUTTON');
    t.is(button.innerHTML, 'Add to Test');
    const table = fieldsetChildren.item(1);
    t.is(table.tagName, 'TABLE');
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
    t.is((<HTMLTableHeaderCellElement>headColumn1).innerText, 'x');
    const headColumn2 = headRow.children.item(1);
    t.is(headColumn2.tagName, 'TH');
    t.is((<HTMLTableHeaderCellElement>headColumn2).innerText, 'y');

    const tBody = tableChildren.item(1);
    t.is(tBody.tagName, 'TBODY');
    t.is(tBody.children.length, 0);
});

test('array-layout add click w/o data', t => {

    const renderer: TableArrayControlRenderer = new TableArrayControlRenderer;
    const schema: JsonSchema = {
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
    const uiSchema: ControlElement = {
        'label': false,
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/test'
        }
    };
    const data = {};
    renderer.setDataService(new DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    renderer.connectedCallback();
    const button = renderer.getElementsByTagName('button')[0];
    button.click();
    t.is(data['test'].length, 1);
});
test('array-layout add click with data', t => {

    const renderer: TableArrayControlRenderer = new TableArrayControlRenderer;
    const schema: JsonSchema = {
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
    const uiSchema: ControlElement = {
        'label': false,
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/test'
        }
    };
    const data = {
      'test': [{
        x: 1,
        y: 3
      }]
    };
    renderer.setDataService(new DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    renderer.connectedCallback();
    const button = renderer.getElementsByTagName('button')[0];
    button.click();
    t.is(data.test.length, 2);
});

test('array-layout DataService notification', t => {
  const renderer: TableArrayControlRenderer = new TableArrayControlRenderer();
  const schema: JsonSchema = {
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
  const uiSchema: ControlElement = {
      'label': false,
      'type': 'Control',
      'scope': {
          '$ref': '#/properties/test'
      }
  };
  const data = {
    'test': [{
      x: 1,
      y: 3
    }]
  };
  const dataService = new DataService(data);
  renderer.setDataService(dataService);
  renderer.setDataSchema(schema);
  renderer.setUiSchema(uiSchema);
  renderer.connectedCallback();
  const childrenInitial = renderer.getElementsByTagName('TBODY')[0];
  t.is(childrenInitial.childNodes.length, 1);
  dataService.notifyAboutDataChange(uiSchema, [{x: 1, y: 3}, {x: 2, y: 3}]);
  const childrenAfter = renderer.getElementsByTagName('TBODY')[0];
  t.is(childrenAfter.childNodes.length, 2);

  dataService.notifyAboutDataChange(undefined, [{x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}]);
  const childrenIgnore = renderer.getElementsByTagName('TBODY')[0];
  t.is(childrenIgnore.childNodes.length, 2);

  renderer.disconnectedCallback();
  dataService.notifyAboutDataChange(uiSchema, [{x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}]);
  const childrenLast = renderer.getElementsByTagName('TBODY')[0];
  t.is(childrenLast.childNodes.length, 2);
});
test('array-layout Tester', t => {
  t.is(
      tableArrayTester({ type: 'Foo' }, null),
      -1
  );
  t.is(
      tableArrayTester(
          { type: 'Control', scope: { $ref: '#' } } as ControlElement,
          undefined
      ),
      -1);
  t.is(
      tableArrayTester(
          { type: 'Control', scope: { $ref: '#/properties/x' } } as ControlElement,
          { type: 'object',  properties: { x: { type: 'integer' } } }
      ),
      -1
  );
  t.is(
      tableArrayTester(
          { type: 'Control', scope: { $ref: '#/properties/foo' } } as ControlElement,
          { type: 'object',  properties: { foo: { type: 'array'} } }
      ),
      -1
  );
  t.is(
      tableArrayTester(
          { type: 'Control', scope: { $ref: '#/properties/foo' } } as ControlElement,
          {
              type: 'object',
              properties:
                  {
                      foo: {
                          type: 'array',
                          items: [
                              { type: 'integer' },
                              { type: 'string' }
                          ]
                      }
                  }
          }
      ),
      -1
  );
    t.is(
        tableArrayTester({
                type: 'Control',
                scope: { $ref: '#/properties/foo'}
            } as ControlElement,
            {
                type: 'object',
                properties: {
                    foo: {
                        type: 'array',
                        items: { type: 'integer' }
                    }
                }
            }
        ),
        -1
    );
    const schema: JsonSchema = {
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
  const uiSchema: ControlElement = {
      'type': 'Control',
      'scope': {
          '$ref': '#/properties/test'
      }
  };
  t.is(tableArrayTester(uiSchema, schema), -1);

  const uiSchema2: ControlElement = {
      'type': 'Control',
      'scope': {
          '$ref': '#/properties/test'
      },
      options: {
        table: true
      }
  };
  t.is(tableArrayTester(uiSchema2, schema), 10);
});
