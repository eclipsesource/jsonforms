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
import { NgRedux } from '@angular-redux/store';
import { Component } from '@angular/core';
import { JsonFormsControl } from '@jsonforms/angular';
import { isRangeControl, JsonFormsState, RankedTester, rankWith } from '@jsonforms/core';

@Component({
    selector: 'RangeControlRenderer',
    template: `
        <ion-item [hidden]="hidden">
            <ion-label>{{ label }}</ion-label>
            <ion-range
                [ngModel]="data || scopedSchema.default"
                (ionChange)="onChange($event)"
                [max]="max"
                [min]="min"
                [step]="multipleOf"
                [id]="id"
                [disabled]="!enabled"
                [hidden]="hidden"
            >
                <ion-label range-left>{{min}}</ion-label>
                <ion-label range-right>{{max}}</ion-label>
            </ion-range>
            <ion-label stacked *ngIf="error" color="error">{{error}}</ion-label>
        </ion-item>
    `
})
export class RangeControlRenderer extends JsonFormsControl {

    min: number;
    max: number;
    multipleOf: number;

    constructor(ngRedux: NgRedux<JsonFormsState>) {
        super(ngRedux);
    }
    getEventValue = (event: any) => Number(event.value);
    mapAdditionalProps() {
        if (this.scopedSchema) {
            this.min = this.scopedSchema.minimum;
            this.max = this.scopedSchema.maximum;
            this.multipleOf = this.scopedSchema.multipleOf || 1;
        }
    }
}
export const rangeControlTester: RankedTester = rankWith(4, isRangeControl);
