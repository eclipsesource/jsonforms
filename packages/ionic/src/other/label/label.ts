import { Component } from '@angular/core';
import { JsonFormsState, LabelElement, RankedTester, rankWith, uiTypeIs } from '@jsonforms/core';
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

    mapAdditionalProps() {
        this.label = (this.uischema as LabelElement).text;
    }
}

export const labelTester: RankedTester = rankWith(
    4,
    uiTypeIs('Label')
);
