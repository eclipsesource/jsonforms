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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JsonSchema, LabelElement } from '@jsonforms/core';

import { LabelRenderer, LabelRendererTester } from '../src/other';

const data = {};
const schema: JsonSchema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string'
    }
  }
};
const uischema: LabelElement = {
  type: 'Label',
  text: 'FooBar'
};

describe('Material label field tester', () => {
  it('should succeed', () => {
    expect(LabelRendererTester(uischema, schema)).toBe(4);
  });
});
const providers = [{ provide: NgRedux, useFactory: MockNgRedux.getInstance }];
const componentUT: any = LabelRenderer;

describe('Label Renderer Base Tests', () => {
  let fixture: ComponentFixture<LabelRenderer>;
  let component: LabelRenderer;
  let labelElement: HTMLLabelElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [componentUT],
      providers: providers
    }).compileComponents();

    MockNgRedux.reset();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(componentUT);
    component = fixture.componentInstance;

    labelElement = fixture.debugElement.query(By.css('label')).nativeElement;
  });

  it('should render', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: data,
          schema: schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    expect(labelElement.innerText.trim()).toBe('FooBar');
  });
});
