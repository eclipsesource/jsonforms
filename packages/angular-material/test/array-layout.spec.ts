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
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, waitForAsync } from '@angular/core/testing';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { MatTooltip } from '@angular/material/tooltip';
import {
  MatCard,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { Actions, Layout } from '@jsonforms/core';
import cloneDeep from 'lodash/cloneDeep';
import {
  beforeEachLayoutTest,
  getJsonFormsService,
  setupMockStore,
} from './common';
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
          },
        },
        required: ['test1', 'test2'],
      },
    },
  },
  required: ['test'],
};

const TEST_UISCHEMA = {
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
};

describe('Array layout tester', () => {
  it('should succeed', () => {
    expect(
      ArrayLayoutRendererTester(TEST_UISCHEMA, TEST_SCHEMA, {
        config: {},
        rootSchema: {},
      })
    ).toBe(4);
  });
});
const TEST_BED_CONFIG = {
  declarations: [LayoutChildrenRenderPropsPipe],
  imports: [
    MatIcon,
    MatBadge,
    MatTooltip,
    MatCard,
    MatCardContent,
    MatCardActions,
  ],
};

describe('Array layout', () => {
  let fixture: ComponentFixture<any>;

  beforeEach(waitForAsync(() => {
    fixture = beforeEachLayoutTest(ArrayLayoutRenderer, TEST_BED_CONFIG);
  }));

  it('render with no data the error count should be 1', () => {
    setupMockStore(fixture, {
      data: {},
      schema: TEST_SCHEMA,
      uischema: TEST_UISCHEMA,
    });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].children.length).toBe(2);

    fixture.whenRenderingDone().then(() => {
      fixture.detectChanges();

      const arrayLayoutElement: HTMLElement = fixture.nativeElement;
      const matBadgeElement =
        arrayLayoutElement.querySelector('.mat-badge-content');

      const noDataElement = arrayLayoutElement.children[0].children[1];

      expect(matBadgeElement?.textContent).toBe('1');
      expect(noDataElement.textContent).toBe('No data');
    });
  });

  it('render with data that contains empty required fields should show proper error count', () => {
    setupMockStore(fixture, {
      data: { test: [{}] },
      schema: TEST_SCHEMA,
      uischema: TEST_UISCHEMA,
    });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].children.length).toBe(2);

    fixture.whenRenderingDone().then(() => {
      fixture.detectChanges();

      const arrayLayoutElement: HTMLElement = fixture.nativeElement;
      const matBadgeElement =
        arrayLayoutElement.querySelector('.mat-badge-content');

      expect(matBadgeElement?.textContent).toBe('2');
    });
  });

  it('render with more data that contains empty required fields should show proper error count', () => {
    setupMockStore(fixture, {
      data: { test: [{}, {}] },
      schema: TEST_SCHEMA,
      uischema: TEST_UISCHEMA,
    });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].children.length).toBe(3);

    fixture.whenRenderingDone().then(() => {
      fixture.detectChanges();

      const arrayLayoutElement: HTMLElement = fixture.nativeElement;
      const matBadgeElement =
        arrayLayoutElement.querySelector('.mat-badge-content');

      expect(matBadgeElement?.textContent).toBe('4');
    });
  });
});

describe('Array layout ui schema handling', () => {
  let fixture: ComponentFixture<ArrayLayoutRenderer>;

  beforeEach(waitForAsync(() => {
    fixture = beforeEachLayoutTest(ArrayLayoutRenderer, TEST_BED_CONFIG);
  }));

  // https://github.com/eclipsesource/jsonforms/issues/2343
  it('does not modify the given ui schema when rendering items', () => {
    const uischema = cloneDeep(TEST_UISCHEMA);
    const pristine = cloneDeep(TEST_UISCHEMA);

    setupMockStore(fixture, {
      data: { test: [{}] },
      schema: TEST_SCHEMA,
      uischema,
    });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();

    expect(uischema).toEqual(pristine);
  });

  it('does not hand out the inline options.detail instance', () => {
    const uischema = cloneDeep(TEST_UISCHEMA);

    setupMockStore(fixture, {
      data: { test: [{}] },
      schema: TEST_SCHEMA,
      uischema,
    });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();

    const detail = fixture.componentInstance.getProps(0).uischema;
    expect(detail).not.toBe(uischema.options.detail);
    expect(detail.type).toBe('HorizontalLayout');
  });

  it('returns a stable copy of the detail ui schema across state emissions', () => {
    const uischema = cloneDeep(TEST_UISCHEMA);

    setupMockStore(fixture, {
      data: { test: [{}] },
      schema: TEST_SCHEMA,
      uischema,
    });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();

    const detail = fixture.componentInstance.getProps(0).uischema;
    expect(detail).not.toBe(uischema.options.detail);

    getJsonFormsService(fixture.componentInstance).updateCore(
      Actions.update('test', () => [{}, {}])
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.getProps(0).uischema).toBe(detail);
    expect(fixture.componentInstance.getProps(1).uischema).toBe(detail);
  });

  it('schedules a check so that state changes reach the template', () => {
    const uischema = cloneDeep(TEST_UISCHEMA);

    setupMockStore(fixture, {
      data: { test: [{}] },
      schema: TEST_SCHEMA,
      uischema,
    });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();

    // the renderer is OnPush, so without this nothing repaints for a change
    // that did not originate from an event in its own view. As the fixture root
    // it is checked unconditionally, hence the explicit expectation.
    const changeDetectorRef = (fixture.componentInstance as any)
      .changeDetectorRef as ChangeDetectorRef;
    spyOn(changeDetectorRef, 'markForCheck').and.callThrough();

    getJsonFormsService(fixture.componentInstance).updateCore(
      Actions.update('test', () => [{}, {}])
    );

    expect(changeDetectorRef.markForCheck).toHaveBeenCalled();
  });

  it('renders no items for data that is not an array', () => {
    const uischema = cloneDeep(TEST_UISCHEMA);

    setupMockStore(fixture, {
      // schema violating data, which JSON Forms reports rather than rejects
      data: { test: {} },
      schema: TEST_SCHEMA,
      uischema,
    });
    fixture.componentInstance.ngOnInit();

    // must not render an item whose props were never calculated
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.componentInstance.itemProps).toEqual([]);
    expect(fixture.nativeElement.querySelectorAll('.array-item').length).toBe(
      0
    );
  });

  it('reuses the item props instead of recreating them per change detection cycle', () => {
    const uischema = cloneDeep(TEST_UISCHEMA);

    setupMockStore(fixture, {
      data: { test: [{}] },
      schema: TEST_SCHEMA,
      uischema,
    });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();

    const itemProps = fixture.componentInstance.getProps(0);
    expect(fixture.componentInstance.getProps(0)).toBe(itemProps);

    // an emission that leaves the array's structure alone must not invalidate
    // them either, otherwise the outlet re-reads - and deep clones - the state
    getJsonFormsService(fixture.componentInstance).updateCore(
      Actions.update('test.0.test1', () => 'a value')
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.getProps(0)).toBe(itemProps);
  });

  it('clears the readonly option again when the array is re-enabled', () => {
    const uischema = cloneDeep(TEST_UISCHEMA);

    setupMockStore(fixture, {
      data: { test: [{}] },
      schema: TEST_SCHEMA,
      uischema,
    });
    fixture.componentInstance.ngOnInit();
    getJsonFormsService(fixture.componentInstance).setReadonly(true);
    fixture.detectChanges();

    let detail = fixture.componentInstance.getProps(0).uischema as Layout;
    expect(detail.elements[0].options.readonly).toBe(true);

    // the detail is rebuilt from the original, so this is not sticky
    getJsonFormsService(fixture.componentInstance).setReadonly(false);
    fixture.detectChanges();

    detail = fixture.componentInstance.getProps(0).uischema as Layout;
    expect(detail.elements[0].options?.readonly).toBeFalsy();
  });

  it('does not modify a ui schema coming from the registry', () => {
    const registered = {
      type: 'HorizontalLayout',
      elements: [{ type: 'Control', scope: '#/properties/test1' }],
    };
    const pristine = cloneDeep(registered);
    // no options.detail, so the registry is consulted
    const uischema = { type: 'Control', scope: '#/properties/test' };

    fixture.componentInstance.disabled = true;
    setupMockStore(fixture, {
      data: { test: [{}] },
      schema: TEST_SCHEMA,
      uischema,
    });
    getJsonFormsService(fixture.componentInstance).setUiSchemas([
      { tester: () => 2, uischema: registered },
    ]);
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();

    const detail = fixture.componentInstance.getProps(0).uischema as Layout;
    expect(registered).toEqual(pristine);
    expect(detail).not.toBe(registered);
    expect(detail.elements[0].options.readonly).toBe(true);
  });

  it('marks the detail ui schema readonly when disabled without touching the original', () => {
    const uischema = cloneDeep(TEST_UISCHEMA);
    const pristine = cloneDeep(TEST_UISCHEMA);

    fixture.componentInstance.disabled = true;
    setupMockStore(fixture, {
      data: { test: [{}] },
      schema: TEST_SCHEMA,
      uischema,
    });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();

    const detail = fixture.componentInstance.getProps(0).uischema as Layout;
    expect(detail.elements[0].options.readonly).toBe(true);
    expect(uischema).toEqual(pristine);
  });

  it('keeps a readonly option set on a detail control when enabled', () => {
    const uischema = {
      type: 'Control',
      scope: '#/properties/test',
      options: {
        detail: {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/test1',
              options: { readonly: true },
            },
            { type: 'Control', scope: '#/properties/test2' },
          ],
        },
      },
    };

    setupMockStore(fixture, {
      data: { test: [{}] },
      schema: TEST_SCHEMA,
      uischema,
    });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();

    const detail = fixture.componentInstance.getProps(0).uischema as Layout;
    expect(detail.elements[0].options.readonly).toBe(true);
    expect(detail.elements[1].options?.readonly).toBeUndefined();
  });
});
