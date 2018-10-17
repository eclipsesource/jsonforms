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
    and,
    isBooleanControl,
    JsonFormsState,
    optionIs,
    RankedTester,
    rankWith
} from '@jsonforms/core';

@Component({
    selector: 'ToggleControlRenderer',
    template: `
    <div>
        <mat-slide-toggle
            (change)="onChange($event)"
            [checked]="isChecked()"
            [disabled]="!enabled"
            [id]="id">
            {{ label }}
        </mat-slide-toggle>
        <mat-error>{{ error }}</mat-error>
    </div>
    `
})
export class ToggleControlRenderer extends JsonFormsControl {
    constructor(ngRedux: NgRedux<JsonFormsState>) {
        super(ngRedux);
    }
    isChecked = () => this.data || false;
    getEventValue = (event: any) => event.checked;
}

export const ToggleControlRendererTester: RankedTester = rankWith(
    3,
    and(isBooleanControl, optionIs('toggle', true)),
);
