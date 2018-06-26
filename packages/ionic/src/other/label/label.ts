import { Component } from '@angular/core';
import { JsonFormsState, RankedTester, rankWith, uiTypeIs } from '@jsonforms/core';
import { NgRedux } from '@angular-redux/store';
import { JsonFormsIonicLayout } from '../../layouts/JsonFormsIonicLayout';

@Component({
  selector: 'label',
  template: `
      <div>
          {{label}}
      </div>
  `
})
export class LabelRenderer extends JsonFormsIonicLayout {

  label: string;

  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }

  ngOnInit() {
    // TODO: this is using connectLayoutToJsonForms
    const state$ = this.connectLayoutToJsonForms(this.ngRedux, this.getOwnProps());
    this.subscription = state$.subscribe(state => {
      this.label = state.uischema.label;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

export const labelTester: RankedTester = rankWith(
  4,
  uiTypeIs('Label')
);
