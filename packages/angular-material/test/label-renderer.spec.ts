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
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JsonSchema, LabelElement } from '@jsonforms/core';

import { LabelRenderer, LabelRendererTester } from '../src/library/other';
import { setupMockStore } from './common';
import { JsonFormsAngularService } from '@jsonforms/angular';
import { initTestEnvironment } from './test';

const data = {};
const schema: JsonSchema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
    },
  },
};
const uischema: LabelElement = {
  type: 'Label',
  text: 'FooBar',
};

initTestEnvironment();

describe('Material label field tester', () => {
  it('should succeed', () => {
    expect(LabelRendererTester(uischema, schema, undefined)).toBe(4);
  });
});
const providers = [JsonFormsAngularService];
const componentUT: any = LabelRenderer;

describe('Label Renderer Base Tests', () => {
  let fixture: ComponentFixture<LabelRenderer>;
  let component: LabelRenderer;
  let labelElement: HTMLLabelElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [componentUT],
      providers: providers,
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(componentUT);
    component = fixture.componentInstance;

    labelElement = fixture.debugElement.query(By.css('label')).nativeElement;
  });

  it('should render', () => {
    setupMockStore(fixture, { uischema, schema, data });
    fixture.detectChanges();
    component.ngOnInit();
    expect(labelElement.innerText.trim()).toBe('FooBar');
  });
});
