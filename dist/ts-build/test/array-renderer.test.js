"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
// inject window, document etc.
require("jsdom-global/register");
var installCE = require("document-register-element/pony");
installCE(global, 'force');
var array_renderer_1 = require("../src/renderers/additional/array-renderer");
var data_service_1 = require("../src/core/data.service");
ava_1.default('generate array child control', function (t) {
    var renderer = new array_renderer_1.ArrayControlRenderer;
    var schema = {
        'type': 'object',
        'properties': {
            'test': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'x': { 'type': 'integer' },
                        'y': { 'type': 'integer' }
                    }
                }
            }
        }
    };
    var uiSchema = {
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/test'
        }
    };
    var data = {
        'test': [{
                x: 1,
                y: 3
            }]
    };
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    var renderedElement = renderer.render();
    var elements = renderedElement.getElementsByClassName('array-layout');
    t.is(elements.length, 1);
    t.is(elements.item(0).tagName, 'FIELDSET');
    var fieldsetChildren = elements.item(0).children;
    t.is(fieldsetChildren.length, 2);
    var legend = fieldsetChildren.item(0);
    t.is(legend.tagName, 'LEGEND');
    var legendChildren = legend.children;
    var label = legendChildren.item(0);
    t.is(label.tagName, 'LABEL');
    t.is(label.innerHTML, 'Test');
    var button = legendChildren.item(1);
    t.is(button.tagName, 'BUTTON');
    t.is(button.innerHTML, 'Add to Test');
    var children = fieldsetChildren.item(1);
    t.is(children.tagName, 'DIV');
    t.is(children.className, 'children');
    t.is(children.children.length, 1);
    t.is(children.children.item(0).tagName, 'JSON-FORMS');
});
ava_1.default('generate array child control w/o data', function (t) {
    var renderer = new array_renderer_1.ArrayControlRenderer;
    var schema = {
        'type': 'object',
        'properties': {
            'test': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'x': { 'type': 'integer' },
                        'y': { 'type': 'integer' }
                    }
                }
            }
        }
    };
    var uiSchema = {
        'label': false,
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/test'
        }
    };
    var data = {};
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    var renderedElement = renderer.render();
    var elements = renderedElement.getElementsByClassName('array-layout');
    t.is(elements.length, 1);
    t.is(elements.item(0).tagName, 'FIELDSET');
    var fieldsetChildren = elements.item(0).children;
    t.is(fieldsetChildren.length, 2);
    var legend = fieldsetChildren.item(0);
    t.is(legend.tagName, 'LEGEND');
    var legendChildren = legend.children;
    var label = legendChildren.item(0);
    t.is(label.tagName, 'LABEL');
    t.is(label.innerHTML, '');
    var button = legendChildren.item(1);
    t.is(button.tagName, 'BUTTON');
    t.is(button.innerHTML, 'Add to Test');
    var children = fieldsetChildren.item(1);
    t.is(children.tagName, 'DIV');
    t.is(children.className, 'children');
    t.is(children.children.length, 0);
});
ava_1.default('array-layout add click w/o data', function (t) {
    var renderer = new array_renderer_1.ArrayControlRenderer;
    var schema = {
        'type': 'object',
        'properties': {
            'test': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'x': { 'type': 'integer' },
                        'y': { 'type': 'integer' }
                    }
                }
            }
        }
    };
    var uiSchema = {
        'label': false,
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/test'
        }
    };
    var data = {};
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    var renderedElement = renderer.render();
    var button = renderedElement.getElementsByTagName('button')[0];
    button.click();
    t.is(data['test'].length, 1);
});
ava_1.default('array-layout add click with data', function (t) {
    var renderer = new array_renderer_1.ArrayControlRenderer;
    var schema = {
        'type': 'object',
        'properties': {
            'test': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'x': { 'type': 'integer' },
                        'y': { 'type': 'integer' }
                    }
                }
            }
        }
    };
    var uiSchema = {
        'label': false,
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/test'
        }
    };
    var data = {
        'test': [{
                x: 1,
                y: 3
            }]
    };
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    var renderedElement = renderer.render();
    var button = renderedElement.getElementsByTagName('button')[0];
    button.click();
    t.is(data.test.length, 2);
});
ava_1.default('array-layout DataService notification', function (t) {
    var renderer = new array_renderer_1.ArrayControlRenderer();
    var schema = {
        'type': 'object',
        'properties': {
            'test': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'x': { 'type': 'integer' },
                        'y': { 'type': 'integer' }
                    }
                }
            }
        }
    };
    var uiSchema = {
        'label': false,
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/test'
        }
    };
    var data = {
        'test': [{
                x: 1,
                y: 3
            }]
    };
    var dataService = new data_service_1.DataService(data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    var renderedElement = renderer.render();
    var childrenInitial = renderedElement.getElementsByClassName('children')[0];
    t.is(childrenInitial.childNodes.length, 1);
    renderer.connectedCallback();
    dataService.notifyChange(uiSchema, [{ x: 1, y: 3 }, { x: 2, y: 3 }]);
    var childrenAfter = renderer.getElementsByClassName('children')[0];
    t.is(childrenAfter.childNodes.length, 2);
    dataService.notifyChange(undefined, [{ x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }]);
    var childrenIgnore = renderer.getElementsByClassName('children')[0];
    t.is(childrenIgnore.childNodes.length, 2);
    renderer.disconnectedCallback();
    dataService.notifyChange(uiSchema, [{ x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }]);
    var childrenLast = renderer.getElementsByClassName('children')[0];
    t.is(childrenLast.childNodes.length, 2);
});
ava_1.default('array-layout Tester', function (t) {
    t.is(array_renderer_1.ArrayControlTester({ type: 'Foo' }, null), -1);
    t.is(array_renderer_1.ArrayControlTester({ type: 'Control', scope: { $ref: '#' } }, undefined), -1);
    t.is(array_renderer_1.ArrayControlTester({ type: 'Control', scope: { $ref: '#/properties/x' } }, { type: 'object', properties: { x: { type: 'integer' } } }), -1);
    t.is(array_renderer_1.ArrayControlTester({ type: 'Control', scope: { $ref: '#/properties/foo' } }, { type: 'object', properties: { foo: { type: 'array' } } }), -1);
    t.is(array_renderer_1.ArrayControlTester({ type: 'Control', scope: { $ref: '#/properties/foo' } }, { type: 'object', properties: { foo: { type: 'array', items: [{ type: 'integer' }, { type: 'string' }] } } }), -1);
    t.is(array_renderer_1.ArrayControlTester({ type: 'Control', scope: { $ref: '#/properties/foo' } }, { type: 'object', properties: { foo: { type: 'array', items: { type: 'integer' } } } }), -1);
    var schema = {
        'type': 'object',
        'properties': {
            'test': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'x': { 'type': 'integer' },
                        'y': { 'type': 'integer' }
                    }
                }
            }
        }
    };
    var uiSchema = {
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/test'
        }
    };
    t.is(array_renderer_1.ArrayControlTester(uiSchema, schema), 2);
});
//# sourceMappingURL=array-renderer.test.js.map