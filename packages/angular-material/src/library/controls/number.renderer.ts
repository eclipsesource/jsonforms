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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import {
  isIntegerControl,
  isNumberControl,
  or,
  RankedTester,
  rankWith,
  StatePropsOfControl,
} from '@jsonforms/core';
import merge from 'lodash/merge';

@Component({
  selector: 'NumberControlRenderer',
  template: `
    <mat-form-field [ngStyle]="{ display: hidden ? 'none' : '' }">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        (input)="onChange($event)"
        [value]="getValue()"
        [id]="id"
        [formControl]="form"
        [min]="min"
        [max]="max"
        [step]="multipleOf"
        (focus)="focused = true"
        (focusout)="focused = false"
      />
      <mat-hint *ngIf="shouldShowUnfocusedDescription() || focused">{{
        description
      }}</mat-hint>
      <mat-error>{{ error }}</mat-error>
    </mat-form-field>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: row;
      }
      mat-form-field {
        flex: 1 1 auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberControlRenderer extends JsonFormsControl {
  private readonly MAXIMUM_FRACTIONAL_DIGITS = 20;

  oldValue: string;
  min: number;
  max: number;
  multipleOf: number;
  locale: string;
  numberFormat: Intl.NumberFormat;
  decimalSeparator: string;
  focused = false;

  constructor(jsonformsService: JsonFormsAngularService) {
    super(jsonformsService);
  }

  onChange(ev: any) {
    const data = this.oldValue
      ? ev.target.value.replace(this.oldValue, '')
      : ev.target.value;
    // ignore these
    if (
      data === '.' ||
      data === ',' ||
      data === ' ' ||
      // if the value is 0 and we already have a value then we ignore
      (data === '0' &&
        this.getValue() !== '' &&
        // a 0 in the first place
        ((ev.target.selectionStart === 1 && ev.target.selectionEnd === 1) ||
          // or in the last place as this doesn't change the value (when there is a separator)
          (ev.target.selectionStart === ev.target.value.length &&
            ev.target.selectionEnd === ev.target.value.length &&
            ev.target.value.indexOf(this.decimalSeparator) !== -1)))
    ) {
      this.oldValue = ev.target.value;
      return;
    }
    super.onChange(ev);
    this.oldValue = this.getValue();
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

  mapAdditionalProps(props: StatePropsOfControl) {
    if (this.scopedSchema) {
      const testerContext = {
        rootSchema: this.rootSchema,
        config: props.config,
      };
      const defaultStep = isNumberControl(
        this.uischema,
        this.rootSchema,
        testerContext
      )
        ? 0.1
        : 1;
      this.min = this.scopedSchema.minimum;
      this.max = this.scopedSchema.maximum;
      this.multipleOf = this.scopedSchema.multipleOf || defaultStep;
      const appliedUiSchemaOptions = merge(
        {},
        props.config,
        this.uischema.options
      );
      const currentLocale = this.jsonFormsService.getLocale();
      if (this.locale === undefined || this.locale !== currentLocale) {
        this.locale = currentLocale;
        this.numberFormat = new Intl.NumberFormat(this.locale, {
          useGrouping: appliedUiSchemaOptions.useGrouping,
          maximumFractionDigits: this.MAXIMUM_FRACTIONAL_DIGITS,
        });
        this.determineDecimalSeparator();
        this.oldValue = this.getValue();
      }
      this.form.setValue(this.getValue());
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
