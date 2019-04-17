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
import { NgRedux, select } from '@angular-redux/store';
import { Component } from '@angular/core';
import { Actions, JsonFormsState, setLocale } from '@jsonforms/core';
import { ExampleDescription } from '@jsonforms/examples';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  template: `
    <h1>Angular Material Examples</h1>
    Data: <print-redux></print-redux>
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
    </div>
    <jsonforms-outlet></jsonforms-outlet>
  `
})
export class AppComponent {
  @select(['examples', 'data']) readonly exampleData$: Observable<any>;
  currentLocale = 'en-US';

  constructor(
    private ngRedux: NgRedux<
      JsonFormsState & { examples: { data: ExampleDescription[] } }
    >
  ) {}

  onChange = (ev: any) => {
    const selectedExample = this.ngRedux
      .getState()
      .examples.data.find(e => e.name === ev.target.value);
    this.ngRedux.dispatch(
      Actions.init(
        selectedExample.data,
        selectedExample.schema,
        selectedExample.uischema
      )
    );
    this.ngRedux.dispatch(setLocale(this.currentLocale));
  };

  changeLocale(locale: string) {
    this.currentLocale = locale;
    this.ngRedux.dispatch(setLocale(locale));
  }
}
