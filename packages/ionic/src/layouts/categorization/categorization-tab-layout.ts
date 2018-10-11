import {
    and, Categorization,
    categorizationHasCategory,
    Category,
    JsonFormsState,
    RankedTester,
    rankWith,
    uiTypeIs
} from '@jsonforms/core';
import { Component, ViewChild } from '@angular/core';
import { Tabs } from 'ionic-angular';
import { NgRedux } from '@angular-redux/store';
import { JsonFormsIonicLayout } from '../JsonFormsIonicLayout';
import { CategoryRenderer } from './category/category';

@Component({
    selector: 'jsonforms-categorization-layout',
    template: `
      <ion-tabs #tabs *ngIf="uischema"  (ionChange)="onChange($event)">
        <ion-tab
          *ngFor="let category of uischema?.elements; let i = index"
          tabTitle="{{category.label}}"
          [root]="renderedCategories.length > 0 ? renderedCategories[i][0] : null"
          [rootParams]="renderedCategories.length ? renderedCategories[i][1] : null"
        >
        </ion-tab>
      </ion-tabs>
  `
})
export class CategorizationTabLayoutRenderer extends JsonFormsIonicLayout {

    @ViewChild('tabs') tabs: Tabs;
    selectedCategory: Category;
    renderedCategories: any[] = [];

    constructor(ngRedux: NgRedux<JsonFormsState>) {
        super(ngRedux);
    }

    mapAdditionalProps() {
        (this.uischema as Categorization).elements.forEach(category =>
            this.renderedCategories.push([CategoryRenderer, { category }])
        );
    }
}

export const categorizationTester: RankedTester = rankWith(
    2,
    and(
        uiTypeIs('Categorization'),
        categorizationHasCategory
    ));
