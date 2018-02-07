import { Component, OnDestroy, OnInit  } from '@angular/core';
import {
    computeLabel,
    formatErrorMessage,
    isControl,
    JsonFormsState,
    RankedTester,
    rankWith,
    registerStartupRenderer
  } from '@jsonforms/core';

import { NgRedux } from '@angular-redux/store';
import { JsonFormsBaseRenderer } from '@jsonforms/angular';
import { Subscription } from 'rxjs/Subscription';
import { connectControlToJsonForms } from '../util';

@Component({
    selector: 'TextControlRenderer',
    template: `
        <div>
            <label>{{computedLabel}}</label>
            <input type="text" (change)="onChange($event)" [value]="value"/>
            <div>{{errors}}</div>
        </div>
    `
})
export class TextControlRenderer extends JsonFormsBaseRenderer implements OnInit, OnDestroy {

    onChange;
    computedLabel: string;
    errors: string;
    value: any;

    private subscription: Subscription;

    constructor(private ngRedux: NgRedux<JsonFormsState>) {
        super();
    }

    ngOnInit() {
        const state$ = connectControlToJsonForms(this.ngRedux, this.getOwnProps());
        this.subscription = state$.subscribe(state => {
            this.onChange = ev => state.handleChange(state.path, ev.target.value);
            this.computedLabel = computeLabel(state.label, state.required);
            this.errors = formatErrorMessage(state.errors);
            this.value = state.data;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
export const TextControlRendererTester: RankedTester = rankWith(1, isControl);
registerStartupRenderer(
    TextControlRendererTester,
    TextControlRenderer
  );
