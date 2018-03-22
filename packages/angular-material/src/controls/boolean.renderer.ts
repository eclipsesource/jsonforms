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
import { Component, OnDestroy, OnInit  } from '@angular/core';
import {
    ControlElement,
    isBooleanControl,
    isPlainLabel,
    JsonFormsState,
    RankedTester,
    rankWith,
  } from '@jsonforms/core';
import { MatCheckboxChange } from '@angular/material';

import { NgRedux } from '@angular-redux/store';
import { JsonFormsBaseRenderer } from '@jsonforms/angular';
import { Subscription } from 'rxjs/Subscription';
import { connectControlToJsonForms } from '../util';

@Component({
    selector: 'BooleanControlRenderer',
    template: `
        <mat-checkbox
            (change)="onChange($event)"
            [checked]="value"
            [align]="align"
            [disabled]="disabled">
            {{ label }}
        </mat-checkbox>
    `
})
export class BooleanControlRenderer extends JsonFormsBaseRenderer implements OnInit, OnDestroy {
    onChange: (event?: MatCheckboxChange) => void;
    label: string;
    align: string;
    errors: string;
    value: boolean;
    disabled: boolean;

    private subscription: Subscription;

    constructor(private ngRedux: NgRedux<JsonFormsState>) {
        super();
    }

    ngOnInit() {
        const state$ = connectControlToJsonForms(this.ngRedux, this.getOwnProps());
        this.subscription = state$.subscribe(state => {
            this.onChange = ev => state.handleChange(state.path, ev.checked);
            this.value = state.data;
            this.label = isPlainLabel(state.label) ? state.label : state.label.default;
            this.disabled = !state.enabled;

            const controlElement = state.uischema as ControlElement;
            const options = controlElement.options || {};
            this.align = options.align ? options.align : 'start';
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
export const BooleanControlRendererTester: RankedTester = rankWith(2, isBooleanControl);
