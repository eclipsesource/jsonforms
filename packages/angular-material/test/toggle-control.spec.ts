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
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import {
  MatSlideToggle,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import {
  booleanBaseTest,
  booleanErrorTest,
  booleanInputEventTest,
  ErrorTestExpectation,
} from '@jsonforms/angular-test';
import { ToggleControlRenderer, ToggleControlRendererTester } from '../src';
import { JsonFormsAngularService } from '@jsonforms/angular';

describe('Material boolean field tester', () => {
  const uischema = {
    type: 'Control',
    scope: '#/properties/foo',
    options: { toggle: true },
  };

  it('should succeed', () => {
    expect(
      ToggleControlRendererTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'boolean',
            },
          },
        },
        undefined
      )
    ).toBe(3);
  });
});
const imports = [MatSlideToggleModule, MatFormFieldModule];
const providers = [JsonFormsAngularService];
const componentUT: any = ToggleControlRenderer;
const errorTest: ErrorTestExpectation = {
  errorInstance: MatError,
  numberOfElements: 1,
  indexOfElement: 0,
};
const testConfig = { imports, providers, componentUT };
describe(
  'Toggle control Base Tests',
  booleanBaseTest(testConfig, MatSlideToggle)
);
describe(
  'Toggle control Input Event Tests',
  booleanInputEventTest(testConfig, MatSlideToggle, 'label')
);
describe(
  'Toggle control Error Tests',
  booleanErrorTest(testConfig, MatSlideToggle, errorTest)
);
