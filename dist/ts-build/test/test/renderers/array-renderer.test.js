"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../../src/renderers/JSX");
const ava_1 = require("ava");
const setup_1 = require("../helpers/setup");
const array_renderer_1 = require("../../src/renderers/additional/array-renderer");
const core_1 = require("../../src/core");
const inferno_test_utils_1 = require("inferno-test-utils");
const inferno_redux_1 = require("inferno-redux");
const actions_1 = require("../../src/actions");
const index_1 = require("../../src/reducers/index");
ava_1.default.before(() => {
    core_1.JsonForms.stylingRegistry.registerMany([
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
ava_1.default.beforeEach(t => {
    t.context.data = {
        'test': [{
                x: 1,
                y: 3
            }]
    };
    t.context.schema = {
        type: 'object',
        properties: {
            test: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        x: { type: 'integer' },
                        y: { type: 'integer' }
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
});
ava_1.default('render', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(array_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const fieldSet = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'array-layout');
    const legend = fieldSet.children.item(0);
    const legendChildren = legend.children;
    const label = legendChildren.item(1);
    const button = legendChildren.item(0);
    const children = fieldSet.children.item(1);
    t.not(inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'root_properties_test'), undefined);
    t.is(fieldSet.tagName, 'FIELDSET');
    t.is(fieldSet.children.length, 2);
    t.is(legend.tagName, 'LEGEND');
    t.is(label.tagName, 'LABEL');
    t.is(label.innerHTML, 'Test');
    t.is(button.tagName, 'BUTTON');
    t.is(children.tagName, 'DIV');
    t.is(children.className, 'children');
    t.is(children.children.length, 1);
});
ava_1.default('add data via click - empty array case', t => {
    const data = {};
    const store = setup_1.initJsonFormsStore(data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(array_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const button = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'button');
    button.click();
    t.is(index_1.getData(store.getState()).test.length, 1);
});
ava_1.default('add data via click', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(array_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const button = inferno_test_utils_1.findRenderedDOMElementWithTag(tree, 'button');
    button.click();
    t.is(index_1.getData(store.getState()).test.length, 2);
});
ava_1.default('update via action', t => {
    core_1.JsonForms.schema = t.context.schema;
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(array_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const children = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'children');
    store.dispatch(actions_1.update('test', () => [{ x: 1, y: 3 }, { x: 2, y: 3 }]));
    t.is(children.childNodes.length, 2);
    t.is(index_1.getData(store.getState()).test.length, 2);
});
ava_1.default('update with undefined ref', t => {
    const store = setup_1.initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = inferno_test_utils_1.renderIntoDocument(JSX_1.JSX.createElement(inferno_redux_1.Provider, { store: store },
        JSX_1.JSX.createElement(array_renderer_1.default, { schema: t.context.schema, uischema: t.context.uischema })));
    const children = inferno_test_utils_1.findRenderedDOMElementWithClass(tree, 'children');
    store.dispatch(actions_1.update(undefined, () => [{ x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }]));
    t.is(children.childNodes.length, 1);
    t.is(index_1.getData(store.getState()).test.length, 1);
});
ava_1.default('tester with unknown type', t => {
    t.is(array_renderer_1.arrayTester({ type: 'Foo' }, null), -1);
});
ava_1.default('tester with document ref', t => {
    const uischema = {
        type: 'Control',
        scope: {
            $ref: '#'
        }
    };
    t.is(array_renderer_1.arrayTester(uischema, undefined), -1);
});
ava_1.default('tester with wrong prop type', t => {
    const uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/x'
        }
    };
    t.is(array_renderer_1.arrayTester(uischema, {
        type: 'object',
        properties: {
            x: {
                type: 'integer'
            }
        }
    }), -1);
});
ava_1.default('tester with missing items prop', t => {
    t.is(array_renderer_1.arrayTester(t.context.uischema, {
        type: 'object',
        properties: {
            foo: {
                type: 'array'
            }
        }
    }), -1);
});
ava_1.default('tester with tuple type', t => {
    t.is(array_renderer_1.arrayTester(t.context.uischema, {
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
ava_1.default('tester with primitive type', t => {
    t.is(array_renderer_1.arrayTester(t.context.uischema, {
        type: 'object',
        properties: {
            foo: {
                type: 'array',
                items: { type: 'integer' }
            }
        }
    }), -1);
});
ava_1.default('tester with correct prop type', t => {
    const schema = {
        type: 'object',
        properties: {
            test: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        x: { type: 'integer' },
                        y: { type: 'integer' }
                    }
                }
            }
        }
    };
    t.is(array_renderer_1.arrayTester(t.context.uischema, schema), 2);
});
//# sourceMappingURL=array-renderer.test.js.map