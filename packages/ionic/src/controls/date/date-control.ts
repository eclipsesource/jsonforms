import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { isDateControl, JsonFormsState, RankedTester, rankWith } from '@jsonforms/core';
import { JsonFormsControl } from '@jsonforms/angular';

@Component({
  selector: 'jsonforms-date-control',
  template: `
      <ion-item>
          <ion-label floating>{{label}}</ion-label>
          <ion-label stacked *ngIf="error" style="color: red">{{error}}</ion-label>
          <ion-datetime
                  displayFormat="MM/DD/YYYY"
                  [ngModel]="data"
                  (ionChange)="onChange($event)"
          ></ion-datetime>
      </ion-item>
  `
})
export class DateControlRenderer extends JsonFormsControl {

  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }
}

export const dateControlTester: RankedTester = rankWith(
  2,
  isDateControl
);
