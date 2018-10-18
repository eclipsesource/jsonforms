import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { isDateControl, JsonFormsState, RankedTester, rankWith } from '@jsonforms/core';
import { JsonFormsControl } from '@jsonforms/angular';

@Component({
  selector: 'DateControlRenderer',
  template: `
  <mat-form-field fxFlex>
    <mat-label>{{ label }}</mat-label>
    <input
        matInput
        (dateChange)="onChange($event)"
        [value]="data"
        placeholder="{{ description }}"
        [id]="id"
        [formControl]="form"
        [matDatepicker]="datepicker"
    >
    <mat-datepicker-toggle matSuffix [for]="datepicker"></mat-datepicker-toggle>
    <mat-datepicker #datepicker></mat-datepicker>

    <mat-error>{{ error }}</mat-error>
  </mat-form-field>
  `
})
export class DateControlRenderer extends JsonFormsControl {

  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }
  getEventValue = (event: any) => event.value.toISOString().substr(0, 10);
}

export const DateControlRendererTester: RankedTester = rankWith(
  2,
  isDateControl
);
