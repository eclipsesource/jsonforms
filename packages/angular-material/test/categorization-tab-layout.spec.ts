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
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  MatTab,
  MatTabBody,
  MatTabGroup,
  MatTabsModule,
} from '@angular/material/tabs';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  JsonFormsAngularService,
  JsonFormsModule,
  JsonFormsOutlet,
} from '@jsonforms/angular';
import {
  CategorizationTabLayoutRenderer,
  TextControlRenderer,
  TextControlRendererTester,
} from '../src';
import { setupMockStore, getJsonFormsService } from './common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { initTestEnvironment } from './test';

const renderers = [
  { tester: TextControlRendererTester, renderer: TextControlRenderer },
];

initTestEnvironment();

describe('Categorization tab layout', () => {
  let fixture: ComponentFixture<any>;
  let component: any;

  const data = { foo: 'true' };
  const schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'string',
      },
      bar: {
        type: 'string',
      },
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CategorizationTabLayoutRenderer, TextControlRenderer],
      imports: [
        CommonModule,
        MatTabsModule,
        NoopAnimationsModule,
        JsonFormsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
      providers: [JsonFormsAngularService],
    }).compileComponents();

    fixture = TestBed.createComponent(CategorizationTabLayoutRenderer);
    component = fixture.componentInstance;
  }));

  it('render categories initially', waitForAsync(() => {
    const uischema = {
      type: 'Categorization',
      elements: [
        {
          type: 'Category',
          label: 'foo',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/foo',
            },
            {
              type: 'Control',
              scope: '#/properties/bar',
            },
          ],
        },
        {
          type: 'Category',
          label: 'bar',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/bar',
            },
          ],
        },
      ],
    };

    setupMockStore(fixture, { uischema, schema, data });

    fixture.detectChanges();
    fixture.whenRenderingDone().then(() => {
      fixture.detectChanges();
      const tabGroupDE: DebugElement[] = fixture.debugElement.queryAll(
        By.directive(MatTabGroup)
      );
      expect(tabGroupDE.length).toBe(1);
      const tabGroup: MatTabGroup = tabGroupDE[0].componentInstance;
      expect(tabGroup._tabs.length).toBe(2);
      const tab1: MatTab = tabGroup._tabs.first;
      const tab2: MatTab = tabGroup._tabs.last;
      expect(tab1.isActive).toBeTruthy();
      expect(tab2.isActive).toBeFalsy();
      expect(tab1.textLabel).toBe('foo');
      expect(tab2.textLabel).toBe('bar');
      expect(tab1.isActive).toBeTruthy();
      expect(tab2.isActive).toBeFalsy();
      expect(tab1.content.isAttached).toBeTruthy();
      expect(tab2.content.isAttached).toBeFalsy();

      const contents: DebugElement[] = fixture.debugElement.queryAll(
        By.directive(MatTabBody)
      );
      const activeTabOutlets = contents[0].queryAll(
        By.directive(JsonFormsOutlet)
      );
      expect(activeTabOutlets.length).toBe(2);

      expect(fixture.nativeElement.children[0].style.display).not.toBe('none');
    });
  }));

  it('pass path and schema to children', waitForAsync(() => {
    const uischema = {
      type: 'Categorization',
      elements: [
        {
          type: 'Category',
          label: 'foo',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/foo',
            },
          ],
        },
      ],
    };
    setupMockStore(fixture, { uischema, schema, data });
    component.path = 'aa';
    const subSchema = { type: 'string' };
    component.schema = subSchema;
    getJsonFormsService(component).init({
      renderers: renderers,
      core: {
        data: {},
        schema: schema,
        uischema: undefined,
      },
    });

    fixture.detectChanges();
    fixture.whenRenderingDone().then(() => {
      const contents: DebugElement[] = fixture.debugElement.queryAll(
        By.directive(MatTabBody)
      );
      const activeTabOutlets = contents[0].queryAll(
        By.directive(TextControlRenderer)
      );
      expect(activeTabOutlets[0].componentInstance.path).toBe('aa');
      expect(activeTabOutlets[0].componentInstance.schema).toBe(subSchema);
    });
  }));

  it('add category', waitForAsync(() => {
    const uischema = {
      type: 'Categorization',
      elements: [
        {
          type: 'Category',
          label: 'foo',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/foo',
            },
            {
              type: 'Control',
              scope: '#/properties/bar',
            },
          ],
        },
        {
          type: 'Category',
          label: 'bar',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/bar',
            },
          ],
        },
      ],
    };
    setupMockStore(fixture, { uischema, schema, data });
    fixture.detectChanges();
    fixture.whenRenderingDone().then(() => {
      fixture.detectChanges();
      const tabGroupDE: DebugElement[] = fixture.debugElement.queryAll(
        By.directive(MatTabGroup)
      );
      const tabGroup: MatTabGroup = tabGroupDE[0].componentInstance;
      expect(tabGroup._tabs.length).toBe(2);

      const newUischema = {
        type: 'Categorization',
        elements: [
          {
            type: 'Category',
            label: 'foo',
            elements: [
              {
                type: 'Control',
                scope: '#/properties/foo',
              },
            ],
          },
          {
            type: 'Category',
            label: 'bar',
            elements: [
              {
                type: 'Control',
                scope: '#/properties/bar',
              },
            ],
          },
          {
            type: 'Category',
            label: 'quux',
            elements: [
              {
                type: 'Control',
                scope: '#/properties/bar',
              },
            ],
          },
        ],
      };
      component.uischema = newUischema;
      fixture.detectChanges();
      getJsonFormsService(component).setUiSchema(newUischema);

      fixture.whenRenderingDone().then(() => {
        fixture.detectChanges();
        const tabGroupDE2: DebugElement[] = fixture.debugElement.queryAll(
          By.directive(MatTabGroup)
        );
        const tabGroup2: MatTabGroup = tabGroupDE2[0].componentInstance;
        expect(tabGroup2._tabs.length).toBe(3);
        const lastTab: MatTab = tabGroup2._tabs.last;
        expect(lastTab.isActive).toBeFalsy();
        expect(lastTab.textLabel).toBe('quux');
      });
    });
  }));

  // TODO: broken due to https://github.com/angular/flex-layout/issues/848
  xit('can be hidden', waitForAsync(() => {
    const uischema = {
      type: 'Categorization',
      elements: [
        {
          type: 'Category',
          label: 'foo',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/foo',
            },
            {
              type: 'Control',
              scope: '#/properties/bar',
            },
          ],
        },
        {
          type: 'Category',
          label: 'bar',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/bar',
            },
          ],
        },
      ],
    };
    setupMockStore(fixture, { uischema, schema, data });
    component.visible = false;
    fixture.detectChanges();
    fixture.whenRenderingDone().then(() => {
      expect(fixture.nativeElement.children[0].style.display).toBe('none');
    });
  }));
});
