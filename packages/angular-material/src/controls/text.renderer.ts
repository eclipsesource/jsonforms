import { Component, OnDestroy, OnInit  } from '@angular/core';
import {
    computeLabel,
    ControlElement,
    formatErrorMessage,
    isControl,
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
            <input matInput type="text" (change)="onChange($event)"
                [value]="value" placeholder="{{description}}">
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
            this.computedLabel = computeLabel(state.label, state.required);
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
