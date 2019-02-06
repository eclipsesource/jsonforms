import isEmpty from 'lodash/isEmpty';
import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import {
  ControlProps,
  getLocale,
  isIntegerControl,
  isNumberControl,
  JsonFormsState,
  or,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { JsonFormsControl } from '@jsonforms/angular';
import { L10nDecimalPipe, LocaleService, LocaleValidation } from 'angular-l10n';

@Component({
  selector: 'jsonforms-number-control',
  template: `
    <ion-item no-padding no-lines [hidden]="hidden">
      <ion-label stacked>{{ label }}</ion-label>
      <ion-label stacked *ngIf="error" color="error">{{ error }}</ion-label>
      <ion-input
        type="text"
        placeholder="{{ description }}"
        [id]="id"
        [value]="
          displayValue !== undefined && displayValue !== null
            ? displayValue
            : ''
        "
        [min]="min"
        [max]="max"
        [step]="step"
        [disabled]="!enabled"
        [readonly]="!enabled"
        (ionBlur)="onChange($event)"
      >
      </ion-input>
    </ion-item>
  `
})
export class NumberControlRenderer extends JsonFormsControl {
  min: number;
  max: number;
  step: number;
  locale: string;
  displayValue: string;

  constructor(
    ngRedux: NgRedux<JsonFormsState>,
    private localeService: LocaleService,
    private localeValidation: LocaleValidation
  ) {
    super(ngRedux);
  }

  getEventValue = (event: any) => {
    if (this.locale) {
      const parsedNumber = this.localeValidation.parseNumber(
        event.value,
        this.locale
      );
      if (isNaN(parsedNumber)) {
        return null;
      }
      return parsedNumber;
    }

    if (this.scopedSchema.type === 'number') {
      return parseFloat(event.value);
    } else {
      return parseInt(event.value, 10);
    }
  };

  mapAdditionalProps(props: ControlProps) {
    if (!isEmpty(props.schema)) {
      // TODO
      const defaultStep = isNumberControl(this.uischema, this.schema) ? 0.1 : 1;
      this.min = props.schema.minimum;
      this.max = props.schema.maximum;
      this.step = props.schema.multipleOf || defaultStep;
      // this doesn't seem to work reliably; an entered value will be formatted
      // the 1st time when blurring out, but it doesn't work the 2nd time
      // although the internal state seems correct
      const pipe = new L10nDecimalPipe();
      this.locale = getLocale(this.ngRedux.getState());
      this.localeService.setDefaultLocale(this.locale);
      if (this.locale) {
        this.displayValue = pipe.transform(props.data, this.locale);
      } else {
        this.displayValue = props.data;
      }
    }
  }
}

export const numberControlTester: RankedTester = rankWith(
  2,
  or(isNumberControl, isIntegerControl)
);
