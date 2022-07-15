/*
  The MIT License

  Copyright (c) 2017-2020 EclipseSource Munich
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
import { ExampleDescription, getExamples } from '@jsonforms/examples';
import { JsonFormsI18nState, UISchemaElement, UISchemaTester } from '@jsonforms/core';
import { angularMaterialRenderers } from '../../src/index';
import { DateAdapter } from '@angular/material/core';

const uiSchema = {
  type: 'HorizontalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/buyer/properties/email'
    },
    {
      type: 'Control',
      scope: '#/properties/status'
    }
  ]
};
const defaultI18n: JsonFormsI18nState = {
  locale: 'en-US'
};
const itemTester: UISchemaTester = (_schema, schemaPath, _path) => {
  if (schemaPath === '#/properties/warehouseitems/items') {
    return 10;
  }
  return -1;
};
@Component({
  selector: 'app-root',
  template: `
    <h1>Angular Material Examples</h1>
    Data: {{ selectedExample.data | json }}
    <div>
      Example:
      <select (change)="onChange($event)">
        <option
          *ngFor="let example of examples"
          value="{{ example.name }}"
          label="{{ example.label }}"
        >
          {{ example.label }}
        </option>
      </select>
    </div>
    <div>
      <button (click)="changeLocale('de-DE')">Change locale to de-DE</button>
      <button (click)="changeLocale('en-US')">Change locale to en-US</button>
      Current locale: {{ currentLocale }}
      <button (click)="toggleReadonly()">
        {{ readonly ? 'Unset' : 'Set' }} Readonly
      </button>
    </div>
    <jsonforms
      [(data)]="selectedExample.data"
      [schema]="selectedExample.schema"
      [uischema]="selectedExample.uischema"
      [renderers]="renderers"
      [i18n]="i18n"
      [uischemas]="uischemas"
      [readonly]="readonly"
      [config]="config"
    ></jsonforms>
  `
})
export class AppComponent {
  readonly renderers = angularMaterialRenderers;
  readonly examples = getExamples();
  selectedExample: ExampleDescription;
  i18n: JsonFormsI18nState;
  private dateAdapter;
  private readonly = false;
  data: any;
  uischemas: { tester: UISchemaTester; uischema: UISchemaElement; }[] = [
    { tester: itemTester, uischema: uiSchema }
  ];

  constructor(dateAdapter: DateAdapter<Date>) {
    this.selectedExample = this.examples[19];
    this.dateAdapter = dateAdapter;
    this.i18n = this.selectedExample.i18n ?? defaultI18n;
    dateAdapter.setLocale(this.i18n.locale);
  }

  onChange(ev: any) {
    this.selectedExample = this.examples.find(e => e.name === ev.target.value);
    this.i18n = this.selectedExample.i18n ?? defaultI18n;
  }

  changeLocale(locale: string) {
    this.i18n.locale = locale;
    this.dateAdapter.setLocale(locale);
  }

  toggleReadonly() {
    this.readonly = !this.readonly;
  }
}
