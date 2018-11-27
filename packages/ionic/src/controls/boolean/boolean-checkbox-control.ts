import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { isBooleanControl, JsonFormsState, RankedTester, rankWith } from '@jsonforms/core';
import { JsonFormsControl } from '@jsonforms/angular';

@Component({
  selector: 'jsonforms-boolean-control',
  template: `
      <ion-item no-padding [hidden]='hidden'>
          <ion-label>{{label}}</ion-label>
          <ion-label stacked *ngIf="error" color="error">{{error}}</ion-label>
          <ion-checkbox [checked]="isChecked()"
            (ionChange)="onChange($event)"
            [disabled]="!enabled"
            [id]="id"
          ></ion-checkbox>
      </ion-item>
  `
})
export class BooleanCheckboxControlRenderer extends JsonFormsControl {
  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }
  isChecked = () => this.data || false;
}

export const booleanControlTester: RankedTester = rankWith(
  2,
  isBooleanControl
);
