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
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ErrorTestExpectation,
  textBaseTest,
  textErrorTest,
  textInputEventTest,
  textTypeTest,
} from './common';
import { TextControlRenderer, TextControlRendererTester } from '../src';
import { JsonFormsAngularService } from '@jsonforms/angular';
import { initTestEnvironment } from './test';

initTestEnvironment();

describe('Material text field tester', () => {
  const uischema = {
    type: 'Control',
    scope: '#/properties/foo',
  };

  it('should succeed', () => {
    expect(
      TextControlRendererTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'string',
            },
          },
        },
        undefined
      )
    ).toBe(1);
  });
});
const imports = [
  MatFormFieldModule,
  MatInputModule,
  NoopAnimationsModule,
  ReactiveFormsModule,
];
const providers = [JsonFormsAngularService];
const componentUT: any = TextControlRenderer;
const errorTest: ErrorTestExpectation = {
  errorInstance: MatError,
  numberOfElements: 1,
  indexOfElement: 0,
};
const toSelect = (el: DebugElement) => el.nativeElement;
const testConfig = { imports, providers, componentUT };

describe(
  'Text control Base Tests',
  textBaseTest(testConfig, 'input', toSelect)
);
describe(
  'Text control Input Event Tests',
  textInputEventTest(testConfig, 'input', toSelect)
);
describe('Text control Error Tests', textErrorTest(testConfig, errorTest));
describe(
  'Text control Type Tests',
  textTypeTest(testConfig, 'input', toSelect)
);
