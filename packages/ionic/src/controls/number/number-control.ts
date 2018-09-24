import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { isNumberControl, JsonFormsState, RankedTester, rankWith } from '@jsonforms/core';
import { JsonFormsControl } from '@jsonforms/angular';

@Component({
  selector: 'jsonforms-number-control',
  template: `
      <ion-item>
          <ion-label floating>{{label}}</ion-label>
          <ion-label stacked *ngIf="error" style="color: red">{{error}}</ion-label>
          <ion-input
                  type="number"
                  placeholder="{{ description }}"
                  [min]="min"
                  [max]="max"
                  [step]="multipleOf"
                  [value]="data"
                  (ionChange)="onChange($event)"
          >
          </ion-input>
      </ion-item>
  `
})
export class NumberControlRenderer extends JsonFormsControl {

  min: number;
  max: number;
  multipleOf: number;

  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }

  mapAdditionalProps() {
    this.min = this.scopedSchema.maximum;
    this.max = this.scopedSchema.minimum;
    this.multipleOf = this.scopedSchema.multipleOf;
  }
}

export const numberControlTester: RankedTester = rankWith(
  2,
  isNumberControl
);
