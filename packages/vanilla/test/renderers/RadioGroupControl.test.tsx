/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import '@jsonforms/test';
import test from 'ava';
import {
    isEnumControl,
    rankWith,
    update
} from '@jsonforms/core';
import * as React from 'react';
import * as _ from 'lodash';
import { Provider } from 'react-redux';
import '../../src';
import RadioGroupControl from '../../src/controls/RadioGroupControl';
import * as TestUtils from 'react-dom/test-utils';
import { initJsonFormsVanillaStore } from '../vanillaStore';

test.beforeEach(t => {
    t.context.data = { foo: 'D' };
    t.context.schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'string',
                enum: ['A', 'B', 'C', 'D']
            }
        }
    };
    t.context.uischema = {
        type: 'Control',
        scope: '#/properties/foo'
    };
});

test('render', t => {
    const store = initJsonFormsVanillaStore({
        data: t.context.data,
        schema: t.context.schema,
        uischema: t.context.uischema,
        renderers: [{ tester: rankWith(10, isEnumControl), renderer: RadioGroupControl }]
    });
    const tree: React.Component<any> = TestUtils.renderIntoDocument(
        <Provider store={store}>
            <RadioGroupControl schema={t.context.schema} uischema={t.context.uischema} />
        </Provider>
    ) as unknown as React.Component<any>;

    const inputs: HTMLInputElement[] =
        TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input') as HTMLInputElement[];
    const radioButtons = _.filter(inputs, i => i.type === 'radio');
    t.is(radioButtons.length, 4);
    // make sure one option is selected and it is "D"
    const currentlyChecked = _.filter(radioButtons, radio => radio.checked);
    t.is(currentlyChecked.length, 1);
    t.is(currentlyChecked[0].value, 'D');
});

test('Radio group should have only one selected option', t => {
    const store = initJsonFormsVanillaStore({
        data: t.context.data,
        schema: t.context.schema,
        uischema: t.context.uischema,
        renderers: [{ tester: rankWith(10, isEnumControl), renderer: RadioGroupControl }]
    });
    const tree: React.Component<any> = TestUtils.renderIntoDocument(
        <Provider store={store}>
            <RadioGroupControl schema={t.context.schema} uischema={t.context.uischema} />
        </Provider>
    ) as unknown as React.Component<any>;

    const inputs: HTMLInputElement[] =
        TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input') as HTMLInputElement[];
    const radioButtons = _.filter(inputs, i => i.type === 'radio');

    // change and verify selection
    store.dispatch(update('foo', () => 'A'));
    store.dispatch(update('foo', () => 'B'));
    const currentlyChecked = _.filter(radioButtons, radio => radio.checked);
    t.is(currentlyChecked.length, 1);
    t.is(currentlyChecked[0].value, 'B');
});
