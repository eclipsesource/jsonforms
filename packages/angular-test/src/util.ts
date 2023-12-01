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
import type { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import type {
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  UISchemaElement,
} from '@jsonforms/core';
import type { ErrorObject } from 'ajv';

export interface ErrorTestExpectation {
  errorInstance: Type<any>;
  numberOfElements: number;
  indexOfElement: number;
}
export interface TestConfig<C extends JsonFormsControl> {
  imports: any[];
  providers: any[];
  componentUT: Type<C>;
}

export const baseSetup = <C extends JsonFormsControl>(
  testConfig: TestConfig<C>
) => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [testConfig.componentUT],
      imports: testConfig.imports,
      providers: [JsonFormsAngularService].concat(testConfig.providers),
    }).compileComponents();
  });
};

export interface TestData<T extends UISchemaElement> {
  data: any;
  schema: JsonSchema;
  uischema: T;
  errors?: ErrorObject[];
  renderers?: JsonFormsRendererRegistryEntry[];
}

export const getJsonFormsService = (
  component: JsonFormsControl
): JsonFormsAngularService => {
  return (component as any).jsonFormsService as JsonFormsAngularService;
};

export const setupMockStore = (
  fixture: ComponentFixture<any>,
  testData: TestData<UISchemaElement>
): void => {
  const component = fixture.componentInstance;
  component.uischema = testData.uischema;
  component.schema = testData.schema;

  getJsonFormsService(component).init({
    core: {
      data: testData.data,
      schema: testData.schema,
      errors: testData.errors,
      uischema: testData.uischema,
    },
  });
  getJsonFormsService(component).registerRenderers(testData.renderers);
};
