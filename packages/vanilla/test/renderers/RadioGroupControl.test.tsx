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
import {
    isEnumControl,
    rankWith,
    update
} from '@jsonforms/core';
import { JsonFormsReduxContext } from '@jsonforms/react/lib/redux';
import * as React from 'react';
import * as _ from 'lodash';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import '../../src';
import RadioGroupControl from '../../src/controls/RadioGroupControl';
import { initJsonFormsVanillaStore } from '../vanillaStore';

Enzyme.configure({ adapter: new Adapter() });

const fixture = {
    data: { foo: 'D' },
    schema: {
        type: 'object',
        properties: {
            foo: {
                type: 'string',
                enum: ['A', 'B', 'C', 'D']
            }
        }
    },
    uischema: {
        type: 'Control',
        scope: '#/properties/foo'
    }
};

describe('Radio group control', () => {

    let wrapper: ReactWrapper;

    afterEach(() => wrapper.unmount());

    test('render', () => {
        const store = initJsonFormsVanillaStore({
            data: fixture.data,
            schema: fixture.schema,
            uischema: fixture.uischema,
            renderers: [{ tester: rankWith(10, isEnumControl), renderer: RadioGroupControl }]
        });
        wrapper = mount(
            <Provider store={store}>
                <JsonFormsReduxContext>
                    <RadioGroupControl schema={fixture.schema} uischema={fixture.uischema} />
                </JsonFormsReduxContext>
            </Provider>
        );

        const radioButtons = wrapper.find('input[type="radio"]');
        expect(radioButtons).toHaveLength(4);
        // make sure one option is selected and iexpect "D"
        const currentlyChecked = radioButtons.filter('input[checked=true]');
        expect(currentlyChecked).toHaveLength(1);
        expect((currentlyChecked.getDOMNode() as HTMLInputElement).value).toBe('D');
    });

    test('Radio group should have only one selected option', () => {
        const store = initJsonFormsVanillaStore({
            data: fixture.data,
            schema: fixture.schema,
            uischema: fixture.uischema,
            renderers: [{ tester: rankWith(10, isEnumControl), renderer: RadioGroupControl }]
        });
        wrapper = mount(
            <Provider store={store}>
                <JsonFormsReduxContext>
                    <RadioGroupControl schema={fixture.schema} uischema={fixture.uischema} />
                </JsonFormsReduxContext>
            </Provider>
        );

        // change and verify selection
        store.dispatch(update('foo', () => 'A'));
        store.dispatch(update('foo', () => 'B'));
        wrapper.update();
        const currentlyChecked = wrapper.find('input[checked=true]');
        expect(currentlyChecked).toHaveLength(1);
        expect((currentlyChecked.getDOMNode() as HTMLInputElement).value).toBe('B');
    });
});
