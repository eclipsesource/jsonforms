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
