import { Component } from '@angular/core';
import { JsonFormsState, RankedTester, rankWith, uiTypeIs } from '@jsonforms/core';
import { JsonFormsIonicLayout } from '../JsonFormsIonicLayout';
import { NgRedux } from '@angular-redux/store';

@Component({
  selector: 'jsonforms-vertical-layout',
  template: `
      <div *ngFor="let element of uischema?.elements">
          <jsonforms-outlet
                  [uischema]="element"
                  [path]="path"
                  [schema]="schema"
          ></jsonforms-outlet>
      </div>
  `
})
export class VerticalLayoutRenderer extends JsonFormsIonicLayout {
  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }
}

export const verticalLayoutTester: RankedTester = rankWith(1, uiTypeIs('VerticalLayout'));
