import {
    and,
    Categorization,
    categorizationHasCategory,
    JsonFormsState,
    RankedTester,
    rankWith,
    uiTypeIs
} from '@jsonforms/core';
import * as _ from 'lodash';
import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { JsonFormsIonicLayout } from '../JsonFormsIonicLayout';
import { CategoryRenderer } from './category/category';

@Component({
    selector: 'jsonforms-categorization-layout',
    template: `
      <ion-tabs>
        <ion-tab
          *ngFor="let category of categoryPages; trackBy: trackByCategory"
          tabTitle="{{category.params.uischema.label}}"
          [root]="category.renderer"
          [rootParams]="category.params"
        >
        </ion-tab>
      </ion-tabs>
  `
})
export class CategorizationTabLayoutRenderer extends JsonFormsIonicLayout {

    categoryPages: any[];

    constructor(ngRedux: NgRedux<JsonFormsState>) {
        super(ngRedux);
        this.categoryPages = [];
        this.initializers.push(this.mapAdditionalProps);
    }

    mapAdditionalProps = (props: any) => {
        this.categoryPages = [];
        (props.uischema as Categorization).elements.forEach(
            (category, index) => {
                if (this.categoryPages[index] === undefined ||
                    !_.isEqual(this.categoryPages[index].params.category, category)) {
                    this.categoryPages.push({
                        renderer: CategoryRenderer,
                        params: {
                            uischema: category,
                            schema: this.schema,
                            path: this.path
                        }
                    });
                }
            }
        );
    }

    trackByCategory(_i: number, categoryPage: any) {
        return categoryPage.params.uischema;
    }
}

export const categorizationTester: RankedTester = rankWith(
    2,
    and(
        uiTypeIs('Categorization'),
        categorizationHasCategory
    ));
