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
import { JsonFormsAngularService } from '@jsonforms/angular';
import {
  Actions,
  getData,
  getUiSchema,
  setLocale,
  setReadonly,
  unsetReadonly
} from '@jsonforms/core';
import { getExamples } from '@jsonforms/examples';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  template: `
    <h1>Angular Material Examples</h1>
    Data: {{ data | json }}
    <div>
      Example:
      <select (change)="onChange($event)">
        <option
          *ngFor="let example of exampleData$ | async"
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
      <button (click)="setReadonly()">
        {{ readonly ? 'Unset' : 'Set' }} Readonly
      </button>
    </div>
    <jsonforms-outlet></jsonforms-outlet>
  `
})
export class AppComponent {
  readonly exampleData$ = of(getExamples());
  currentLocale = 'en-US';
  private readonly = false;
  data: any;

  constructor(private jsonformService: JsonFormsAngularService) {
    const examples = getExamples();
    const selectedExample = examples[0];
    this.jsonformService.updateCore(
      Actions.init(
        selectedExample.data,
        selectedExample.schema,
        selectedExample.uischema
      )
    );

    this.jsonformService.$state.pipe(
      map(state => getData(state))
    ).subscribe(data => this.data = data);
  }
  examples() {
    return getExamples();
  }

  onChange = (ev: any) => {
    const examples = getExamples();
    const selectedExample = examples.find(e => e.name === ev.target.value);
    this.jsonformService.updateCore(
      Actions.init(
        selectedExample.data,
        selectedExample.schema,
        selectedExample.uischema
      )
    );
    this.jsonformService.updateLocale(setLocale(this.currentLocale));
  };

  changeLocale(locale: string) {
    this.currentLocale = locale;
    this.jsonformService.updateLocale(setLocale(locale));
  }

  setReadonly() {
    const uischema = getUiSchema(this.jsonformService.getState());
    if (this.readonly) {
      unsetReadonly(uischema);
    } else {
      setReadonly(uischema);
    }
    this.readonly = !this.readonly;
    this.jsonformService.updateCore(Actions.setUISchema(uischema));
  }
}
