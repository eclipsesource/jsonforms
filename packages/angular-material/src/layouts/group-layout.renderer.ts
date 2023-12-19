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
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { GroupLayout, RankedTester, rankWith, uiTypeIs } from '@jsonforms/core';
import { LayoutRenderer } from './layout.renderer';
import { JsonFormsAngularService } from '@jsonforms/angular';

@Component({
  selector: 'GroupLayoutRenderer',
  template: `
    <mat-card
      [ngStyle]="{ display: hidden ? 'none' : '' }"
      appearance="outlined"
      class="group-layout"
    >
      <mat-card-title class="mat-headline-6">{{ label }}</mat-card-title>
      <div
        *ngFor="
          let props of uischema | layoutChildrenRenderProps : schema : path;
          trackBy: trackElement
        "
      >
        <jsonforms-outlet [renderProps]="props"></jsonforms-outlet>
      </div>
    </mat-card>
  `,
  styles: [
    `
      .group-layout {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
      }
      .group-layout > div {
        flex: 1 1 auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupLayoutRenderer extends LayoutRenderer<GroupLayout> {
  constructor(
    jsonFormsService: JsonFormsAngularService,
    changeDetectionRef: ChangeDetectorRef
  ) {
    super(jsonFormsService, changeDetectionRef);
  }
}
export const groupLayoutTester: RankedTester = rankWith(1, uiTypeIs('Group'));
