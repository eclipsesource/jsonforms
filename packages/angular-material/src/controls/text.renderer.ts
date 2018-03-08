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
    computeLabel,
    ControlElement,
    formatErrorMessage,
    isControl,
    isPlainLabel,
    JsonFormsState,
    RankedTester,
    rankWith,
    resolveSchema
  } from '@jsonforms/core';

import { NgRedux } from '@angular-redux/store';
import { JsonFormsBaseRenderer } from '@jsonforms/angular';
import { Subscription } from 'rxjs/Subscription';
import { connectControlToJsonForms } from '../util';

@Component({
    selector: 'TextControlRenderer',
    template: `
        <mat-form-field>
            <mat-label>{{computedLabel}}</mat-label>
            <input
                matInput
                type="text"
                (change)="onChange($event)"
                [value]="value" placeholder="{{description}}"
            >
            <mat-error>{{errors}}</mat-error>
        </mat-form-field>

    `
})
export class TextControlRenderer extends JsonFormsBaseRenderer implements OnInit, OnDestroy {
    onChange;
    computedLabel: string;
    errors: string;
    value: any;
    description: string;

    private subscription: Subscription;

    constructor(private ngRedux: NgRedux<JsonFormsState>) {
        super();
    }

    ngOnInit() {
        const state$ = connectControlToJsonForms(this.ngRedux, this.getOwnProps());
        this.subscription = state$.subscribe(state => {
            this.onChange = ev => state.handleChange(state.path, ev.target.value);
            this.computedLabel = computeLabel(
                isPlainLabel(state.label) ? state.label : state.label.default, state.required);
            // TODO initial try did not work, needs more time to fix
            // const isValid = state.errors.length === 0;
            // if (!isValid) {
            //     this.formField.underlineRef.controls.setErrors({'incorrect': true});
            // }
            this.errors = formatErrorMessage(state.errors);
            this.value = state.data;
            const controlElement = state.uischema as ControlElement;
            const resolvedSchema = resolveSchema(state.schema, controlElement.scope);
            this.description = resolvedSchema.description === undefined ?
                '' : resolvedSchema.description;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
export const TextControlRendererTester: RankedTester = rankWith(1, isControl);
