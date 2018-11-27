import * as _ from 'lodash';
import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import {
    ControlProps,
    isIntegerControl,
    isNumberControl,
    JsonFormsState,
    or,
    RankedTester,
    rankWith
} from '@jsonforms/core';
import { JsonFormsControl } from '@jsonforms/angular';

@Component({
  selector: 'jsonforms-number-control',
  template: `
      <ion-item no-padding no-lines>
          <ion-label floating>{{label}}</ion-label>
          <ion-label stacked *ngIf="error" color="error">{{error}}</ion-label>
          <ion-input
                  type="number"
                  placeholder="{{ description }}"
                  [id]="id"
                  [min]="min"
                  [max]="max"
                  [step]="step"
                  [value]="data"
                  [disabled]="!enabled"
                  [readonly]="!enabled"
                  (ionChange)="onChange($event)"
          >
          </ion-input>
      </ion-item>
  `
})
export class NumberControlRenderer extends JsonFormsControl {

  min: number;
  max: number;
  step: number;

  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }

  getEventValue = (event: any) => Number(event.value);

  mapAdditionalProps(props: ControlProps) {
      if (!_.isEmpty(props.scopedSchema)) {
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
