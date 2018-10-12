import {
    and,
    Categorization,
    categorizationHasCategory,
    JsonFormsState,
    RankedTester,
    rankWith,
    uiTypeIs
} from '@jsonforms/core';
import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { JsonFormsIonicLayout } from '../JsonFormsIonicLayout';
import { CategoryRenderer } from './category/category';

@Component({
    selector: 'jsonforms-categorization-layout',
    template: `<ion-tabs>
        <ion-tab
          *ngFor="let category of categoryPages"
          tabTitle="{{category.params.category.label}}"
          [root]="category.renderer"
          [rootParams]="category.params"
        >
        </ion-tab>
      </ion-tabs>
  `
})
export class CategorizationTabLayoutRenderer extends JsonFormsIonicLayout {

    categoryPages: any[] = [];

    constructor(ngRedux: NgRedux<JsonFormsState>) {
        super(ngRedux);
    }

    mapAdditionalProps() {
        this.categoryPages = [];
        (this.uischema as Categorization).elements.forEach(category =>
            this.categoryPages.push({ renderer: CategoryRenderer, params: { category }})
        );
    }
}

export const categorizationTester: RankedTester = rankWith(
    2,
    and(
        uiTypeIs('Categorization'),
        categorizationHasCategory
    ));
