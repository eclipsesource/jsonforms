/*
  The MIT License

  Copyright (c) 2018 EclipseSource Munich
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
import { MockNgRedux } from '@angular-redux/store/testing';
import { beforeEachLayoutTest, initComponent, setupMockStore } from '@jsonforms/angular-test';
import { IonicModule, Platform } from 'ionic-angular';
import { PlatformMock } from '../test-config/mocks-ionic';
import { HorizontalLayoutRenderer } from '../src';

describe('Horizontal layout', () => {
    let fixture: any;
    let component: any;

    const data = { foo: true };
    const schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'boolean'
            }
        }
    };
    const uischema = {
        type: 'HorizontalLayout',
        elements: [{
            type: 'Control',
            scope: '#/properties/foo'
        }]
    };

    beforeEach((() => {
        fixture = beforeEachLayoutTest(
            HorizontalLayoutRenderer,
            {
                providers: [{
                    provide: Platform, useClass: PlatformMock
                }],
                imports: [IonicModule.forRoot(HorizontalLayoutRenderer)]
            }
        );
        component = fixture.componentInstance;
    }));

    it('add elements', () => {
        const mockSubStore = setupMockStore(fixture, { data, schema, uischema });
        initComponent(fixture, mockSubStore);

        MockNgRedux.reset();
        component.uischema = {
            type: 'HorizontalLayout',
            elements: [
                ...uischema.elements,
                {
                    type: 'Control',
                    scope: '#properties/bar'
                }
            ]
        };

        fixture.detectChanges();
        expect(component.uischema.elements.length).toBe(2);
    });
});
