import { Component } from '@angular/core';
import {
  JsonFormsProps,
  JsonFormsState,
  LabelElement,
  RankedTester,
  rankWith,
  uiTypeIs
} from '@jsonforms/core';
import { NgRedux } from '@angular-redux/store';
import { JsonFormsIonicLayout } from '../../layouts/JsonFormsIonicLayout';

@Component({
  selector: 'label',
  template: `
      <ion-item>
        <ion-label>
          {{label}}
        </ion-label>
      </ion-item>
  `
})
export class LabelRenderer extends JsonFormsIonicLayout {

  label: string;

  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
    this.initializers.push((props: JsonFormsProps)  => {
      const labelEl = (props.uischema as LabelElement);
      this.label = labelEl.text;
    });
  }
}

export const labelTester: RankedTester = rankWith(
  4,
  uiTypeIs('Label')
);
