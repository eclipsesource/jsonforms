import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import { initJsonFormsStore } from '../helpers/setup';
import { JsonSchema } from '../../src/models/jsonSchema';
import { ControlElement } from '../../src/models/uischema';
import TextfieldlengthControl from '../../src/renderers/controls/textfieldlength.control';
import { textfieldlengthControlTester } from '../../src/renderers/controls/textfieldlength.control';
import { JsonForms } from '../../src/core';
import { update, validate } from '../../src/actions';
import { getData } from '../../src/reducers/index';
import {
    findRenderedDOMElementWithClass,
    findRenderedDOMElementWithTag,
    renderIntoDocument
} from '../helpers/test';
import { Provider } from '../../src/common/binding';
import { change } from '../helpers/test';

test.before(() => {
    JsonForms.stylingRegistry.registerMany([
        {
            name: 'control',
            classNames: ['control']
        },
        {
            name: 'control.validation',
            classNames: ['validation']
        }
    ]);
});
test.beforeEach(t => {
    t.context.data =  { 'name': {
            'default': '12345',
            'maxlength': 5
        }
    };
    t.context.schema = {
        type: 'object',
        properties: {
            name: {
                type: 'object',
                properties: {
                    default: {
                        type: 'string'
                    },
                    maxlength: {
                        type: 'number'
                    }
                }
            }
        }
    };
    t.context.uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/name'
        }
    };
});

test('tester', t => {
    t.is(textfieldlengthControlTester(undefined, undefined), -1);
    t.is(textfieldlengthControlTester(null, undefined), -1);
    t.is(textfieldlengthControlTester({type: 'Foo'}, undefined), -1);
    // scope is missing
    t.is(textfieldlengthControlTester({type: 'Control'}, undefined), -1);
});

test('render', t => {
    const schema: JsonSchema = {
        type: 'object',
        properties: {
            name: {
                type: 'object',
                properties: {
                    default: {
                        type: 'string'
                    },
                    maxlength: {
                        type: 'number'
                    }
                }
            }
        }
    };
    const data = { 'name': {
        'default': '12345',
        'maxlength': 5
        }
    };
    const store = initJsonFormsStore(data, schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <TextfieldlengthControl schema={schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );

    const control = findRenderedDOMElementWithClass(tree, 'control');
    t.not(findRenderedDOMElementWithClass(tree, 'root_properties_name'), undefined);
    t.is(control.childNodes.length, 3);

    const label = findRenderedDOMElementWithTag(tree, 'label');
    t.is(label.textContent, 'Name');

    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLTextAreaElement;
    t.is(input.value, '12345');

    const validation = findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.tagName, 'DIV');
    t.is((validation as HTMLDivElement).children.length, 0);
});

test('render without label', t => {
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/name'
        },
        label: false
    };
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <TextfieldlengthControl schema={t.context.schema}
                         uischema={uischema}
            />
        </Provider>
    );

    const control = findRenderedDOMElementWithClass(tree, 'control');
    t.not(control, undefined);
    t.is(control.childNodes.length, 3);

    const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
    t.is(label.textContent, '');

    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.is(input.value, '12345');

    const validation = findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.tagName, 'DIV');
    t.is((validation as HTMLDivElement).children.length, 0);
});

test('update via input event', t => {
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        t.context.uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <TextfieldlengthControl schema={t.context.schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );

    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    input.value = '54321';
    change(input);
    t.is(getData(store.getState()).name, '54321');
});

test('update via action', t => {
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        t.context.uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <TextfieldlengthControl schema={t.context.schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(update('name', () => {
        return {
            'default': '54321',
            'maxlength': 5
        };
    }));
    setTimeout(() => t.is(input.value, '54321'), 100);
});

test('update with undefined value', t => {
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        t.context.uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <TextfieldlengthControl schema={t.context.schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLTextAreaElement;
    store.dispatch(update('name', () => undefined));
    t.is(input.value, '12345');
});

test('update with null value', t => {
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        t.context.uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <TextfieldlengthControl schema={t.context.schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLTextAreaElement;
    store.dispatch(update('name', () => null));
    t.is(input.value, '12345');
});

test('update with wrong ref', t => {
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        t.context.uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <TextfieldlengthControl schema={t.context.schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLTextAreaElement;
    store.dispatch(
        update(
            'firstname',
            () => '54321'
        )
    );
    t.is(input.value, '12345');
});

test('update with null ref', t => {
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        t.context.uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <TextfieldlengthControl schema={t.context.schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLTextAreaElement;
    store.dispatch(
        update(
            null,
            () => '54321'
        )
    );
    t.is(input.value, '12345');
});

test('update with undefined ref', t => {
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        t.context.uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <TextfieldlengthControl schema={t.context.schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLTextAreaElement;
    store.dispatch(
        update(
            undefined,
            () => '54321'
        )
    );
    t.is(input.value, '12345');
});

test('hide', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <TextfieldlengthControl schema={t.context.schema}
                         uischema={t.context.uischema}
                         visible={false}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.true(input.hidden);
});

test('show by default', t => {
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        t.context.uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <TextfieldlengthControl schema={t.context.schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.false(input.hidden);
});

test('disable', t => {
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        t.context.uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <TextfieldlengthControl schema={t.context.schema}
                         uischema={t.context.uischema}
                         enabled={false}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.true(input.disabled);
});

test('enabled by default', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <TextfieldlengthControl schema={t.context.schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.false(input.disabled);
});

test('empty errors by default', t => {
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        t.context.uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <TextfieldlengthControl schema={t.context.schema}
                         uischema={t.context.uischema}

            />
        </Provider>
    );
    const validation = findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.textContent, '');
});
