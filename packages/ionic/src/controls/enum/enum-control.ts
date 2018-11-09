import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { isEnumControl, JsonFormsState, RankedTester, rankWith } from '@jsonforms/core';
import { JsonFormsControl } from '@jsonforms/angular';

@Component({
  selector: 'jsonforms-enum-control',
  template: `
      <ion-item>
          <ion-label>{{label}}</ion-label>
          <ion-label stacked *ngIf="error" color="error">{{error}}</ion-label>
          <ion-select [ngModel]="data" (ionChange)="onChange($event)">
              <ion-option *ngFor="let option of options" value="{{option}}">
                  {{option}}
              </ion-option>
          </ion-select>
      </ion-item>
  `
})
export class EnumControlRenderer extends JsonFormsControl {

  options: any[];

  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }

  mapAdditionalProps() {
    this.options = this.scopedSchema.enum;
  }

  getEventValue = (ev: any) => ev;
}

export const enumControlTester: RankedTester = rankWith(
  2,
  isEnumControl
);
