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
import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  isDateControl,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';

@Component({
  selector: 'DateControlRenderer',
  template: `
    <mat-form-field fxFlex [fxHide]="hidden">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        (dateChange)="onChange($event)"
        [id]="id"
        [formControl]="form"
        [matDatepicker]="datepicker"
        (focus)="focused = true" 
        (focusout)="focused = false"
      />
      <mat-datepicker-toggle
        matSuffix
        [for]="datepicker"
      ></mat-datepicker-toggle>
      <mat-datepicker #datepicker></mat-datepicker>
      <mat-hint *ngIf="shouldShowUnfocusedDescription() || focused">{{ description }}</mat-hint>
      <mat-error>{{ error }}</mat-error>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateControlRenderer extends JsonFormsControl {
  constructor(
    jsonformsService: JsonFormsAngularService,
  ) {
    super(jsonformsService);
  }

  getEventValue = (event: any) => event.value.toISOString().substr(0, 10);
}

export const DateControlRendererTester: RankedTester = rankWith(
  2,
  isDateControl
);
