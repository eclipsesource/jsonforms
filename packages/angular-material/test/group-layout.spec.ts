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
import { GroupLayout, UISchemaElement } from '@jsonforms/core';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { beforeEachLayoutTest, setupMockStore } from './common';
import { LayoutChildrenRenderPropsPipe } from '../src/library/layouts/layout.renderer';
import {
  GroupLayoutRenderer,
  groupLayoutTester,
} from '../src/library/layouts/group-layout.renderer';
import { initTestEnvironment } from './test';

initTestEnvironment();

describe('Group layout tester', () => {
  it('should succeed', () => {
    expect(groupLayoutTester({ type: 'Group' }, undefined, undefined)).toBe(1);
  });
});
describe('Group layout', () => {
  let fixture: ComponentFixture<any>;

  beforeEach(waitForAsync(() => {
    fixture = beforeEachLayoutTest(GroupLayoutRenderer, {
      declarations: [LayoutChildrenRenderPropsPipe],
      imports: [MatCard, MatCardTitle],
    });
  }));

  it('render with undefined elements', () => {
    const uischema: UISchemaElement = {
      type: 'Group',
    };
    setupMockStore(fixture, { data: {}, schema: {}, uischema });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    const card: DebugElement[] = fixture.debugElement.queryAll(
      By.directive(MatCard)
    );
    // title
    expect(card[0].nativeElement.children.length).toBe(1);
  });

  it('render with null elements', () => {
    const uischema: GroupLayout = {
      type: 'Group',
      elements: null,
    };
    setupMockStore(fixture, { data: {}, schema: {}, uischema });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    const card: DebugElement[] = fixture.debugElement.queryAll(
      By.directive(MatCard)
    );
    // title
    expect(card[0].nativeElement.children.length).toBe(1);
  });

  it('render with children', () => {
    const uischema: GroupLayout = {
      type: 'Group',
      label: 'foo',
      elements: [{ type: 'Control' }, { type: 'Control' }],
    };
    setupMockStore(fixture, { data: {}, schema: {}, uischema });
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    const card: DebugElement[] = fixture.debugElement.queryAll(
      By.directive(MatCard)
    );
    const title: DebugElement = fixture.debugElement.query(
      By.directive(MatCardTitle)
    );

    expect(title.nativeElement.textContent).toBe('foo');
    // title + 2 controls
    expect(card[0].nativeElement.children.length).toBe(3);
  });
});
