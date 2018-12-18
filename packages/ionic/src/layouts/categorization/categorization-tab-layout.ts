import {
  and,
  Categorization,
  categorizationHasCategory,
  Category,
  JsonFormsState,
  RankedTester,
  rankWith,
  uiTypeIs
} from '@jsonforms/core';
import { Component, ViewChild } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { JsonFormsIonicLayout } from '../JsonFormsIonicLayout';
import { CategoryRenderer } from './category/category';
import { ParamsService } from '../../services/ParamsService';
import { Tabs, Tab } from 'ionic-angular';

@Component({
  selector: 'jsonforms-categorization-layout',
  template: `
      <ion-tabs #tabs>
        <ion-tab
          *ngFor="let category of categoryPages; trackBy: trackByCategory"
          tabTitle="{{category.params.category.label}}"
          [root]="category.renderer"
          [rootParams]="category.params"
        >
        </ion-tab>
      </ion-tabs>
  `
})
export class CategorizationTabLayoutRenderer extends JsonFormsIonicLayout {

  @ViewChild('tabs') tabs: Tabs;
  categoryPages: any[];

  constructor(ngRedux: NgRedux<JsonFormsState>, private paramsService: ParamsService) {
    super(ngRedux);
    this.categoryPages = [];
    this.initializers.push(this.mapAdditionalProps);
  }

  mapAdditionalProps = (props: any) => {
    this.categoryPages.length = 0;
    const categorization = props.uischema as Categorization;

    categorization.elements.forEach(
      (category: Category) => {
        this.categoryPages.push({
          renderer: CategoryRenderer,
          params: {
            category: {
              uischema: category,
              label: category.label,
              schema: this.schema,
              path: this.path
            }
          }
        });
      }
    );

    // Tabs do not seem to update correctly, hence this workaround
    // this issue seems to be the as described in https://github.com/ionic-team/ionic/issues/13509
    const contained: string[] = [];
    categorization.elements.forEach((category: Category) => {
      const key = CategoryRenderer.CATEGORY_KEY + `${category.label}-${this.path}`;
      contained.push(category.label);
      this.paramsService.set(key, {
        uischema: category,
        label: category.label,
        schema: this.schema,
        path: this.path
      });
    });
    const indices: number[] = [];
    this.tabs._tabs.forEach((tab: Tab, idx: number) => {
      if (contained.indexOf(tab.tabTitle) === -1) {
        indices.push(idx);
      }
    });
    indices.reverse().forEach(idx => this.tabs._tabs.splice(idx, 1));
  }

  trackByCategory(_i: number, categoryPage: any) {
    return categoryPage.params.category.label;
  }
}

export const categorizationTester: RankedTester = rankWith(
    2,
    and(
        uiTypeIs('Categorization'),
        categorizationHasCategory
    ));
