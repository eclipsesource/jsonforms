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
import { ComponentFixture, waitForAsync } from '@angular/core/testing';
import { UISchemaElement } from '@jsonforms/core';
import { beforeEachLayoutTest, setupMockStore } from './common';
import {
  ArrayLayoutRenderer,
  ArrayLayoutRendererTester,
} from '../src/library/layouts/array-layout.renderer';
import { LayoutChildrenRenderPropsPipe } from '../src/library/layouts/layout.renderer';

const TEST_SCHEMA = {
  type: 'object',
  properties: {
    test: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          test1: {
            type: 'string',
            title: 'Test 1',
          },
          test2: {
            type: 'string',
            title: 'Test 2',
            $dataciteRequired: false,
          },
        },
      },
    },
  },
  required: ['test'],
};

describe('Array layout tester', () => {
  it('should succeed', () => {
    expect(ArrayLayoutRendererTester(undefined, undefined)).toBe(1);
  });
});
describe.only('Array layout', () => {
  let fixture: ComponentFixture<any>;

  beforeEach(waitForAsync(() => {
    fixture = beforeEachLayoutTest(ArrayLayoutRenderer, {
      declarations: [LayoutChildrenRenderPropsPipe],
    });
  }));

  it('render with undefined elements', () => {
    const uischema: UISchemaElement = {
      type: 'Control',
      scope: '#/properties/test',
    };
    setupMockStore(fixture, {
      data: {},
      schema: TEST_SCHEMA,
      uischema,
    });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].children.length).toBe(0);
  });

  it('render with null elements', () => {
    const uischema = {
      type: 'Control',
      elements: null,
    };
    setupMockStore(fixture, {
      data: {},
      schema: TEST_SCHEMA,
      uischema,
    });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].children.length).toBe(0);
  });

  it('render with children', () => {
    const uischema = {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/test',
          options: {
            detail: {
              type: 'HorizontalLayout',
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/test1',
                },
                {
                  type: 'Control',
                  scope: '#/properties/test2',
                },
              ],
            },
          },
        },
      ],
    };
    setupMockStore(fixture, {
      data: {},
      schema: TEST_SCHEMA,
      uischema,
    });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].children.length).toBe(2);
    expect(fixture.nativeElement.children[0].hidden).toBe(false);

    fixture.whenRenderingDone().then(() => {
      fixture.detectChanges();

      const arrayLayoutElement: HTMLElement = fixture.nativeElement;
      const matBadgeElement =
        arrayLayoutElement.querySelector('.mat-badge-content')!;

      expect(matBadgeElement.textContent).toBe('1');
    });
  });
});
