/*
  The MIT License
  
  Copyright (c) 2023-2023 EclipseSource Munich
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NumberControlRenderer } from '../src';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { baseSetup, getJsonFormsService, prepareComponent } from './common';
import { initTestEnvironment } from './test';

const imports = [
  MatFormFieldModule,
  MatInputModule,
  NoopAnimationsModule,
  ReactiveFormsModule,
];
const providers = [JsonFormsAngularService];
const componentUT: any = NumberControlRenderer;
const testConfig = { imports, providers, componentUT };

initTestEnvironment();

describe('middleware tests', () => {
  let component: JsonFormsControl;
  const startingValues = {
    core: {
      data: 'startValue',
      schema: { type: 'string' },
      uischema: {
        type: 'control',
      },
    },
  };

  baseSetup(testConfig);

  beforeEach(() => {
    const preparedComponents = prepareComponent(testConfig, 'input');
    component = preparedComponents.component;
  });

  it('init using middleware', () => {
    const jsonFormsService: JsonFormsAngularService =
      getJsonFormsService(component);
    const spyMiddleware = jasmine.createSpy('spy1').and.returnValue({
      data: 4,
      schema: { type: 'number' },
      uischema: {
        type: 'VerticalLayout',
        elements: [
          {
            type: 'Control',
          },
        ],
      },
    });
    jsonFormsService.init(startingValues, spyMiddleware);
    expect(spyMiddleware).toHaveBeenCalled();
    const core = jsonFormsService.getState().jsonforms.core;
    expect(core?.data).toBe(4);
    expect(core?.schema.type).toBe('number');
    expect(core?.uischema.type).toBe('VerticalLayout');
  });
});
