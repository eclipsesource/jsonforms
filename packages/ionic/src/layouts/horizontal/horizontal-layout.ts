import { Component } from '@angular/core';
import { JsonFormsState, RankedTester, rankWith, uiTypeIs } from '@jsonforms/core';
import { JsonFormsIonicLayout } from '../JsonFormsIonicLayout';
import { NgRedux } from '@angular-redux/store';

@Component({
  selector: 'jsonforms-horizontal-layout',
  template: `
      <ion-grid>
          <ion-row>
              <ion-col *ngFor="let element of uischema?.elements">
                  <jsonforms-outlet
                          [uischema]="element"
                          [schema]="schema"
                          [path]="path"
                  ></jsonforms-outlet>
              </ion-col>
          </ion-row>
      </ion-grid>
  `
})
export class HorizontalLayoutRenderer extends JsonFormsIonicLayout {

  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }

}

export const horizontalLayoutTester: RankedTester = rankWith(1, uiTypeIs('HorizontalLayout'));
