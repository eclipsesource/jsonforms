import * as _ from 'lodash';
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
import { LocaleService, LocaleValidation } from 'angular-l10n';

@Component({
  selector: 'jsonforms-number-control',
  template: `
      <ion-item no-padding no-lines>
          <ion-label floating>{{label}} -- {{locale}}</ion-label>
          <ion-label stacked *ngIf="error" color="error">{{error}}</ion-label>
          <ion-input
                  placeholder="{{ description }}"
                  [id]="id"
                  [min]="min"
                  [max]="max"
                  [step]="step"
                  [value]="data !== undefined && data !== null && locale ?
                    (data |  l10nDecimal:locale) :
                    (data !== undefined && data !== null ? data : '')"
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

  constructor(
    ngRedux: NgRedux<JsonFormsState>,
    private localeService: LocaleService,
    private localeValidation: LocaleValidation
  ) {
    super(ngRedux);
  }

  getEventValue = (event: any) => {
    if (this.locale) {
      const parsedNumber = this.localeValidation.parseNumber(event.value, this.locale);
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
  }

  mapAdditionalProps(props: ControlProps) {
    if (!_.isEmpty(props.scopedSchema)) {
      this.locale = getLocale(this.ngRedux.getState());
      this.localeService.setDefaultLocale(this.locale);
      const defaultStep = isNumberControl(this.uischema, this.schema) ? 0.1 : 1;
      this.min = props.scopedSchema.minimum;
      this.max = props.scopedSchema.maximum;
      this.step = props.scopedSchema.multipleOf || defaultStep;
    }
  }
}

export const numberControlTester: RankedTester = rankWith(
  2,
  or(isNumberControl, isIntegerControl)
);
