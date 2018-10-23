import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { UISchemaElement } from '@jsonforms/core';
import { JsonFormsBaseRenderer } from '@jsonforms/angular';

@Component({
  selector: 'jsonforms-category',
  template: `
      <div *ngFor="let element of elements">
          <jsonforms-outlet [renderProps]="element"></jsonforms-outlet>
      </div>
  `
})
export class CategoryRenderer extends JsonFormsBaseRenderer {

  label: string;
  elements: any[];

  constructor(navParams: NavParams) {
    super();
    const category = navParams.get('uischema');
    const path = navParams.get('path');
    const schema = navParams.get('schema');
    this.label = category.label;
    this.elements = category.elements.map((el: UISchemaElement) => ({
        uischema: el,
        schema,
        path
    }));
  }
}
