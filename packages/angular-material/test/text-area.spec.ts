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
  TestData,
  textBaseTest,
  textErrorTest,
  textInputEventTest,
} from '@jsonforms/angular-test';
import { TextAreaRenderer, TextAreaRendererTester } from '../src';
import { ControlElement, JsonSchema } from '@jsonforms/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { JsonFormsAngularService } from '@jsonforms/angular';

describe('Material text field tester', () => {
  const uischema = {
    type: 'Control',
    scope: '#/properties/foo',
    options: { multi: true },
  };

  it('should succeed', () => {
    expect(
      TextAreaRendererTester(
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
    ).toBe(2);
  });
});
const imports = [
  MatFormFieldModule,
  MatInputModule,
  NoopAnimationsModule,
  ReactiveFormsModule,
  FlexLayoutModule,
];
const providers = [JsonFormsAngularService];
const componentUT: any = TextAreaRenderer;
const errorTest: ErrorTestExpectation = {
  errorInstance: MatError,
  numberOfElements: 1,
  indexOfElement: 0,
};
const toSelect = (el: DebugElement) => el.nativeElement;
const testConfig = { imports, providers, componentUT };
const defaultData = { foo: 'foo' };
const defaultSchema: JsonSchema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
    },
  },
};
const defaultUischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
  options: { multi: true },
};
const defaultTestData: TestData<ControlElement> = {
  data: defaultData,
  schema: defaultSchema,
  uischema: defaultUischema,
};
describe(
  'Text control Base Tests',
  textBaseTest(testConfig, 'textarea', toSelect, defaultTestData)
);
describe(
  'Text control Input Event Tests',
  textInputEventTest(testConfig, 'textarea', toSelect, defaultTestData)
);
describe(
  'Text control Error Tests',
  textErrorTest(testConfig, errorTest, defaultTestData)
);
