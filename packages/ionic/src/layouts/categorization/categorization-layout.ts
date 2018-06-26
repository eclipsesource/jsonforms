import * as _ from 'lodash';
import {
  and,
  Categorization,
  Category,
  JsonFormsState,
  RankedTester,
  rankWith,
  StatePropsOfLayout,
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
                  {{label}}
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
                              *ngFor="let category of categories"
                              (click)="renderCategory(category)">
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
  categories: any[];
  label: string;
  stateProps: StatePropsOfLayout;

  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }

  ngOnInit() {
    this.categories = (this.getOwnProps().uischema as Categorization).elements;
    const firstCategory = (this.getOwnProps().uischema as Categorization).elements[0];
    this.label = firstCategory.label;
    const state$ = this.connectLayoutToJsonForms(this.ngRedux, this.getOwnProps());
    this.subscription = state$.subscribe(state => {
      this.stateProps = state;
    });
    this.renderCategory(firstCategory);
  }

  renderCategory(category) {
    this.nav.setRoot(CategoryRenderer, { category: category });
    this.label = category.label;
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

export const isCategorization = (category: Category | Categorization): category is Categorization =>
  category.type === 'Categorization';

export const categorizationTester: RankedTester = rankWith(
  1,
  and(
    uiTypeIs('Categorization'),
    uischema => {
      const hasCategory = (categorization: Categorization): boolean => {
        if (_.isEmpty(categorization.elements)) {
          return false;
        }
        // all children of the categorization have to be categories
        return categorization.elements
          .map(elem => isCategorization(elem) ? hasCategory(elem) : elem.type === 'Category')
          .reduce((prev, curr) => prev && curr, true);
      };

      return hasCategory(uischema as Categorization);
    }
  ));
