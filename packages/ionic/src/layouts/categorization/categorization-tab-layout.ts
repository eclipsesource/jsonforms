/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
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
import {
  and,
  Categorization,
  categorizationHasCategory,
  Category,
  JsonFormsState,
  JsonSchema,
  RankedTester,
  rankWith,
  uiTypeIs
} from '@jsonforms/core';
import { Component, ViewChild } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { JsonFormsIonicLayout } from '../JsonFormsIonicLayout';
import { CategoryRenderer } from './category/category';
//import { ParamsService } from '../../services/ParamsService';
import { IonTabs } from '@ionic/angular';

interface CategoryRenderParams {
  renderer: typeof CategoryRenderer;
  params: {
    category: {
      uischema: Category;
      label: string;
      schema: JsonSchema;
      path: string;
    };
  };
}

@Component({
  selector: 'jsonforms-categorization-layout',
  template: `
    <ion-tabs #tabs>
      <ion-tab
        *ngFor="let category of categoryPages; trackBy: trackByCategory"
        tabTitle="{{ category.params.category.label }}"
        [root]="category.renderer"
        [rootParams]="category.params"
      >
      </ion-tab>
    </ion-tabs>
  `
})
export class CategorizationTabLayoutRenderer extends JsonFormsIonicLayout {
  @ViewChild('tabs') tabs: IonTabs;
  categoryPages: CategoryRenderParams[];

  constructor(
    ngRedux: NgRedux<JsonFormsState>
    // TODO: DEPS
    //private paramsService: ParamsService
  ) {
    super(ngRedux);
    this.categoryPages = [];
    this.initializers.push(this.mapAdditionalProps);
  }

  mapAdditionalProps = (props: any) => {
    this.categoryPages.length = 0;
    const categorization = props.uischema as Categorization;

    categorization.elements.forEach((category: Category) => {
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
    });

    // TODO: DEPS
    // Tabs do not seem to update correctly, hence this workaround
    // this issue seems to be the as described in https://github.com/ionic-team/ionic/issues/13509
    //const contained: string[] = [];
    //categorization.elements.forEach((category: Category) => {
    //  const key =
    //    CategoryRenderer.CATEGORY_KEY + `${category.label}-${this.path}`;
    //  contained.push(category.label);
    //  this.paramsService.set(key, {
    //    uischema: category,
    //    label: category.label,
    //    schema: this.schema,
    //    path: this.path
    //  });
    //});
    //const indices: number[] = [];
    //this.tabs.tabBar. forEach((tab: Tab, idx: number) => {
    //  if (contained.indexOf(tab.tabTitle) === -1) {
    //    indices.push(idx);
    //  }
    //});
    //indices.reverse().forEach(idx => this.tabs._tabs.splice(idx, 1));
  };

  trackByCategory(_i: number, categoryPage: any) {
    return categoryPage.params.category.label;
  }
}

export const categorizationTester: RankedTester = rankWith(
  2,
  and(uiTypeIs('Categorization'), categorizationHasCategory)
);
