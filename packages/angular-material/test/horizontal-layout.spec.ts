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
import { ComponentFixture } from '@angular/core/testing';
import { HorizontalLayout, UISchemaElement } from '@jsonforms/core';
import { beforeEachLayoutTest, setupMockStore } from '@jsonforms/angular-test';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  HorizontalLayoutRenderer,
  horizontalLayoutTester,
} from '../src/layouts/horizontal-layout.renderer';
import { LayoutChildrenRenderPropsPipe } from '../src/layouts/layout.renderer';

describe('Horizontal layout tester', () => {
  it('should succeed', () => {
    expect(
      horizontalLayoutTester({ type: 'HorizontalLayout' }, undefined, undefined)
    ).toBe(1);
  });
});
describe('Horizontal layout', () => {
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    fixture = beforeEachLayoutTest(HorizontalLayoutRenderer, {
      declarations: [LayoutChildrenRenderPropsPipe],
      imports: [FlexLayoutModule],
    });
  });

  it('render with undefined elements', () => {
    const uischema: UISchemaElement = {
      type: 'HorizontalLayout',
    };
    setupMockStore(fixture, {
      data: {},
      schema: {},
      uischema,
    });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].children.length).toBe(0);
  });

  it('render with null elements', () => {
    const uischema: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: null,
    };
    setupMockStore(fixture, {
      data: {},
      schema: {},
      uischema,
    });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].children.length).toBe(0);
  });

  it('render with children', () => {
    const uischema: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [{ type: 'Control' }, { type: 'Control' }],
    };
    setupMockStore(fixture, {
      data: {},
      schema: {},
      uischema,
    });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].children.length).toBe(2);
    expect(fixture.nativeElement.children[0].hidden).toBe(false);
  });
});
