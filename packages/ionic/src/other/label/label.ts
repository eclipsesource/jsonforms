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
      <ion-label> {{ label }} </ion-label>
    </ion-item>
  `
})
export class LabelRenderer extends JsonFormsIonicLayout {
  label: string;

  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
    this.initializers.push((props: JsonFormsProps) => {
      const labelEl = props.uischema as LabelElement;
      this.label = labelEl.text;
    });
  }
}

export const labelTester: RankedTester = rankWith(4, uiTypeIs('Label'));
