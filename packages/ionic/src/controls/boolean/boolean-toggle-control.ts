/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
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
import { IonToggle } from '@ionic/angular';

@Component({
  selector: 'jsonforms-toggle-control',
  template: `
    <ion-item no-padding>
      <ion-label>{{ label }}</ion-label>
      <ion-label stacked *ngIf="error" color="error">{{ error }}</ion-label>
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
  getEventValue = (toggle: IonToggle) => toggle.value;
}

export const booleanToggleControlTester: RankedTester = rankWith(
  3,
  and(isBooleanControl, optionIs('toggle', true))
);
