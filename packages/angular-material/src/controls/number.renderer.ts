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
import {
    isIntegerControl,
    isNumberControl,
    JsonFormsState,
    or,
    RankedTester,
    rankWith
} from '@jsonforms/core';

@Component({
    selector: 'NumberControlRenderer',
    template: `
        <mat-form-field fxFlex [fxHide]="hidden">
            <mat-label>{{ label }}</mat-label>
            <input
                matInput
                type="number"
                (change)="onChange($event)"
                [value]="data"
                placeholder="{{ description }}"
                [id]="id"
                [formControl]="form"
                [min]="min"
                [max]="max"
                [step]="multipleOf"
            >
            <mat-error>{{ error }}</mat-error>
        </mat-form-field>
    `
})
export class NumberControlRenderer extends JsonFormsControl {

    min: number;
    max: number;
    multipleOf: number;

    constructor(ngRedux: NgRedux<JsonFormsState>) {
        super(ngRedux);
    }
    getEventValue = (event: any) => Number(event.target.value);
    mapAdditionalProps() {
        if (this.scopedSchema) {
            const defaultStep = isNumberControl(this.uischema, this.schema) ? 0.1 : 1;
            this.min = this.scopedSchema.minimum;
            this.max = this.scopedSchema.maximum;
            this.multipleOf = this.scopedSchema.multipleOf || defaultStep;
        }
    }
}
export const NumberControlRendererTester: RankedTester =
    rankWith(2, or(isNumberControl, isIntegerControl));
