import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import { initJsonFormsStore } from '../helpers/setup';
import { ControlElement } from '../../src/models/uischema';
import RadiobuttonControl,
{ radiobuttonControlTester
} from '../../src/renderers/controls/radiobutton.control';
import { JsonForms } from '../../src/core';
import {
    findRenderedDOMElementWithClass,
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
    t.not(findRenderedDOMElementWithClass(tree, 'control'), undefined);

    const label = control.firstChild as HTMLLabelElement;
    t.is(label.textContent, 'Foo');
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
    t.not(findRenderedDOMElementWithClass(tree, 'control'), undefined);

    const label = control.firstChild as HTMLLabelElement;
    t.is(label.textContent, '');
});
