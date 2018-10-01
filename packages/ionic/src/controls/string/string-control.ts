import { Component } from '@angular/core';
import { isControl, JsonFormsState, RankedTester, rankWith } from '@jsonforms/core';
import { NgRedux } from '@angular-redux/store';
import { JsonFormsControl } from '@jsonforms/angular';

@Component({
  selector: 'jsonforms-string-control',
  template: `
      <ion-item>
          <ion-label floating>{{label}}</ion-label>
          <!-- TODO: displays the actual error, question is where we want to actually display it -->
          <ion-label stacked *ngIf="error" color="error">{{error}}</ion-label>
          <ion-input
                  type="text"
                  (ionChange)="onChange($event)"
                  [value]="getValue()"
                  placeholder="{{ description }}"
                  [id]="id"
                  [formControl]="form"
          >
          </ion-input>
      </ion-item>
  `
})
export class StringControlRenderer extends JsonFormsControl {
  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }
  getValue = () => this.data || '';
}

export const stringControlTester: RankedTester = rankWith(
  1,
  isControl
);
