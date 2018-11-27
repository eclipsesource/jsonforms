import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { isDateControl, JsonFormsState, RankedTester, rankWith } from '@jsonforms/core';
import { JsonFormsControl } from '@jsonforms/angular';
import { DateAdapter, NativeDateAdapter } from '@angular/material';

@Component({
  selector: 'DateControlRenderer',
  template: `
  <mat-form-field fxFlex [fxHide]="hidden">
    <mat-label>{{ label }}</mat-label>
    <input
        matInput
        (dateChange)="onChange($event)"
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

  constructor(
    ngRedux: NgRedux<JsonFormsState>,
    private dateAdapter: DateAdapter<NativeDateAdapter>
  ) {
    super(ngRedux);
  }

  mapAdditionalProps() {
    const locale = this.ngRedux.getState().jsonforms.i18n.locale;
    this.dateAdapter.setLocale(locale);
  }

  getEventValue = (event: any) => event.value.toISOString().substr(0, 10);
}

export const DateControlRendererTester: RankedTester = rankWith(
  2,
  isDateControl
);
