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
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ErrorTestExpectation,
  rangeBaseTest,
  rangeErrorTest,
  rangeInputEventTest,
} from '@jsonforms/angular-test';
import { RangeControlRenderer, RangeControlRendererTester } from '../src';
import { FlexLayoutModule } from '@angular/flex-layout';
import { JsonFormsAngularService } from '@jsonforms/angular';

describe('Material number field tester', () => {
  const uischema = {
    type: 'Control',
    scope: '#/properties/foo',
    options: { slider: true },
  };

  it('should succeed with floats', () => {
    expect(
      RangeControlRendererTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
              minimum: -42.42,
              maximum: 42.42,
              default: 0.42,
            },
          },
        },
        undefined
      )
    ).toBe(4);
  });
  it('should succeed with integers', () => {
    expect(
      RangeControlRendererTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'integer',
              minimum: -42,
              maximum: 42,
              default: 1,
            },
          },
        },
        undefined
      )
    ).toBe(4);
  });
});
const imports = [
  NoopAnimationsModule,
  MatSliderModule,
  MatFormFieldModule,
  ReactiveFormsModule,
  FlexLayoutModule,
];
const providers = [JsonFormsAngularService];
const componentUT: any = RangeControlRenderer;
const errorTest: ErrorTestExpectation = {
  errorInstance: MatError,
  numberOfElements: 1,
  indexOfElement: 0,
};
const defaultTestConfig = { imports, providers, componentUT };

describe(
  'Range control Base Tests',
  rangeBaseTest(defaultTestConfig, MatSlider)
);
describe(
  'Range control Input Event Tests',
  rangeInputEventTest(defaultTestConfig, MatSlider)
);
describe(
  'Range control Error Tests',
  rangeErrorTest(defaultTestConfig, MatSlider, errorTest)
);
