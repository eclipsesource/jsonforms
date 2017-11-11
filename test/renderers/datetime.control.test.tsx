import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import DateTimeControl, { datetimeControlTester } from '../../src/renderers/controls/datetime.control';
import { JsonForms } from '../../src/core';
import { dispatchInputEvent, initJsonFormsStore } from '../helpers/setup';
import {
    findRenderedDOMElementWithClass,
    findRenderedDOMElementWithTag,
    renderIntoDocument
} from 'inferno-test-utils';
import { Provider } from 'inferno-redux';
import { getData } from '../../src/reducers/index';
import { update, validate } from '../../src/actions';

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
    t.context.data = { 'foo': '1980-04-04T19:13' };
    t.context.schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'string',
                format: 'date-time'
            },
        },
    };
    t.context.uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo',
        },
    };
});

test('tester', t => {
    t.is(datetimeControlTester(undefined, undefined), -1);
    t.is(datetimeControlTester(null, undefined), -1);
    t.is(datetimeControlTester({ type: 'Foo' }, undefined), -1);
    t.is(datetimeControlTester({ type: 'Control' }, undefined), -1);
});

test('tester with wrong prop type', t => {
    t.is(
        datetimeControlTester(
            t.context.uischmea,
            {
                type: 'object',
                properties: {
                    foo: { type: 'string' },
                },
            },
        ),
        -1,
    );
});

test('tester with wrong prop type, but sibling has correct one', t => {
    t.is(
        datetimeControlTester(
            t.context.uischema,
            {
                type: 'object',
                properties: {
                    foo: { type: 'string' },
                    bar: {
                        type: 'string',
                        format: 'date-time',
                    },
                },
            },
        ),
        -1,
    );
});

test('tester with correct prop type', t => {
    t.is(
        datetimeControlTester(
            t.context.uischema,
            {
                type: 'object',
                properties: {
                    foo: {
                        type: 'string',
                        format: 'date-time',
                    },
                },
            },
        ),
        2,
    );
});

test('render', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <DateTimeControl schema={t.context.schema}
                             uischema={t.context.uischema}
            />
        </Provider>
    );

    const control = findRenderedDOMElementWithClass(tree, 'control');
    const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    const validation = findRenderedDOMElementWithClass(tree, 'validation');

    t.not(control, undefined);
    t.is(control.childNodes.length, 3);
    t.not(findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
    t.not(findRenderedDOMElementWithClass(tree, 'valid'), undefined);
    t.is(label.textContent, 'Foo');
    t.is(input.type, 'date-time');
    t.is(input.value, '1980-04-04T19:13');
    t.is(validation.tagName, 'DIV');
    t.is((validation as HTMLDivElement).children.length, 0);
});

test('render without label', t => {
    const uischema = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo',
        },
        label: false,
    };
    const store = initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <DateTimeControl schema={t.context.schema}
                             uischema={uischema}
            />
        </Provider>
    );

    const control = findRenderedDOMElementWithClass(tree, 'control');
    const label = findRenderedDOMElementWithTag(tree, 'label') as HTMLLabelElement;
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    const validation = findRenderedDOMElementWithClass(tree, 'validation');

    t.not(control, undefined);
    t.is(control.childNodes.length, 3);
    t.not(findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
    t.not(findRenderedDOMElementWithClass(tree, 'valid'), undefined);
    t.is(label.textContent, '');
    t.is(input.type, 'date-time');
    t.is(input.value, '1980-04-04T19:13');
    t.is(validation.tagName, 'DIV');
    t.is((validation as HTMLDivElement).children.length, 0);
});

test('update via event', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <DateTimeControl schema={t.context.schema}
                             uischema={t.context.uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    input.value = '1961-04-12T18:14';
    dispatchInputEvent(input);
    t.is(getData(store.getState()).foo, '1961-04-12T18:14');
});

test('update via action', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <DateTimeControl schema={t.context.schema}
                             uischema={t.context.uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    store.dispatch(
        update(
            'foo',
            () => '1961-04-12T18:14'
        )
    );
    t.is(input.value, '1961-04-12T18:14');
});

test.failing('update with null value', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <DateTimeControl schema={t.context.schema}
                             uischema={t.context.uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    input.value = '';
    dispatchInputEvent(input);
    // FIXME: how does reset of date-time value look like?
    t.is(getData(store.getState()).foo, '1970-01-01T20:15');
});

test.failing('update with undefined value', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <DateTimeControl schema={t.context.schema}
                             uischema={t.context.uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    input.value = undefined;
    dispatchInputEvent(input);
    t.is(getData(store.getState()).foo, '1970-01-01T20:15');
});

test('update with wrong ref', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <DateTimeControl schema={t.context.schema}
                             uischema={t.context.uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    input.value = undefined;
    dispatchInputEvent(input);
    store.dispatch(
        update(
            'bar',
            () => 'Bar'
        ));
    t.is(input.value, '1980-04-04T19:13');
});

test('update with null ref', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <DateTimeControl schema={t.context.schema}
                             uischema={t.context.uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    input.value = undefined;
    dispatchInputEvent(input);
    store.dispatch(
        update(
            null,
            () => '1961-04-12T18:14'
        ));
    t.is(input.value, '1980-04-04T19:13');
});

test('update with undefined ref', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <DateTimeControl schema={t.context.schema}
                             uischema={t.context.uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    input.value = undefined;
    dispatchInputEvent(input);
    store.dispatch(
        update(
            undefined,
            () => '1961-04-12T18:14'
        ));
    t.is(input.value, '1980-04-04T19:13');
});

test('hide', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <DateTimeControl schema={t.context.schema}
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
            <DateTimeControl schema={t.context.schema}
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
            <DateTimeControl schema={t.context.schema}
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
            <DateTimeControl schema={t.context.schema}
                             uischema={t.context.uischema}
            />
        </Provider>
    );
    const input = findRenderedDOMElementWithTag(tree, 'input') as HTMLInputElement;
    t.false(input.disabled);
});

test('single error', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <DateTimeControl schema={t.context.schema}
                             uischema={t.context.uischema}

            />
        </Provider>
    );
    const validation = findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(update('foo', () => 2));
    store.dispatch(validate());
    t.is(validation.textContent, 'should be string');
});

test('multiple errors', t => {
    const schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'string',
                'format': 'date-time',
                'enum': ['1985-01-01T19:14']
            }
        }
    };
    const store = initJsonFormsStore(t.context.data, schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <DateTimeControl schema={t.context.schema}
                             uischema={t.context.uischema}

            />
        </Provider>
    );
    const validation = findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(update('foo', () => 3));
    store.dispatch(validate());
    t.is(
        validation.textContent,
        'should be string\nshould be equal to one of the allowed values'
    );
});

test('empty errors by default', t => {
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        t.context.uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <DateTimeControl schema={t.context.schema}
                             uischema={t.context.uischema}

            />
        </Provider>
    );
    const validation = findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.textContent, '');
});

test('reset validation message', t => {
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        t.context.uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <DateTimeControl schema={t.context.schema}
                             uischema={t.context.uischema}
            />
        </Provider>
    );
    const validation = findRenderedDOMElementWithClass(tree, 'validation');
    store.dispatch(update('foo', () => 3));
    store.dispatch(
        update(
            'foo',
            () => '1961-04-12T18:14'
        )
    );
    store.dispatch(validate());
    t.is(validation.textContent, '');
});
