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
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JsonFormsAngularService, JsonFormsModule } from '@jsonforms/angular';
import { ControlElement } from '@jsonforms/core';
import {
  GroupLayoutRenderer,
  groupLayoutTester,
  TextControlRenderer,
  TextControlRendererTester,
  VerticalLayoutRenderer,
  verticalLayoutTester,
} from '../src';
import {
  ObjectControlRenderer,
  ObjectControlRendererTester,
} from '../src/library/other/object.renderer';
import { getJsonFormsService } from './common';
import { LayoutChildrenRenderPropsPipe } from '../src/library/layouts/layout.renderer';
import { initTestEnvironment } from './test';

const uischema1: ControlElement = { type: 'Control', scope: '#' };
const uischema2: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
};
const schema1 = {
  type: 'object',
  properties: {
    foo: { type: 'string' },
  },
};
const schema2 = {
  type: 'object',
  properties: {
    foo: {
      type: 'object',
      properties: {
        foo_1: { type: 'string' },
      },
    },
    bar: {
      type: 'object',
      properties: {
        bar_1: { type: 'string' },
      },
    },
  },
};
const renderers = [
  { tester: TextControlRendererTester, renderer: TextControlRenderer },
  { tester: verticalLayoutTester, renderer: VerticalLayoutRenderer },
  { tester: groupLayoutTester, renderer: GroupLayoutRenderer },
  { tester: ObjectControlRendererTester, renderer: ObjectControlRenderer },
];

initTestEnvironment();

describe('Object Control tester', () => {
  it('should succeed', () => {
    expect(ObjectControlRendererTester(uischema1, schema1, undefined)).toBe(2);
    expect(ObjectControlRendererTester(uischema2, schema2, undefined)).toBe(2);
  });
});
describe('Object Control', () => {
  let fixture: ComponentFixture<any>;
  let component: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ObjectControlRenderer,
        TextControlRenderer,
        VerticalLayoutRenderer,
        GroupLayoutRenderer,
        LayoutChildrenRenderPropsPipe,
      ],
      imports: [
        CommonModule,
        JsonFormsModule,
        MatCardModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
      providers: [JsonFormsAngularService],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectControlRenderer);
    component = fixture.componentInstance;
  }));

  it('object control creates group', waitForAsync(() => {
    component.uischema = uischema2;
    component.schema = schema2;

    getJsonFormsService(component).init({
      renderers: renderers,
      core: {
        data: {},
        schema: schema2,
        uischema: undefined,
      },
    });
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      // one for the object renderer and one for the group
      expect(fixture.nativeElement.querySelectorAll('mat-card').length).toBe(2);
      expect(
        fixture.nativeElement.querySelectorAll('mat-card-title')[0].textContent
      ).toBe('Foo');
    });
  }));

  it('render all elements', waitForAsync(() => {
    component.uischema = uischema1;
    component.schema = schema2;

    getJsonFormsService(component).init({
      core: {
        data: {},
        schema: schema2,
        uischema: undefined,
      },
    });
    getJsonFormsService(component).registerRenderers(renderers);

    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelectorAll('input').length).toBe(2);
    });
  }));

  it('render only own elements', waitForAsync(() => {
    component.uischema = uischema2;
    component.schema = schema2;

    getJsonFormsService(component).init({
      core: {
        data: {},
        schema: schema2,
        uischema: undefined,
      },
    });
    getJsonFormsService(component).registerRenderers(renderers);
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelectorAll('input').length).toBe(1);
    });
  }));

  xit('can be disabled', waitForAsync(() => {
    component.uischema = uischema1;
    component.schema = schema1;
    component.disabled = true;

    getJsonFormsService(component).init({
      core: {
        data: {},
        schema: schema1,
        uischema: undefined,
      },
    });
    getJsonFormsService(component).registerRenderers(renderers);
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('input').disabled).toBe(true);
    });
  }));
  xit('should be enabled by default', waitForAsync(() => {
    component.uischema = uischema1;
    component.schema = schema1;

    getJsonFormsService(component).init({
      core: {
        data: {},
        schema: schema1,
        uischema: undefined,
      },
    });
    getJsonFormsService(component).registerRenderers(renderers);
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenRenderingDone().then(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('input').disabled).toBeFalsy();
    });
  }));
});
