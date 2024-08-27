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
import { ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import {
  baseSetup,
  ErrorTestExpectation,
  getJsonFormsService,
  numberAdditionalPropsTest,
  numberBaseTest,
  numberErrorTest,
  numberInputEventTest,
  prepareComponent,
} from './common';
import { Actions, ControlElement, JsonFormsCore } from '@jsonforms/core';
import { NumberControlRenderer, NumberControlRendererTester } from '../src';
import { initTestEnvironment } from './test';

initTestEnvironment();

describe('Material number field tester', () => {
  const uischema = {
    type: 'Control',
    scope: '#/properties/foo',
  };

  it('should succeed with floats', () => {
    expect(
      NumberControlRendererTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
            },
          },
        },
        undefined
      )
    ).toBe(2);
  });
  it('should succeed with integers', () => {
    expect(
      NumberControlRendererTester(
        uischema,
        {
          type: 'object',
          properties: {
            foo: {
              type: 'integer',
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
];
const providers = [JsonFormsAngularService];
const componentUT: any = NumberControlRenderer;
const errorTest: ErrorTestExpectation = {
  errorInstance: MatError,
  numberOfElements: 1,
  indexOfElement: 0,
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

describe('Number control custom', () => {
  let fixture: ComponentFixture<any>;
  let numberNativeElement: any;
  let component: JsonFormsControl;
  baseSetup(testConfig);

  const defaultSchema = {
    type: 'object',
    properties: {
      foo: { type: 'number' },
    },
  };
  const defaultData = { foo: 1000000 };
  const defaultUischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
  };

  beforeEach(() => {
    const preparedComponents = prepareComponent(testConfig, 'input', toSelect);
    fixture = preparedComponents.fixture;
    numberNativeElement = preparedComponents.numberNativeElement;
    component = preparedComponents.component;
  });

  it('default grouping behavior', () => {
    const uischema = Object.assign({}, defaultUischema);
    component.uischema = uischema;
    const state: JsonFormsCore = {
      data: defaultData,
      schema: defaultSchema,
      uischema: uischema,
    };
    getJsonFormsService(component).init({
      core: state,
      i18n: {
        locale: 'en',
      },
    });
    getJsonFormsService(component).updateCore(
      Actions.init(state.data, state.schema)
    );
    component.ngOnInit();
    fixture.detectChanges();

    expect(numberNativeElement.value).toBe('1,000,000');
  });

  it('should use config for grouping', () => {
    const uischema = Object.assign({}, defaultUischema);
    component.uischema = uischema;
    const state: JsonFormsCore = {
      data: defaultData,
      schema: defaultSchema,
      uischema: uischema,
    };
    getJsonFormsService(component).init({
      core: state,
      i18n: {
        locale: 'en',
      },
      config: {
        useGrouping: false,
      },
    });
    getJsonFormsService(component).updateCore(
      Actions.init(state.data, state.schema)
    );
    component.ngOnInit();
    fixture.detectChanges();

    expect(numberNativeElement.value).toBe('1000000');
  });
  it('should use uischema for grouping', () => {
    const uischema = Object.assign({}, defaultUischema);
    uischema.options = {
      useGrouping: false,
    };
    component.uischema = uischema;
    const state: JsonFormsCore = {
      data: defaultData,
      schema: defaultSchema,
      uischema: uischema,
    };
    getJsonFormsService(component).init({
      core: state,
      i18n: {
        locale: 'en',
      },
      config: {
        useGrouping: true,
      },
    });
    getJsonFormsService(component).updateCore(
      Actions.init(state.data, state.schema)
    );
    component.ngOnInit();
    fixture.detectChanges();

    expect(numberNativeElement.value).toBe('1000000');
  });
});
