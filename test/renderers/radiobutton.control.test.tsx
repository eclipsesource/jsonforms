import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import { initJsonFormsStore } from '../helpers/setup';
import { ControlElement } from '../../src/models/uischema';
import RadiobuttonControl,
{ radiobuttonControlTester
} from '../../src/renderers/controls/radiobutton.control';
import { JsonForms } from '../../src/core';
import { getData } from '../../src/reducers/index';
import { update, validate } from '../../src/actions';
import {
    change,
    findRenderedDOMElementWithClass,
    findRenderedDOMElementWithTag,
    renderIntoDocument
} from '../helpers/test';
import { Provider } from '../../src/common/binding';

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
    t.context.data = { 'foo': 'a' };
    t.context.schema = {
        'type': 'object',
        'properties': {
            'foo': {
                'type': 'string',
                'enum': ['a', 'b'],
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
    t.is(radiobuttonControlTester(undefined, undefined), -1);
    t.is(radiobuttonControlTester(null, undefined), -1);
    t.is(radiobuttonControlTester({type: 'Foo'}, undefined), -1);
    t.is(radiobuttonControlTester({type: 'Control'}, undefined), -1);
});

test('tester with wrong prop type', t => {
    t.is(
        radiobuttonControlTester(
            t.context.uischema,
            { type: 'object', properties: {foo: {type: 'string'}} }
        ),
        -1
    );
});

test('tester with wrong prop type, but sibling has correct one', t => {
    t.is(
        radiobuttonControlTester(
            t.context.uischema,
            {
                'type': 'object',
                'properties': {
                    'foo': {
                        'type': 'string'
                    },
                    'bar': {
                        'type': 'string',
                        'enum': ['a', 'b']
                    }
                }
            }
        ),
        -1
    );
});

test('tester with matching string type', t => {
    t.is(
        radiobuttonControlTester(
            t.context.uischema,
            {
                'type': 'object',
                'properties': {
                    'foo': {
                        'type': 'string',
                        'enum': ['a', 'b']
                    }
                }
            }
        ),
        2
    );
});

test('tester with matching numeric type', t => {
    // TODO should this be true?
    t.is(
        radiobuttonControlTester(
            t.context.uischema,
            {
                'type': 'object',
                'properties': {
                    'foo': {
                        'type': 'number',
                        'enum': [1, 2]
                    }
                }
            }
        ),
        2
    );
});

test('render', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
          <RadiobuttonControl schema={t.context.schema}
                       uischema={t.context.uischema}
          />
        </Provider>
    );

    const control = findRenderedDOMElementWithClass(tree, 'control');
    t.not(control, undefined);
    t.is(control.childNodes.length, 3);
    t.not(findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
    t.not(findRenderedDOMElementWithClass(tree, 'valid'), undefined);
    t.not(findRenderedDOMElementWithClass(tree, 'control'), undefined);

    const label = control.firstChild as HTMLLabelElement;
    t.is(label.textContent, 'Foo');

    const validation = findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.tagName, 'DIV');
    t.is((validation as HTMLDivElement).children.length, 0);
});

test('render without label', t => {
    const uischema: ControlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo'
        },
        label: false
    };
    const store = initJsonFormsStore(t.context.data, t.context.schema, uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <RadiobuttonControl schema={t.context.schema}
                         uischema={uischema}
            />
        </Provider>
    );

    const control = findRenderedDOMElementWithClass(tree, 'control');
    t.not(control, undefined);
    t.is(control.childNodes.length, 3);
    t.not(findRenderedDOMElementWithClass(tree, 'root_properties_foo'), undefined);
    t.not(findRenderedDOMElementWithClass(tree, 'valid'), undefined);
    t.not(findRenderedDOMElementWithClass(tree, 'control'), undefined);

    const label = control.firstChild as HTMLLabelElement;
    t.is(label.textContent, '');

    const validation = findRenderedDOMElementWithClass(tree, 'validation');
    t.is(validation.tagName, 'DIV');
    t.is((validation as HTMLDivElement).children.length, 0);
});

test('update via input event', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <RadiobuttonControl schema={t.context.schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );

    const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
    select.value = 'b';
    change(select);
    t.is(getData(store.getState()).foo, '');
});

test('update with undefined value', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <RadiobuttonControl schema={t.context.schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );
    const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
    store.dispatch(
        update(
            'foo',
            () => undefined
        )
    );
    t.is(select.selectedIndex, 0);
    t.is(select.value, '');
});

test('update with null value', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <RadiobuttonControl schema={t.context.schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );
    const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
    store.dispatch(
        update(
            'foo',
            () => null
        )
    );
    t.is(select.selectedIndex, 0);
    t.is(select.value, '');
});

test('update with wrong ref', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <RadiobuttonControl schema={t.context.schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );
    const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
    store.dispatch(
        update(
            'bar',
            () => 'Bar'
        )
    );
    t.is(select.selectedIndex, 0);
    t.is(select.value, '');
});

test('update with null ref', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <RadiobuttonControl schema={t.context.schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );
    const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
    store.dispatch(
        update(
            null,
            () => false
        )
    );
    t.is(select.selectedIndex, 0);
    t.is(select.value, '');
});

test('update with undefined ref', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <RadiobuttonControl schema={t.context.schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );
    const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
    store.dispatch(
        update(
            undefined,
            () => false
        )
    );
    t.is(select.selectedIndex, 0);
    t.is(select.value, '');
});

test('hide', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <RadiobuttonControl schema={t.context.schema}
                         uischema={t.context.uischema}
                         visible={false}
            />
        </Provider>
    );
    const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
    t.true(select.hidden);
});

test('show by default', t => {
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        t.context.uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <RadiobuttonControl schema={t.context.schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );
    const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
    t.false(select.hidden);
});
//
test('disable', t => {
    const store = initJsonFormsStore(
        t.context.data,
        t.context.schema,
        t.context.uischema
    );
    const tree = renderIntoDocument(
        <Provider store={store}>
            <RadiobuttonControl schema={t.context.schema}
                         uischema={t.context.uischema}
                         enabled={false}
            />
        </Provider>
    );
    const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
    t.true(select.disabled);
});

test('enabled by default', t => {
    const store = initJsonFormsStore(t.context.data, t.context.schema, t.context.uischema);
    const tree = renderIntoDocument(
        <Provider store={store}>
            <RadiobuttonControl schema={t.context.schema}
                         uischema={t.context.uischema}
            />
        </Provider>
    );
    const select = findRenderedDOMElementWithTag(tree, 'select') as HTMLSelectElement;
    t.false(select.disabled);
});
