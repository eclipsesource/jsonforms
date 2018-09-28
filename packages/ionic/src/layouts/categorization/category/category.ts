import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'jsonforms-category',
  template: `
      <div *ngFor="let element of elements">
          <jsonforms-outlet [uischema]="element"></jsonforms-outlet>
      </div>
  `
})
export class CategoryRenderer {

  label: string;
  elements: any[];

  constructor(navParams: NavParams) {
    const category = navParams.get('category');
    this.label = category.label;
    this.elements = category.elements;
  }
}
