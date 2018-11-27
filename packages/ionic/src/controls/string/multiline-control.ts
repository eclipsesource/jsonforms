import { Component } from '@angular/core';
import {
    isMultiLineControl,
    JsonFormsState,
    RankedTester,
    rankWith
} from '@jsonforms/core';
import { NgRedux } from '@angular-redux/store';
import { JsonFormsControl } from '@jsonforms/angular';

@Component({
    selector: 'jsonforms-textarea-control',
    template: `
      <ion-item no-padding no-lines text-wrap [hidden]='hidden'>
          <ion-label floating>{{label}}</ion-label>
          <ion-label stacked *ngIf="error" color="error">{{error}}</ion-label>
          <ion-textarea
                  type="text"
                  (ionChange)="onChange($event)"
                  [value]="getValue()"
                  placeholder="{{ description }}"
                  [id]="id"
                  [formControl]="form"
          >
          </ion-textarea>
      </ion-item>
  `
})
export class MultilineControlRenderer extends JsonFormsControl {
    constructor(ngRedux: NgRedux<JsonFormsState>) {
        super(ngRedux);
    }
    getValue = () => this.data || '';
}

export const multilineControlTester: RankedTester = rankWith(
    2,
    isMultiLineControl
);
