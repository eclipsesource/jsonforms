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
  isEnumControl,
  JsonFormsState,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { JsonFormsControl } from '@jsonforms/angular';

@Component({
  selector: 'jsonforms-enum-control',
  template: `
    <ion-item no-padding no-lines>
      <ion-label>{{ label }}</ion-label>
      <ion-label stacked *ngIf="error" color="error">{{ error }}</ion-label>
      <ion-select [ngModel]="data" (ionChange)="onChange($event)">
        <ion-option *ngFor="let option of options" value="{{ option }}">
          {{ option }}
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

export const enumControlTester: RankedTester = rankWith(2, isEnumControl);
