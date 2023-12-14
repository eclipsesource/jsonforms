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
  ViewRef,
} from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { isBooleanControl, RankedTester, rankWith } from '@jsonforms/core';

@Component({
  selector: 'BooleanControlRenderer',
  template: `
    <div [ngStyle]="{ display: hidden ? 'none' : '' }" class="boolean-control">
      <mat-checkbox
        (change)="onChange($event)"
        [checked]="isChecked()"
        [disabled]="!isEnabled()"
        [id]="id"
      >
        {{ label }}
      </mat-checkbox>
      <mat-hint class="mat-caption" *ngIf="shouldShowUnfocusedDescription()">{{
        description
      }}</mat-hint>
      <mat-error class="mat-caption">{{ error }}</mat-error>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: row;
      }
      .boolean-control {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooleanControlRenderer extends JsonFormsControl {
  constructor(
    jsonformsService: JsonFormsAngularService,
    private changeDetectionRef: ChangeDetectorRef
  ) {
    super(jsonformsService);
  }
  isChecked = () => this.data || false;
  getEventValue = (event: any) => event.checked;

  mapAdditionalProps() {
    if (!(this.changeDetectionRef as ViewRef).destroyed) {
      this.changeDetectionRef.markForCheck();
    }
  }
}

export const booleanControlTester: RankedTester = rankWith(2, isBooleanControl);
