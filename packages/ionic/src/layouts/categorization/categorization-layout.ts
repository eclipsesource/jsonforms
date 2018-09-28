import {
    and,
    Category,
    categorizationHasCategory,
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
              <ion-title>
                  {{selectedCategory?.label}}
              </ion-title>
              <ion-buttons end>
                  <button ion-button *ngIf="canGoBack()" (click)="goBack()">
                      Go Back
                  </button>
              </ion-buttons>
          </ion-navbar>
      </ion-header>


      <ion-content>
          <!-- LHS menu -->
          <ion-menu side="left" [content]="categoryContent" id="categorization-menu">
              <ion-content>
                  <ion-list>
                      <button ion-item
                              *ngFor="let category of uischema?.elements"
                              (click)="selectCategory(category)">
                          {{category.label}}
                      </button>
                  </ion-list>
              </ion-content>
          </ion-menu>
          <ion-nav #categoryContent></ion-nav>
      </ion-content>
  `
})
export class CategorizationLayoutRenderer extends JsonFormsIonicLayout {

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

    selectCategory(category) {
        this.selectedCategory = category;
        this.nav.setRoot(CategoryRenderer, { category });
    }

    canGoBack() {
        // FIXME: addToStack allows explicit control when to display the 'Go back' button,
        // FIXME: is there a better way to control this?
        const count = this.nav.getViews().reduce(
            (acc, view) => acc + (view.data.addToNavStack ? 1 : 0),
            0
        );
        return count > 1;
    }

    goBack() {
        return this.nav.pop();
    }
}

export const categorizationTester: RankedTester = rankWith(
    1,
    and(
        uiTypeIs('Categorization'),
        categorizationHasCategory
    ));
