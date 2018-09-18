import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { isBooleanControl, JsonFormsState, RankedTester, rankWith } from '@jsonforms/core';
import { JsonFormsControl } from '@jsonforms/angular';

@Component({
  selector: 'jsonforms-boolean-control',
  template: `
      <ion-item>
          <ion-label>{{label}}</ion-label>
          <ion-label stacked *ngIf="error" style="color: red">{{error}}</ion-label>
          <ion-checkbox [ngModel]="value" (ionChange)="onChange($event)"></ion-checkbox>
      </ion-item>
  `
})
export class BooleanControlRenderer extends JsonFormsControl {
  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }
}

export const booleanControlTester: RankedTester = rankWith(
  2,
  isBooleanControl
);
