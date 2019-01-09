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
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatError,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ErrorTestExpectation,
  numberAdditionalPropsTest,
  numberBaseTest,
  numberErrorTest,
  numberInputEventTest
} from '@jsonforms/angular-test';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  L10nConfig,
  LocaleValidationModule,
  LocalizationModule,
  TranslationModule
} from 'angular-l10n';
import { NumberControlRenderer, NumberControlRendererTester } from '../src';

describe('Material number field tester', () => {
  const uischema = {
    type: 'Control',
    scope: '#/properties/foo'
  };

  it('should succeed with floats', () => {
    expect(
      NumberControlRendererTester(uischema, {
        type: 'object',
        properties: {
          foo: {
            type: 'number'
          }
        }
      })
    ).toBe(2);
  });
  it('should succeed with integers', () => {
    expect(
      NumberControlRendererTester(uischema, {
        type: 'object',
        properties: {
          foo: {
            type: 'integer'
          }
        }
      })
    ).toBe(2);
  });
});
const emptyL10NConfig: L10nConfig = {};

const imports = [
  MatFormFieldModule,
  MatInputModule,
  NoopAnimationsModule,
  ReactiveFormsModule,
  FlexLayoutModule,
  LocalizationModule,
  LocaleValidationModule.forRoot(),
  TranslationModule.forRoot(emptyL10NConfig)
];
const providers = [{ provide: NgRedux, useFactory: MockNgRedux.getInstance }];
const componentUT: any = NumberControlRenderer;
const errorTest: ErrorTestExpectation = {
  errorInstance: MatError,
  numberOfElements: 1,
  indexOfElement: 0
};
const toSelect = (el: DebugElement) => el.nativeElement;
const testConfig = { imports, providers, componentUT };

describe(
  'Number control Base Tests',
  numberBaseTest(testConfig, 'input', toSelect)
);
describe(
  'Number control Input Event Tests',
  numberInputEventTest(testConfig, 'input', toSelect)
);
describe('Number control Error Tests', numberErrorTest(testConfig, errorTest));
describe(
  'Number control Additional Props Tests',
  numberAdditionalPropsTest(testConfig, 'input', toSelect)
);
