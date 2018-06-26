import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { JsonFormsState, isNumberControl, RankedTester, rankWith } from '@jsonforms/core';
import { JsonFormsControl } from '@jsonforms/angular';

@Component({
  selector: 'jsonforms-number-control',
  template: `
      <ion-item>
          <ion-label floating>{{label}}</ion-label>
          <ion-input
                  type="number"
                  placeholder="{{ description }}"
                  [min]="min"
                  [max]="max"
                  [step]="multipleOf"
                  [value]="value"
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

  ngOnInit() {
    super.ngOnInit();
    this.min = this.scopedSchema.minimum || null;
    this.max = this.scopedSchema.maximum || null;
    this.multipleOf = this.scopedSchema.multipleOf || null;
  }
}

export const numberControlTester: RankedTester = rankWith(
  2,
  isNumberControl
);
