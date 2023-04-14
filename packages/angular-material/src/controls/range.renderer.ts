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
  Component,
  ChangeDetectorRef,
} from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { isRangeControl, RankedTester, rankWith } from '@jsonforms/core';

@Component({
  selector: 'RangeControlRenderer',
  template: `
    <div fxFlex fxLayout="column" [fxHide]="hidden">
      <label class="mat-caption" style="color:rgba(0,0,0,.54)">{{
        label
      }}</label>
      <mat-slider
        [value]="data || scopedSchema.default"
        (change)="onChange($event)"
        [disabled]="!isEnabled()"
        [max]="max"
        [min]="min"
        [step]="multipleOf"
        [thumbLabel]="true"
        tickInterval="auto"
        [id]="id"
      ></mat-slider>
      <mat-hint class="mat-caption" *ngIf="shouldShowUnfocusedDescription()">{{
        description
      }}</mat-hint>
      <mat-error class="mat-caption">{{ error }}</mat-error>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeControlRenderer extends JsonFormsControl {
  min: number;
  max: number;
  multipleOf: number;

  constructor(
    jsonformsService: JsonFormsAngularService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(jsonformsService);
  }
  getEventValue = (event: any) => Number(event.value);
  mapAdditionalProps() {
    if (this.scopedSchema) {
      this.min = this.scopedSchema.minimum;
      this.max = this.scopedSchema.maximum;
      this.multipleOf = this.scopedSchema.multipleOf || 1;
    }
    this.changeDetectorRef.markForCheck();
  }
}
export const RangeControlRendererTester: RankedTester = rankWith(
  4,
  isRangeControl
);
