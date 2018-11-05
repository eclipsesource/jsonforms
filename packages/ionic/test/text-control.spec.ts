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
import { NgRedux } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/testing';
import { DebugElement } from '@angular/core';
import {
    textBaseTest,
    textErrorTest,
    textInputEventTest,
    textTypeTest
} from '@jsonforms/angular-test';
import { IonicModule, Label, Platform } from 'ionic-angular';
import { StringControlRenderer, stringControlTester } from '../src';
import { PlatformMock } from '../test-config/platform-mock';

describe('Ionic text field tester', () => {
    const uischema = {
        type: 'Control',
        scope: '#/properties/foo'
    };

    it('should succeed', () => {
        expect(
            stringControlTester(
                uischema,
                {
                    type: 'object',
                    properties: {
                        foo: {
                            type: 'string'
                        }
                    }
                }
            )
        ).toBe(1);
    });
});
const imports = [IonicModule.forRoot(StringControlRenderer)];
const providers = [
    { provide: Platform, useClass: PlatformMock },
    { provide: NgRedux, useFactory: MockNgRedux.getInstance }
];
const componentUT: any = StringControlRenderer;
const errorTest = { errorInstance: Label, numberOfElements: 2, indexOfElement: 1 };
const toSelect = (el: DebugElement) => el.componentInstance;
const testConfig = {imports, providers, componentUT};

describe('Text control Base Tests', textBaseTest(testConfig, 'ion-input', toSelect));
describe('Text control Input Event Tests',
         textInputEventTest(testConfig, 'ion-input', toSelect));
describe('Text control Error Tests', textErrorTest(testConfig, errorTest));
describe('Text control type tests', textTypeTest(testConfig, 'ion-input', toSelect));
