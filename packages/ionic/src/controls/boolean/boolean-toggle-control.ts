import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import {
    and,
    isBooleanControl,
    JsonFormsState,
    optionIs,
    RankedTester,
    rankWith
} from '@jsonforms/core';
import { JsonFormsControl } from '@jsonforms/angular';
import { Toggle } from 'ionic-angular';

@Component({
    selector: 'jsonforms-toggle-control',
    template: `
      <ion-item no-padding>
          <ion-label>{{label}}</ion-label>
          <ion-label stacked *ngIf="error" color="error">{{error}}</ion-label>
          <ion-toggle
            [checked]="isChecked()"
            (ionChange)="onChange($event)"
            [disabled]="!enabled"
            [hidden]="hidden"
            [id]="id"
          ></ion-toggle>
      </ion-item>
  `
})
export class BooleanToggleControlRenderer extends JsonFormsControl {
    constructor(ngRedux: NgRedux<JsonFormsState>) {
        super(ngRedux);
    }
    isChecked = () => this.data || false;
    getEventValue = (toggle: Toggle) => toggle.value;
}

export const booleanToggleControlTester: RankedTester = rankWith(
    3,
    and(isBooleanControl, optionIs('toggle', true))
);
