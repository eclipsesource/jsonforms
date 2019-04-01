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
  categorizationHasCategory,
  Category,
  JsonFormsState,
  Layout,
  RankedTester,
  rankWith,
  uiTypeIs
} from '@jsonforms/core';
import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CategoryRenderer } from './category/category';
import { NgRedux } from '@angular-redux/store';
import { JsonFormsIonicLayout } from '../JsonFormsIonicLayout';

@Component({
  selector: 'jsonforms-categorization-layout',
  template: `
    <ion-header>
      <ion-navbar>
        <button ion-button menuToggle="categorization-menu">
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title> {{ selectedCategory?.label }} </ion-title>
        <ion-buttons end>
          <button ion-button *ngIf="canGoBack()" (click)="goBack()">
            Go Back
          </button>
        </ion-buttons>
      </ion-navbar>
    </ion-header>

    <ion-content>
      <!-- LHS menu -->
      <ion-menu
        side="left"
        [content]="categoryContent"
        id="categorization-menu"
      >
        <ion-content>
          <ion-list>
            <button
              ion-item
              *ngFor="let category of uischema?.elements"
              (click)="selectCategory(category)"
            >
              {{ category.label }}
            </button>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-nav #categoryContent></ion-nav>
    </ion-content>
  `
})
export class CategorizationMenuLayoutRenderer extends JsonFormsIonicLayout {
  @ViewChild('categoryContent') nav: NavController;
  selectedCategory: Category;
  initialized: boolean;

  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }

  mapAdditionalProps() {
    if (!this.initialized) {
      const layout = this.uischema as Layout;
      if (layout && layout.elements.length > 0) {
        this.selectCategory(layout.elements[0] as Category);
      }
      this.initialized = true;
    }
  }

  selectCategory(category: Category) {
    this.selectedCategory = category;
    this.nav.setRoot(CategoryRenderer, { category });
  }

  canGoBack() {
    // FIXME: addToStack allows explicit control when to display the 'Go back' button,
    // FIXME: is there a better way to control this?
    const count = this.nav
      .getViews()
      .reduce((acc, view) => acc + (view.data.addToNavStack ? 1 : 0), 0);
    return count > 1;
  }

  goBack() {
    return this.nav.pop();
  }
}

export const categorizationTester: RankedTester = rankWith(
  1,
  and(uiTypeIs('Categorization'), categorizationHasCategory)
);
