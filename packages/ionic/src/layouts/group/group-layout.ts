import {
  GroupLayout,
  JsonFormsState,
  RankedTester,
  rankWith,
  StatePropsOfLayout,
  uiTypeIs
} from '@jsonforms/core';
import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { JsonFormsIonicLayout } from '../JsonFormsIonicLayout';

@Component({
  selector: 'jsonforms-group-layout',
  template: `
      <ion-card>
          <ion-card-header>
              {{label}}
          </ion-card-header>
          <ion-card-content>
              <div *ngFor="let uischema of stateProps.uischema.elements">
                  <jsonforms-outlet
                          [uischema]="uischema"
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
  stateProps: StatePropsOfLayout;

  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }

  ngOnInit() {
    const ownProps = this.getOwnProps()
    const state$ = this.connectLayoutToJsonForms(this.ngRedux, ownProps);
    this.subscription = state$.subscribe(state => {
      this.stateProps = state;
      this.label = (ownProps.uischema as GroupLayout).label;
    });
  }
}

export const groupTester: RankedTester = rankWith(1, uiTypeIs('Group'));
