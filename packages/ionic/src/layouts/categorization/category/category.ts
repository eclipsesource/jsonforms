import { Component } from '@angular/core';
import * as _ from 'lodash';
import { NavParams } from 'ionic-angular';
import { Category, UISchemaElement } from '@jsonforms/core';
import { JsonFormsBaseRenderer } from '@jsonforms/angular';
import { ParamsService } from '../../../services/ParamsService';

@Component({
  selector: 'jsonforms-category',
  template: `
    <div *ngFor="let element of updatedElements()">
      <jsonforms-outlet [renderProps]="element"></jsonforms-outlet>
    </div>
  `
})
export class CategoryRenderer extends JsonFormsBaseRenderer<Category> {
  static CATEGORY_KEY = 'jsonforms-category-';
  label: string;
  elements: any[];

  constructor(navParams: NavParams, private paramsService: ParamsService) {
    super();
    const { label, uischema, schema, path } = navParams.get('category');
    this.label = label;
    this.elements = uischema.elements.map((el: UISchemaElement) => ({
      uischema: el,
      schema,
      path
    }));
  }

  updatedElements() {
    const key = `jsonforms-category-${this.label}-${this.path}`;
    const value = this.paramsService.get(key);
    if (value === undefined) {
      return this.elements;
    }
    this.paramsService.remove(key);
    this.elements = value.uischema.elements.map(
      (el: UISchemaElement, index: number) => {
        const existingEl = this.elements[index];

        if (_.isEqual(existingEl.uischema, el)) {
          return existingEl;
        }

        return {
          uischema: el,
          schema: value.schema,
          path: value.path
        };
      }
    );

    const remaining = value.uischema.elements.slice(this.elements.length);
    remaining.forEach(this.elements.push);

    return this.elements;
  }
}
