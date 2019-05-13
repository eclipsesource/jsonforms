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
import { NgRedux } from '@angular-redux/store';
import { Component } from '@angular/core';
import { JsonFormsControl } from '@jsonforms/angular';
import {
  getLocale,
  isIntegerControl,
  isNumberControl,
  JsonFormsState,
  or,
  RankedTester,
  rankWith
} from '@jsonforms/core';

@Component({
  selector: 'NumberControlRenderer',
  template: `
    <mat-form-field fxFlex [fxHide]="hidden">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        (input)="onChange($event)"
        placeholder="{{ description }}"
        [value]="getValue()"
        [id]="id"
        [formControl]="form"
        [min]="min"
        [max]="max"
        [step]="multipleOf"
      />
      <mat-error>{{ error }}</mat-error>
    </mat-form-field>
  `
})
export class NumberControlRenderer extends JsonFormsControl {
  private readonly MAXIMUM_FRACTIONAL_DIGITS = 20;
  min: number;
  max: number;
  multipleOf: number;
  locale: string;
  numberFormat: Intl.NumberFormat;
  decimalSeparator: string;

  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }

  onChange(ev: any) {
    // ignore these
    if (
      ev.data === '.' ||
      ev.data === ',' ||
      ev.data === ' ' ||
      // if the value is 0 and we already have a value then we ignore
      (ev.data === '0' &&
        this.getValue() !== '' &&
        // a 0 in the first place
        ((ev.target.selectionStart === 1 && ev.target.selectionEnd === 1) ||
          // or in the last place as this doesn't change the value
          (ev.target.selectionStart === ev.target.value.length &&
            ev.target.selectionEnd === ev.target.value.length)))
    ) {
      return;
    }
    super.onChange(ev);
  }
  getEventValue = (event: any) => {
    const cleanPattern = new RegExp(`[^-+0-9${this.decimalSeparator}]`, 'g');
    const cleaned = event.target.value.replace(cleanPattern, '');
    const normalized = cleaned.replace(this.decimalSeparator, '.');

    if (normalized === '') {
      return undefined;
    }

    // convert to number
    const number = +normalized;
    // if not a number just return the string
    if (Number.isNaN(number)) {
      return event.target.value;
    }
    return number;
  };

  getValue = () => {
    if (this.data !== undefined && this.data !== null) {
      if (typeof this.data === 'number') {
        return this.numberFormat.format(this.data);
      }
      return this.data;
    }
    return '';
  };

  mapAdditionalProps() {
    if (this.scopedSchema) {
      const defaultStep = isNumberControl(this.uischema, this.schema) ? 0.1 : 1;
      this.min = this.scopedSchema.minimum;
      this.max = this.scopedSchema.maximum;
      this.multipleOf = this.scopedSchema.multipleOf || defaultStep;
      const currentLocale = getLocale(this.ngRedux.getState());
      if (this.locale === undefined || this.locale !== currentLocale) {
        this.locale = currentLocale;
        this.numberFormat = new Intl.NumberFormat(this.locale, {
          maximumFractionDigits: this.MAXIMUM_FRACTIONAL_DIGITS
        });
        this.determineDecimalSeparator();
      }
    }
  }

  private determineDecimalSeparator(): void {
    const example = this.numberFormat.format(1.1);
    this.decimalSeparator = example.charAt(1);
  }
}
export const NumberControlRendererTester: RankedTester = rankWith(
  2,
  or(isNumberControl, isIntegerControl)
);
