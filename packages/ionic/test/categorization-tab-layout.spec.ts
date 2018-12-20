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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { IonicModule, IonicPageModule, Platform, Tab } from 'ionic-angular';
import { JsonFormsOutlet, UnknownRenderer } from '@jsonforms/angular';
import {
  CategorizationTabLayoutRenderer,
  CategoryRenderer,
  StringControlRenderer,
  stringControlTester
} from '../src';
import { PlatformMock } from '../test-config/mocks-ionic';
import { ParamsService } from '../src/services/ParamsService';

describe('Categorization tab layout', () => {
  let fixture: ComponentFixture<any>;
  let component: any;

  const data = { foo: true };
  const schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string'
      },
      bar: {
        type: 'string'
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        JsonFormsOutlet,
        CategorizationTabLayoutRenderer,
        CategoryRenderer,
        UnknownRenderer,
        StringControlRenderer
      ],
      imports: [
        IonicModule.forRoot(CategorizationTabLayoutRenderer),
        IonicPageModule.forChild(CategoryRenderer)
      ],
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: NgRedux, useFactory: MockNgRedux.getInstance },
        { provide: ParamsService, useClass: ParamsService }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [StringControlRenderer, UnknownRenderer]
        }
      })
      .compileComponents();

    MockNgRedux.reset();
    fixture = TestBed.createComponent(CategorizationTabLayoutRenderer);
    component = fixture.componentInstance;
  });

  it('render categories initially', async(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = {
      type: 'Categorization',
      elements: [
        {
          type: 'Category',
          label: 'foo',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/foo'
            }
          ]
        },
        {
          type: 'Category',
          label: 'bar',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/bar'
            }
          ]
        }
      ]
    };

    component.ngOnInit();
    mockSubStore.next({
      jsonforms: {
        core: {
          data,
          schema
        },
        renderers: [
          { tester: stringControlTester, renderer: StringControlRenderer }
        ]
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();

    fixture.whenRenderingDone().then(() => {
      fixture.detectChanges();
      const activateCategory: DebugElement[] = fixture.debugElement.queryAll(
        By.directive(CategoryRenderer)
      );
      const ionTabs: DebugElement[] = fixture.debugElement.queryAll(
        By.directive(Tab)
      );
      expect(activateCategory.length).toBe(1);
      expect(ionTabs.length).toBe(2);
    });
  }));

  it('add category', async(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = {
      type: 'Categorization',
      elements: [
        {
          type: 'Category',
          label: 'foo',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/foo'
            }
          ]
        },
        {
          type: 'Control',
          label: 'bar',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/bar'
            }
          ]
        }
      ]
    };

    component.ngOnInit();
    mockSubStore.next({
      jsonforms: {
        core: {
          data,
          schema
        },
        renderers: [
          { tester: stringControlTester, renderer: StringControlRenderer }
        ]
      }
    });
    fixture.detectChanges();
    fixture.whenRenderingDone().then(() => {
      fixture.detectChanges();
      const activateCategory: DebugElement[] = fixture.debugElement.queryAll(
        By.directive(CategoryRenderer)
      );
      const ionTabs: DebugElement[] = fixture.debugElement.queryAll(
        By.directive(Tab)
      );
      expect(activateCategory.length).toBe(1);
      expect(ionTabs.length).toBe(2);

      component.uischema = {
        type: 'Categorization',
        elements: [
          {
            type: 'Category',
            label: 'foo',
            elements: [
              {
                type: 'Control',
                scope: '#/properties/foo'
              }
            ]
          },
          {
            type: 'Control',
            label: 'bar',
            elements: [
              {
                type: 'Control',
                scope: '#/properties/bar'
              }
            ]
          },
          {
            type: 'Control',
            label: 'quux',
            elements: [
              {
                type: 'Control',
                scope: '#/properties/bar'
              }
            ]
          }
        ]
      };
      mockSubStore.next({
        jsonforms: {
          core: {
            data,
            schema
          },
          renderers: [
            { tester: stringControlTester, renderer: StringControlRenderer }
          ]
        }
      });
      mockSubStore.complete();
      fixture.detectChanges();

      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();
        const ionTabs2: DebugElement[] = fixture.debugElement.queryAll(
          By.directive(Tab)
        );
        expect(ionTabs2.length).toBe(3);
      });
    });
  }));
});
