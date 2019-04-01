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
