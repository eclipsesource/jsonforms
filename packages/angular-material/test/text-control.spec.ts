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
import { MatError, MatFormFieldModule, MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { textTest } from '@jsonforms/angular-test';
import { NOT_APPLICABLE } from '@jsonforms/core';
import { TextControlRenderer, TextControlRendererTester } from '../src';
import { ReactiveFormsModule } from '@angular/forms';

describe('Material text field tester', () => {
    const uischema = {
        type: 'Control',
        scope: '#/properties/foo'
    };
    it('should fail', () => {
        expect(TextControlRendererTester(undefined, undefined)).toBe(NOT_APPLICABLE);
        expect(TextControlRendererTester(null, undefined)).toBe(NOT_APPLICABLE);
        expect(TextControlRendererTester({ type: 'Foo' }, undefined)).toBe(NOT_APPLICABLE);
        expect(TextControlRendererTester({ type: 'Control' }, undefined)).toBe(NOT_APPLICABLE);
    });

    it('should succeed', () => {
        expect(
            TextControlRendererTester(
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
const imports = [MatFormFieldModule, MatInputModule, NoopAnimationsModule, ReactiveFormsModule];
const providers = [
    { provide: NgRedux, useFactory: MockNgRedux.getInstance }
];
const componentUT: any = TextControlRenderer;
const errorTest = { errorInstance: MatError, numberOfElements: 1, indexOfElement: 0 };
describe('Text control',
         textTest(imports, providers, componentUT, errorTest));
