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
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/lib/testing';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JsonFormsModule } from '@jsonforms/angular';
import { ControlElement } from '@jsonforms/core';
import {
  GroupLayoutRenderer,
  groupLayoutTester,
  TextControlRenderer,
  TextControlRendererTester,
  VerticalLayoutRenderer,
  verticalLayoutTester
} from '../src';
import {
  ObjectControlRenderer,
  ObjectControlRendererTester
} from '../src/other/object.renderer';

const uischema1: ControlElement = { type: 'Control', scope: '#' };
const uischema2: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};
const schema1 = {
  type: 'object',
  properties: {
    foo: { type: 'string' }
  }
};
const schema2 = {
  type: 'object',
  properties: {
    foo: {
      type: 'object',
      properties: {
        foo_1: { type: 'string' }
      }
    },
    bar: {
      type: 'object',
      properties: {
        bar_1: { type: 'string' }
      }
    }
  }
};
const renderers = [
  { tester: TextControlRendererTester, renderer: TextControlRenderer },
  { tester: verticalLayoutTester, renderer: VerticalLayoutRenderer },
  { tester: groupLayoutTester, renderer: GroupLayoutRenderer }
];

describe('Object Control tester', () => {
  it('should succeed', () => {
    expect(ObjectControlRendererTester(uischema1, schema1)).toBe(2);
    expect(ObjectControlRendererTester(uischema2, schema2)).toBe(2);
  });
});
describe('Object Control', () => {
  let fixture: ComponentFixture<any>;
  let component: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ObjectControlRenderer,
        TextControlRenderer,
        VerticalLayoutRenderer,
        GroupLayoutRenderer
      ],
      imports: [
        CommonModule,
        JsonFormsModule,
        NgReduxModule,
        MatCardModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FlexLayoutModule
      ],
      providers: [{ provide: NgRedux, useFactory: MockNgRedux.getInstance }]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [
            TextControlRenderer,
            VerticalLayoutRenderer,
            GroupLayoutRenderer
          ]
        }
      })
      .compileComponents();

    MockNgRedux.reset();
    fixture = TestBed.createComponent(ObjectControlRenderer);
    component = fixture.componentInstance;
  }));

  it('object control creates group', async(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema2;
    component.schema = schema2;

    mockSubStore.next({
      jsonforms: {
        renderers: renderers,
        core: {
          data: {},
          schema: schema2
        }
      }
    });
    mockSubStore.complete();
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

  it('render all elements', async(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema1;
    component.schema = schema2;

    mockSubStore.next({
      jsonforms: {
        renderers: renderers,
        core: {
          data: {},
          schema: schema2
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelectorAll('input').length).toBe(2);
    });
  }));

  it('render only own elements', async(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema2;
    component.schema = schema2;

    mockSubStore.next({
      jsonforms: {
        renderers: renderers,
        core: {
          data: {},
          schema: schema2
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelectorAll('input').length).toBe(1);
    });
  }));

  xit('can be disabled', async(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema1;
    component.schema = schema1;
    component.disabled = true;

    mockSubStore.next({
      jsonforms: {
        renderers: renderers,
        core: {
          data: {},
          schema: schema1
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('input').disabled).toBe(true);
    });
  }));
  xit('should be enabled by default', async(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema1;
    component.schema = schema1;

    mockSubStore.next({
      jsonforms: {
        renderers: renderers,
        core: {
          data: {},
          schema: schema1
        }
      }
    });
    component.ngOnInit();
    mockSubStore.complete();
    fixture.detectChanges();
    fixture.whenRenderingDone().then(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('input').disabled).toBeFalsy();
    });
  }));
});
