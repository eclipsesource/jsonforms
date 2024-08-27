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
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JsonFormsAngularService, JsonFormsModule } from '@jsonforms/angular';
import { ControlElement } from '@jsonforms/core';
import { TextControlRenderer, TextControlRendererTester } from '../src';
import {
  GetProps,
  TableRenderer,
  TableRendererTester,
} from '../src/library/other/table.renderer';
import { setupMockStore } from './common';
import { createTesterContext } from './util';
import { MatTooltipModule } from '@angular/material/tooltip';
import { initTestEnvironment } from './test';

const uischema1: ControlElement = { type: 'Control', scope: '#' };
const uischema2: ControlElement = {
  type: 'Control',
  scope: '#/properties/my',
};
const uischemaWithSorting: ControlElement = {
  type: 'Control',
  scope: '#',
  options: {
    showSortButtons: true,
  },
};
const schema_object1 = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      foo: { type: 'string' },
      bar: { type: 'string' },
    },
  },
};
const schema_object2 = {
  type: 'object',
  properties: {
    my: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          foo: { type: 'string' },
          bar: { type: 'string' },
        },
      },
    },
  },
};
const schema_simple1 = {
  type: 'array',
  items: {
    type: 'string',
  },
};
const schema_simple2 = {
  type: 'object',
  properties: {
    my: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
};
const renderers = [
  { tester: TextControlRendererTester, renderer: TextControlRenderer },
  { tester: TableRendererTester, renderer: TableRenderer },
];

initTestEnvironment();

describe('Table tester', () => {
  it('should succeed', () => {
    expect(
      TableRendererTester(
        uischema1,
        schema_object1,
        createTesterContext(schema_object1)
      )
    ).toBe(3);
    expect(
      TableRendererTester(
        uischema1,
        schema_simple1,
        createTesterContext(schema_simple1)
      )
    ).toBe(3);
    expect(
      TableRendererTester(
        uischema2,
        schema_object2,
        createTesterContext(schema_object2)
      )
    ).toBe(3);
    expect(
      TableRendererTester(
        uischema2,
        schema_simple2,
        createTesterContext(schema_simple2)
      )
    ).toBe(3);
  });
});
describe('Table', () => {
  let fixture: ComponentFixture<any>;
  let component: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TableRenderer, TextControlRenderer, GetProps],
      imports: [
        CommonModule,
        JsonFormsModule,
        MatCardModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        MatTableModule,
        MatTooltipModule,
      ],
      providers: [JsonFormsAngularService],
    }).compileComponents();

    fixture = TestBed.createComponent(TableRenderer);
    component = fixture.componentInstance;
  }));

  it('renders object array on root', waitForAsync(() => {
    setupMockStore(fixture, {
      uischema: uischema1,
      schema: schema_object1,
      data: [
        { foo: 'foo_1', bar: 'bar_1' },
        { foo: 'foo_2', bar: 'bar_2' },
      ],
      renderers,
    });
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      // 2 columns
      expect(fixture.nativeElement.querySelectorAll('th').length).toBe(3);
      // 1 head row and 2 data rows
      expect(fixture.nativeElement.querySelectorAll('tr').length).toBe(1 + 2);
      // 4 data entries
      expect(fixture.nativeElement.querySelectorAll('td').length).toBe(6);
    });
  }));
  it('renders object array on path', waitForAsync(() => {
    setupMockStore(fixture, {
      uischema: uischema2,
      schema: schema_object2,
      data: {
        my: [
          { foo: 'foo_1', bar: 'bar_1' },
          { foo: 'foo_2', bar: 'bar_2' },
        ],
      },
      renderers,
    });

    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      // 2 columns
      expect(fixture.nativeElement.querySelectorAll('th').length).toBe(3);
      // 1 head row and 2 data rows
      expect(fixture.nativeElement.querySelectorAll('tr').length).toBe(1 + 2);
      // 4 data entries
      expect(fixture.nativeElement.querySelectorAll('td').length).toBe(6);
    });
  }));

  it('renders simple array on root', waitForAsync(() => {
    setupMockStore(fixture, {
      uischema: uischema1,
      schema: schema_simple1,
      data: ['foo', 'bar'],
      renderers,
    });
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      // 1 column
      expect(fixture.nativeElement.querySelectorAll('th').length).toBe(2);
      // 1 head row and 2 data rows
      expect(fixture.nativeElement.querySelectorAll('tr').length).toBe(1 + 2);
      // 2 data entries
      expect(fixture.nativeElement.querySelectorAll('td').length).toBe(4);
    });
  }));
  it('renders simple array on path', waitForAsync(() => {
    setupMockStore(fixture, {
      uischema: uischema2,
      schema: schema_simple2,
      data: { my: ['foo', 'bar'] },
      renderers,
    });
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      // 1 columns
      expect(fixture.nativeElement.querySelectorAll('th').length).toBe(2);
      // 1 head row and 2 data rows
      expect(fixture.nativeElement.querySelectorAll('tr').length).toBe(1 + 2);
      // 2 data entries
      expect(fixture.nativeElement.querySelectorAll('td').length).toBe(4);
    });
  }));

  it('can be disabled', waitForAsync(() => {
    setupMockStore(fixture, {
      uischema: uischema1,
      schema: schema_object1,
      data: [{ foo: 'foo_1', bar: 'bar_1' }],
      renderers,
    });
    component.disabled = true;
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelectorAll('input').length).toBe(2);
      expect(
        fixture.nativeElement.querySelectorAll('input')[0].disabled
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelectorAll('input')[1].disabled
      ).toBeTruthy();
    });
  }));
  it('should be enabled by default', waitForAsync(() => {
    setupMockStore(fixture, {
      uischema: uischema1,
      schema: schema_object1,
      data: [{ foo: 'foo_1', bar: 'bar_1' }],
      renderers,
    });
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      component.add();
      expect(fixture.nativeElement.querySelectorAll('input').length).toBe(2);
      expect(fixture.nativeElement.querySelector('input').disabled).toBeFalsy();
    });
  }));

  it('renderer handles removing of rows', waitForAsync(() => {
    setupMockStore(fixture, {
      uischema: uischema1,
      schema: schema_object1,
      data: [
        { foo: 'foo_1', bar: 'bar_1' },
        { foo: 'foo_2', bar: 'bar_2' },
      ],
      renderers,
    });

    fixture.detectChanges();
    component.ngOnInit();
    component.remove(0);
    component.remove(0);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      // 1 row
      expect(fixture.nativeElement.querySelectorAll('tr').length).toBe(1 + 0);
    });
  }));

  it('renderer handles adding of rows', waitForAsync(() => {
    setupMockStore(fixture, {
      uischema: uischema1,
      schema: schema_object1,
      data: [
        { foo: 'foo_1', bar: 'bar_1' },
        { foo: 'foo_2', bar: 'bar_2' },
      ],
      renderers,
    });

    fixture.detectChanges();
    component.ngOnInit();

    component.add();
    component.add();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      // 3 row
      expect(fixture.nativeElement.querySelectorAll('tr').length).toBe(1 + 4);
    });
  }));

  it('when disabled doesnt render `add` nor `remove` icons', waitForAsync(() => {
    setupMockStore(fixture, {
      uischema: uischema1,
      schema: schema_object1,
      data: [
        { foo: 'foo_1', bar: 'bar_1' },
        { foo: 'foo_2', bar: 'bar_2' },
      ],
      renderers,
    });
    component.disabled = true;
    fixture.detectChanges();

    component.ngOnInit();
    fixture.whenStable().then(() => {
      // 2 columns
      expect(fixture.nativeElement.querySelectorAll('th').length).toBe(2);
      // 2 rows
      expect(fixture.nativeElement.querySelectorAll('tr').length).toBe(1 + 2);
      // 2 data entries
      expect(fixture.nativeElement.querySelectorAll('td').length).toBe(4);
    });
  }));
  it('when options.showSortButtons is True, it should render sort buttons', waitForAsync(() => {
    setupMockStore(fixture, {
      uischema: uischemaWithSorting,
      schema: schema_simple1,
      data: ['foo', 'bar'],
      renderers,
    });
    component.disabled = false;
    fixture.detectChanges();

    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelectorAll('.item-up').length).toBe(2);
      expect(fixture.nativeElement.querySelectorAll('.item-down').length).toBe(
        2
      );
    });
  }));
  it('when options.showSortButtons is False, it should NOT render sort buttons', waitForAsync(() => {
    setupMockStore(fixture, {
      uischema: uischema1,
      schema: schema_simple1,
      data: ['foo', 'bar'],
      renderers,
    });
    component.disabled = false;
    fixture.detectChanges();

    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelectorAll('.item-up').length).toBe(0);
      expect(fixture.nativeElement.querySelectorAll('.item-down').length).toBe(
        0
      );
    });
  }));
});
