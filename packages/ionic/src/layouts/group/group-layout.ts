import {
  GroupLayout,
  JsonFormsProps,
  JsonFormsState,
  RankedTester,
  rankWith,
  uiTypeIs
} from '@jsonforms/core';
import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { JsonFormsIonicLayout } from '../JsonFormsIonicLayout';

@Component({
  selector: 'jsonforms-group-layout',
  template: `
    <ion-card>
      <ion-card-header> {{ label }} </ion-card-header>
      <ion-card-content>
        <div *ngFor="let element of uischema?.elements">
          <jsonforms-outlet
            [uischema]="element"
            [path]="path"
            [schema]="schema"
          ></jsonforms-outlet>
        </div>
      </ion-card-content>
    </ion-card>
  `
})
export class GroupLayoutRenderer extends JsonFormsIonicLayout {
  label: string;

  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
    this.initializers.push((props: JsonFormsProps) => {
      this.label = (props.uischema as GroupLayout).label;
    });
  }
}

export const groupTester: RankedTester = rankWith(1, uiTypeIs('Group'));
