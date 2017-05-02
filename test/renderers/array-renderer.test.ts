import test from 'ava';
// inject window, document etc.
import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare var global;
installCE(global, 'force');
import {JsonSchema} from '../../src/models/jsonSchema';
import {ControlElement} from '../../src/models/uischema';
import {ArrayControlRenderer, arrayTester} from '../../src/renderers/additional/array-renderer';
import {DataService } from '../../src/core/data.service';
import {JsonFormsHolder} from '../../src/core';


test('generate array child control', t => {

    const renderer: ArrayControlRenderer = new ArrayControlRenderer;
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
    const renderedElement = renderer.render();
    const elements = renderedElement.getElementsByClassName('array-layout');
    t.is(elements.length, 1);
    t.is(elements.item(0).tagName, 'FIELDSET');
    const fieldsetChildren = elements.item(0).children;
    t.is(fieldsetChildren.length, 2);
    const legend = fieldsetChildren.item(0);
    t.is(legend.tagName, 'LEGEND');
    const legendChildren = legend.children;
    const label = legendChildren.item(0);
    t.is(label.tagName, 'LABEL');
    t.is(label.innerHTML, 'Test');
    const button = legendChildren.item(1);
    t.is(button.tagName, 'BUTTON');
    t.is(button.innerHTML, 'Add to Test');
    const children = fieldsetChildren.item(1);
    t.is(children.tagName, 'DIV');
    t.is(children.className, 'children');
    t.is(children.children.length, 1);
    t.is(children.children.item(0).tagName, 'JSON-FORMS');
});

test('generate array child control w/o data', t => {

    const renderer: ArrayControlRenderer = new ArrayControlRenderer;
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
    const renderedElement = renderer.render();
    const elements = renderedElement.getElementsByClassName('array-layout');
    t.is(elements.length, 1);
    t.is(elements.item(0).tagName, 'FIELDSET');
    const fieldsetChildren = elements.item(0).children;
    t.is(fieldsetChildren.length, 2);
    const legend = fieldsetChildren.item(0);
    t.is(legend.tagName, 'LEGEND');
    const legendChildren = legend.children;
    const label = legendChildren.item(0);
    t.is(label.tagName, 'LABEL');
    t.is(label.innerHTML, '');
    const button = legendChildren.item(1);
    t.is(button.tagName, 'BUTTON');
    t.is(button.innerHTML, 'Add to Test');
    const children = fieldsetChildren.item(1);
    t.is(children.tagName, 'DIV');
    t.is(children.className, 'children');
    t.is(children.children.length, 0);
});

test('array-layout add click w/o data', t => {

    const renderer: ArrayControlRenderer = new ArrayControlRenderer;
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
    const renderedElement = renderer.render();
    const button = renderedElement.getElementsByTagName('button')[0];
    button.click();
    t.is(data['test'].length, 1);
});
test('array-layout add click with data', t => {

    const renderer: ArrayControlRenderer = new ArrayControlRenderer;
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
    const renderedElement = renderer.render();
    const button = renderedElement.getElementsByTagName('button')[0];
    button.click();
    t.is(data.test.length, 2);
});

test('array-layout DataService notification', t => {
  const renderer: ArrayControlRenderer = new ArrayControlRenderer();
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
  const renderedElement = renderer.render();
  const childrenInitial = renderedElement.getElementsByClassName('children')[0];
  t.is(childrenInitial.childNodes.length, 1);
  renderer.connectedCallback();
  dataService.notifyChange(uiSchema, [{x: 1, y: 3}, {x: 2, y: 3}]);
  const childrenAfter = renderer.getElementsByClassName('children')[0];
  t.is(childrenAfter.childNodes.length, 2);

  dataService.notifyChange(undefined, [{x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}]);
  const childrenIgnore = renderer.getElementsByClassName('children')[0];
  t.is(childrenIgnore.childNodes.length, 2);

  renderer.disconnectedCallback();
  dataService.notifyChange(uiSchema, [{x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}]);
  const childrenLast = renderer.getElementsByClassName('children')[0];
  t.is(childrenLast.childNodes.length, 2);
});
test('array-layout Tester', t => {
  t.is(
      arrayTester({ type: 'Foo' }, null),
      -1
  );
  t.is(
      arrayTester(
          { type: 'Control', scope: { $ref: '#' } } as ControlElement,
          undefined
      ),
      -1);
  t.is(
      arrayTester(
          { type: 'Control', scope: { $ref: '#/properties/x' } } as ControlElement,
          { type: 'object',  properties: { x: { type: 'integer' } } }
      ),
      -1
  );
  t.is(
      arrayTester(
          { type: 'Control', scope: { $ref: '#/properties/foo' } } as ControlElement,
          { type: 'object',  properties: { foo: { type: 'array'} } }
      ),
      -1
  );
  t.is(
      arrayTester(
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
        arrayTester({
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
  t.is(arrayTester(uiSchema, schema), 2);
});
