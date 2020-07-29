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
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import {
  and,
  isBooleanControl,
  optionIs,
  RankedTester,
  rankWith
} from '@jsonforms/core';

@Component({
  selector: 'ToggleControlRenderer',
  template: `
    <div [fxHide]="hidden">
      <mat-slide-toggle
        (change)="onChange($event)"
        [checked]="isChecked()"
        [disabled]="!isEnabled()"
        [id]="id"
      >
        {{ label }}
      </mat-slide-toggle>
      <mat-hint class="mat-caption" *ngIf="shouldShowUnfocusedDescription()">{{ description }}</mat-hint>
      <mat-error class="mat-caption">{{ error }}</mat-error>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleControlRenderer extends JsonFormsControl {
  constructor(jsonformsService: JsonFormsAngularService, private changeDetectorRef: ChangeDetectorRef) {
    super(jsonformsService);
  }
  isChecked = () => this.data || false;
  getEventValue = (event: any) => event.checked;
  mapAdditionalProps() {
    this.changeDetectorRef.markForCheck();
  }
}

export const ToggleControlRendererTester: RankedTester = rankWith(
  3,
  and(isBooleanControl, optionIs('toggle', true))
);
