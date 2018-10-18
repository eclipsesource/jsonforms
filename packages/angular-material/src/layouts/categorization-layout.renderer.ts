import {
    and,
    categorizationHasCategory,
    RankedTester,
    rankWith,
    uiTypeIs
} from '@jsonforms/core';
import * as _ from 'lodash';
import { Component } from '@angular/core';
// import { NgRedux } from '@angular-redux/store';
import { JsonFormsBaseRenderer } from '@jsonforms/angular';

@Component({
    selector: 'jsonforms-categorization-layout',
    template: `<mat-tab-group dynamicHeight="true">
    <mat-tab *ngFor="let category of uischema.elements"
        [label]="category.label">
        <div *ngFor="let element of category.elements">
            <jsonforms-outlet [uischema]="element"></jsonforms-outlet>
        </div>
    </mat-tab>
  </mat-tab-group>
  `
})
export class CategorizationTabLayoutRenderer extends JsonFormsBaseRenderer {

    // constructor(private ngRedux: NgRedux<JsonFormsState>) {}

}

export const categorizationTester: RankedTester = rankWith(
    2,
    and(
        uiTypeIs('Categorization'),
        categorizationHasCategory
    ));
