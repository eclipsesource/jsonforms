import { Component, OnDestroy, OnInit  } from '@angular/core';
import {
    JsonFormsState,
    RankedTester,
    rankWith,
    registerStartupRenderer,
    StatePropsOfLayout,
    uiTypeIs
  } from '@jsonforms/core';

import { NgRedux } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { JsonFormsBaseRenderer } from '@jsonforms/angular';
import { connectLayoutToJsonForms } from '../util';

@Component({
    selector: 'VerticalLayoutRenderer',
    template: `
        <div *ngFor="let uischema of state.uischema.elements">
            <jsonforms-outlet [uischema]="uischema"></jsonforms-outlet>
        </div>
    `
})
export class VerticalLayoutRenderer extends JsonFormsBaseRenderer implements OnInit, OnDestroy {

    state: StatePropsOfLayout;

    private subscription: Subscription;

    constructor(private ngRedux: NgRedux<JsonFormsState>) {
        super();
    }

    ngOnInit() {
        const state$ = connectLayoutToJsonForms(this.ngRedux, this.getOwnProps());
        this.subscription = state$.subscribe(state => {
            this.state = state;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
export const verticalLayoutTester: RankedTester = rankWith(1, uiTypeIs('VerticalLayout'));
registerStartupRenderer(
    verticalLayoutTester,
    VerticalLayoutRenderer
  );
