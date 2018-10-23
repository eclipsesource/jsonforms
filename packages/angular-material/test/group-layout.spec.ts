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
import { MockNgRedux } from '@angular-redux/store/lib/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JsonFormsOutlet, UnknownRenderer } from '@jsonforms/angular';
import { GroupLayout, UISchemaElement } from '@jsonforms/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MatCard, MatCardTitle } from '@angular/material';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import {
  GroupLayoutRenderer,
  groupLayoutTester
} from '../src/layouts/group-layout.renderer';

describe('Group layout tester', () => {
  it('should succeed', () => {
    expect(groupLayoutTester({ type: 'Group' }, undefined)).toBe(1);
  });
});
describe('Group layout', () => {
  let fixture: ComponentFixture<any>;
  let component: any;

  beforeEach(() => {
      TestBed.configureTestingModule({
          declarations: [
              GroupLayoutRenderer,
              UnknownRenderer,
              JsonFormsOutlet,
              MatCard,
              MatCardTitle
          ],
          imports: [],
          providers: [
              { provide: NgRedux, useFactory: MockNgRedux.getInstance }
          ]
      }).overrideModule(BrowserDynamicTestingModule, {
          set: {
              entryComponents: [
                  UnknownRenderer
              ]
          }
      }).compileComponents();
      MockNgRedux.reset();
      fixture = TestBed.createComponent(GroupLayoutRenderer);
      component = fixture.componentInstance;
  });

  it('render with undefined elements', () => {
    const uischema: UISchemaElement = {
      type: 'Group'
    };
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: {},
          schema: {},
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    const card: DebugElement[] = fixture.debugElement.queryAll(By.directive(MatCard));
    // title
    expect(card[0].nativeElement.children.length).toBe(1);
  });

  it('render with null elements', () => {
    const uischema: GroupLayout = {
      type: 'Group',
      elements: null
    };
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: {},
          schema: {},
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    const card: DebugElement[] = fixture.debugElement.queryAll(By.directive(MatCard));
    // title
    expect(card[0].nativeElement.children.length).toBe(1);
  });

  it('render with children', () => {
    const uischema: GroupLayout = {
      type: 'Group',
      label: 'foo',
      elements: [
        { type: 'Control' },
        { type: 'Control' }
      ]
    };
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: {},
          schema: {},
        },
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    const card: DebugElement[] = fixture.debugElement.queryAll(By.directive(MatCard));
    // title + 2 controls
    expect(card[0].nativeElement.children.length).toBe(3);
  });
});
