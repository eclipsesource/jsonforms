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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { isMultiLineControl, RankedTester, rankWith } from '@jsonforms/core';

@Component({
  selector: 'TextAreaRenderer',
  template: `
    <mat-form-field fxFlex [fxHide]="hidden">
      <mat-label>{{ label }}</mat-label>
      <textarea
        matInput
        (input)="onChange($event)"
        [id]="id"
        [formControl]="form"
        (focus)="focused = true"
        (focusout)="focused = false"
      ></textarea>
      <mat-hint *ngIf="shouldShowUnfocusedDescription() || focused">{{
        description
      }}</mat-hint>
      <mat-error>{{ error }}</mat-error>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaRenderer extends JsonFormsControl {
  constructor(jsonformsService: JsonFormsAngularService) {
    super(jsonformsService);
  }
  getEventValue = (event: any) => event.target.value || undefined;
}
export const TextAreaRendererTester: RankedTester = rankWith(
  2,
  isMultiLineControl
);
