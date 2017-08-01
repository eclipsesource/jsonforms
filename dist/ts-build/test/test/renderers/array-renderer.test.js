"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const installCE = require("document-register-element/pony");
// inject window, document etc.
require("jsdom-global/register");
installCE(global, 'force');
const data_service_1 = require("../../src/core/data.service");
const array_renderer_1 = require("../../src/renderers/additional/array-renderer");
const core_1 = require("../../src/core");
ava_1.default('generate array child control', t => {
    const renderer = new array_renderer_1.ArrayControlRenderer();
    const schema = {
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
    const uiSchema = {
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
    core_1.instantiateSchemaService(schema);
    renderer.setDataService(new data_service_1.DataService(data));
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
ava_1.default('generate array child control w/o data', t => {
    const renderer = new array_renderer_1.ArrayControlRenderer();
    const schema = {
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
    const uiSchema = {
        'label': false,
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/test'
        }
    };
    const data = {};
    renderer.setDataService(new data_service_1.DataService(data));
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
ava_1.default('array-layout add click w/o data', t => {
    const renderer = new array_renderer_1.ArrayControlRenderer();
    const schema = {
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
    const uiSchema = {
        'label': false,
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/test'
        }
    };
    const data = {
        test: []
    };
    core_1.instantiateSchemaService(schema);
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const renderedElement = renderer.render();
    const button = renderedElement.getElementsByTagName('button')[0];
    button.click();
    t.is(data.test.length, 1);
});
ava_1.default('array-layout add click with data', t => {
    const renderer = new array_renderer_1.ArrayControlRenderer();
    const schema = {
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
    const uiSchema = {
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
    core_1.instantiateSchemaService(schema);
    renderer.setDataService(new data_service_1.DataService(data));
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const renderedElement = renderer.render();
    const button = renderedElement.getElementsByTagName('button')[0];
    button.click();
    t.is(data.test.length, 2);
});
ava_1.default('array-layout DataService notification', t => {
    const renderer = new array_renderer_1.ArrayControlRenderer();
    const schema = {
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
    const uiSchema = {
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
    core_1.instantiateSchemaService(schema);
    const dataService = new data_service_1.DataService(data);
    renderer.setDataService(dataService);
    renderer.setDataSchema(schema);
    renderer.setUiSchema(uiSchema);
    const renderedElement = renderer.render();
    const childrenInitial = renderedElement.getElementsByClassName('children')[0];
    t.is(childrenInitial.childNodes.length, 1);
    renderer.connectedCallback();
    dataService.notifyAboutDataChange(uiSchema, [{ x: 1, y: 3 }, { x: 2, y: 3 }]);
    const childrenAfter = renderer.getElementsByClassName('children')[0];
    t.is(childrenAfter.childNodes.length, 2);
    dataService.notifyAboutDataChange(undefined, [{ x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }]);
    const childrenIgnore = renderer.getElementsByClassName('children')[0];
    t.is(childrenIgnore.childNodes.length, 2);
    renderer.disconnectedCallback();
    dataService.notifyAboutDataChange(uiSchema, [{ x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }]);
    const childrenLast = renderer.getElementsByClassName('children')[0];
    t.is(childrenLast.childNodes.length, 2);
});
ava_1.default('array-layout Tester with unknown type', t => {
    t.is(array_renderer_1.arrayTester({ type: 'Foo' }, null), -1);
});
ava_1.default('ArrayControl tester with document ref', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#'
        }
    };
    t.is(array_renderer_1.arrayTester(control, undefined), -1);
});
ava_1.default('ArrayControl tester with wrong prop type', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/x'
        }
    };
    t.is(array_renderer_1.arrayTester(control, {
        type: 'object',
        properties: {
            x: {
                type: 'integer'
            }
        }
    }), -1);
});
ava_1.default('ArrayControl tester with missing items prop', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.is(array_renderer_1.arrayTester(control, {
        type: 'object',
        properties: {
            foo: {
                type: 'array'
            }
        }
    }), -1);
});
ava_1.default('ArrayControl tester with tuple type', t => {
    const control = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        }
    };
    t.is(array_renderer_1.arrayTester(control, {
        type: 'object',
        properties: {
            foo: {
                type: 'array',
                items: [
                    { type: 'integer' },
                    { type: 'string' },
                ]
            }
        }
    }), -1);
});
ava_1.default('ArrayControl tester with primitive type', t => {
    const control = {
        type: 'Control',
        scope: { $ref: '#/properties/foo' }
    };
    t.is(array_renderer_1.arrayTester(control, {
        type: 'object',
        properties: {
            foo: {
                type: 'array',
                items: { type: 'integer' }
            }
        }
    }), -1);
});
ava_1.default('ArrayControl tester with correct prop type', t => {
    const schema = {
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
    const uiSchema = {
        'type': 'Control',
        'scope': {
            '$ref': '#/properties/test'
        }
    };
    t.is(array_renderer_1.arrayTester(uiSchema, schema), 2);
});
//# sourceMappingURL=array-renderer.test.js.map