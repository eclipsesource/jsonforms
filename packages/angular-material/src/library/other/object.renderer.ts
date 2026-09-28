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
import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  JsonFormsControlWithDetail,
  JsonFormsModule,
} from '@jsonforms/angular';
import { MatCardModule } from '@angular/material/card';
import {
  ControlWithDetailProps,
  Generate,
  GroupLayout,
  isObjectControl,
  OwnPropsOfRenderer,
  RankedTester,
  rankWith,
  UISchemaElement,
} from '@jsonforms/core';
import cloneDeep from 'lodash/cloneDeep';
import { createDetailUiSchemaResolver } from '../util/detail-uischema';

@Component({
  selector: 'ObjectRenderer',
  template: `
    <mat-card class="object-layout" appearance="outlined">
      <jsonforms-outlet
        *ngIf="renderProps"
        [renderProps]="renderProps"
      ></jsonforms-outlet>
    </mat-card>
  `,
  styles: [
    `
      .object-layout {
        padding: 16px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, JsonFormsModule, MatCardModule],
})
export class ObjectControlRenderer extends JsonFormsControlWithDetail {
  detailUiSchema: UISchemaElement;
  /** Bound as a whole, as the outlet only re-dispatches when this is set. */
  renderProps: OwnPropsOfRenderer;
  private resolveDetailUiSchema = createDetailUiSchemaResolver();
  private changeDetectorRef = inject(ChangeDetectorRef);
  mapAdditionalProps(props: ControlWithDetailProps) {
    const detailUiSchema = this.resolveDetailUiSchema(
      props,
      this.isEnabled(),
      props.uischema.scope,
      () => {
        const newSchema = cloneDeep(props.schema);
        // delete unsupported operators
        delete newSchema.oneOf;
        delete newSchema.anyOf;
        delete newSchema.allOf;
        const generated = Generate.uiSchema(
          newSchema,
          'Group',
          undefined,
          props.rootSchema
        );
        if (isEmpty(props.path)) {
          generated.type = 'VerticalLayout';
        } else {
          (generated as GroupLayout).label = startCase(props.path);
        }
        return generated;
      }
    );
    if (detailUiSchema === this.detailUiSchema) {
      return;
    }
    this.detailUiSchema = detailUiSchema;
    this.renderProps = {
      uischema: detailUiSchema,
      schema: props.schema,
      path: props.path,
    };
    // OnPush: nothing below reports the new detail, so schedule the check
    this.changeDetectorRef.markForCheck();
  }
}
export const ObjectControlRendererTester: RankedTester = rankWith(
  2,
  isObjectControl
);
