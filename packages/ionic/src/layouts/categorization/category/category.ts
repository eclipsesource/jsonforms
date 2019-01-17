import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Category, UISchemaElement } from '@jsonforms/core';
import { JsonFormsBaseRenderer } from '@jsonforms/angular';

@Component({
  selector: 'jsonforms-category',
  template: `
    <div *ngFor="let element of elements">
      <jsonforms-outlet [renderProps]="element"></jsonforms-outlet>
    </div>
  `
})
export class CategoryRenderer extends JsonFormsBaseRenderer<Category> {
  label: string;
  elements: any[];

  constructor(navParams: NavParams) {
    super();
    const { label, elements, schema, path } = navParams.get('category');
    this.label = label;
    this.elements = elements.map((el: UISchemaElement) => ({
      uischema: el,
      schema,
      path
    }));
  }
}
