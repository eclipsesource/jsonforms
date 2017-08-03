import test from 'ava';
import * as installCE from 'document-register-element/pony';
// inject window, document etc.
import 'jsdom-global/register';
declare let global;
installCE(global, 'force');
import { DataService } from '../../src/core/data.service';
import { JsonSchema } from '../../src/models/jsonSchema';
import { ControlElement } from '../../src/models/uischema';
import { ArrayControlRenderer, arrayTester } from '../../src/renderers/additional/array-renderer';
import { JsonForms } from '../../src/core';

test.before(t => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'array.layout',
      classNames: ['array-layout']
    },
    {
      name: 'array.children',
      classNames: ['children']
    }
  ]);
});

test('generate array child control', t => {

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
    JsonForms.schema = schema;
    renderer.setDataService(new DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const renderedElement = renderer.render();
    const elements = renderedElement.getElementsByClassName('array-layout');
    t.is(elements.length, 1);
    const className = renderedElement.className;
    t.true(className.indexOf('root_properties_test') !== -1);
    t.is(elements.item(0).tagName, 'FIELDSET');
    const fieldsetChildren = elements.item(0).children;
    t.is(fieldsetChildren.length, 2);
    const legend = fieldsetChildren.item(0);
    t.is(legend.tagName, 'LEGEND');
    const legendChildren = legend.children;
    const label = legendChildren.item(1);
    t.is(label.tagName, 'LABEL');
    t.is(label.innerHTML, 'Test');
    const button = legendChildren.item(0);
    t.is(button.tagName, 'BUTTON');
    const children = fieldsetChildren.item(1);
    t.is(children.tagName, 'DIV');
    t.is(children.className, 'children');
    t.is(children.children.length, 1);
    t.is(children.children.item(0).tagName, 'JSON-FORMS');
});

test('generate array child control w/o data', t => {
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
    const label = legendChildren.item(1);
    t.is(label.tagName, 'LABEL');
    t.is(label.innerHTML, '');
    const button = legendChildren.item(0);
    t.is(button.tagName, 'BUTTON');
    const children = fieldsetChildren.item(1);
    t.is(children.tagName, 'DIV');
    t.is(children.className, 'children');
    t.is(children.children.length, 0);
});

test('array-layout add click w/o data', t => {
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
        test: []
    };
    JsonForms.schema = schema;
    renderer.setDataService(new DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const renderedElement = renderer.render();
    const button = renderedElement.getElementsByTagName('button')[0];
    button.click();
    t.is(data.test.length, 1);
});
test('array-layout add click with data', t => {
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
    JsonForms.schema = schema;
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
    JsonForms.schema = schema;
    const dataService = new DataService(data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const renderedElement = renderer.render();
    const childrenInitial = renderedElement.getElementsByClassName('children')[0];
    t.is(childrenInitial.childNodes.length, 1);
    renderer.connectedCallback();
    dataService.notifyAboutDataChange(uiSchema, [{x: 1, y: 3}, {x: 2, y: 3}]);
    const childrenAfter = renderer.getElementsByClassName('children')[0];
    t.is(childrenAfter.childNodes.length, 2);

    dataService.notifyAboutDataChange(undefined, [{x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}]);
    const childrenIgnore = renderer.getElementsByClassName('children')[0];
    t.is(childrenIgnore.childNodes.length, 2);

    renderer.disconnectedCallback();
    dataService.notifyAboutDataChange(uiSchema, [{x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}]);
    const childrenLast = renderer.getElementsByClassName('children')[0];
    t.is(childrenLast.childNodes.length, 2);
});

test('array-layout Tester with unknown type', t => {
    t.is(
      arrayTester({type: 'Foo'}, null),
      -1
    );
});

test('ArrayControl tester with document ref', t => {
    const control: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#'
        }
    };
    t.is(
      arrayTester(
        control,
        undefined
      ),
      -1
    );
});

test('ArrayControl tester with wrong prop type', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/x'
        }
    };
    t.is(
      arrayTester(
        control,
        {
            type: 'object',
            properties: {
                x: {
                    type: 'integer'
                }
            }
        }
      ),
      -1
    );
});

test('ArrayControl tester with missing items prop', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.is(
      arrayTester(
        control,
        {
            type: 'object',
            properties: {
                foo: {
                    type: 'array'
                }
            }
        }
      ),
      -1
    );
});

test('ArrayControl tester with tuple type', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.is(
      arrayTester(
        control,
        {
            type: 'object',
            properties:
              {
                  foo: {
                      type: 'array',
                      items: [
                          { type: 'integer' },
                          { type: 'string' },
                      ]
                  }
              }
        }
      ),
      -1
    );
});

test('ArrayControl tester with primitive type', t => {
    const control: ControlElement = {
        type: 'Control',
        scope: {$ref: '#/properties/foo'}
    } ;
    t.is(
      arrayTester(
        control,
        {
            type: 'object',
            properties: {
                foo: {
                    type: 'array',
                    items: {type: 'integer'}
                }
            }
        }
      ),
      -1
    );
});

test('ArrayControl tester with correct prop type', t => {
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
