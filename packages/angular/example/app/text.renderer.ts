import { Component, OnDestroy, OnInit  } from '@angular/core';
import {
    computeLabel,
    formatErrorMessage,
    isControl,
    RankedTester,
    rankWith,
    registerStartupRenderer,
  } from '@jsonforms/core';

import { NgRedux } from '@angular-redux/store';
import { connectControlToJsonForms, JsonFormsBaseRenderer } from '../../src';
import { Subscription } from 'rxjs/Subscription';

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

    constructor(private ngRedux: NgRedux<any>) {
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
export default registerStartupRenderer(
    TextControlRendererTester,
    TextControlRenderer
  );
