import { Component } from '@angular/core';
import { JsonFormsState, RankedTester, rankWith, uiTypeIs } from '@jsonforms/core';
import { JsonFormsIonicLayout } from '../JsonFormsIonicLayout';
import { NgRedux } from '@angular-redux/store';

@Component({
  selector: 'jsonforms-vertical-layout',
  template: `
      <ion-list no-lines *ngFor="let element of uischema?.elements">
          <jsonforms-outlet
                  [uischema]="element"
                  [path]="path"
                  [schema]="schema"
          ></jsonforms-outlet>
      </ion-list>
  `
})
export class VerticalLayoutRenderer extends JsonFormsIonicLayout {
  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }
}

export const verticalLayoutTester: RankedTester = rankWith(1, uiTypeIs('VerticalLayout'));
