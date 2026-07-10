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
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  JsonFormsControlWithDetail,
  JsonFormsModule,
} from '@jsonforms/angular';
import { MatCardModule } from '@angular/material/card';
import { AdditionalPropertiesRenderer } from './additional-properties.renderer';
import {
  ControlWithDetailProps,
  findUISchema,
  Generate,
  GroupLayout,
  isObjectControl,
  RankedTester,
  rankWith,
  setReadonly,
  UISchemaElement,
} from '@jsonforms/core';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'ObjectRenderer',
  template: `
    <mat-card class="object-layout" appearance="outlined">
      <mat-card-title *ngIf="objectLabel" class="object-layout-title">
        {{ objectLabel }}
      </mat-card-title>
      <jsonforms-outlet
        [uischema]="detailUiSchema"
        [schema]="scopedSchema"
        [path]="propsPath"
      >
      </jsonforms-outlet>
      <AdditionalPropertiesRenderer
        [config]="additionalPropertiesConfig"
        [data]="data"
        [enabled]="isEnabled()"
        [label]="label"
        [path]="propsPath"
        [rootSchema]="rootSchema"
        [schema]="scopedSchema"
        [uischema]="uischema"
      ></AdditionalPropertiesRenderer>
    </mat-card>
  `,
  styles: [
    `
      .object-layout {
        padding: 16px;
      }
      .object-layout-title {
        margin-bottom: 16px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    JsonFormsModule,
    MatCardModule,
    AdditionalPropertiesRenderer,
  ],
})
export class ObjectControlRenderer extends JsonFormsControlWithDetail {
  detailUiSchema: UISchemaElement;
  additionalPropertiesConfig: any;
  objectLabel: string | undefined;
  mapAdditionalProps(props: ControlWithDetailProps) {
    this.additionalPropertiesConfig = {
      ...props.config,
      ...props.uischema.options,
    };
    this.detailUiSchema = findUISchema(
      props.uischemas,
      props.schema,
      props.uischema.scope,
      props.path,
      () => {
        const newSchema = cloneDeep(props.schema);
        // delete unsupported operators
        delete newSchema.oneOf;
        delete newSchema.anyOf;
        delete newSchema.allOf;
        return Generate.uiSchema(
          newSchema,
          'VerticalLayout',
          undefined,
          this.rootSchema
        );
      },
      props.uischema,
      props.rootSchema
    );
    if (isEmpty(props.path)) {
      this.detailUiSchema.type = 'VerticalLayout';
      this.objectLabel = undefined;
    } else {
      this.objectLabel =
        (this.detailUiSchema as GroupLayout).label ?? startCase(props.path);
      if (this.detailUiSchema.type === 'Group') {
        this.detailUiSchema = {
          ...this.detailUiSchema,
          type: 'VerticalLayout',
        } as UISchemaElement;
      }
    }
    if (!this.isEnabled()) {
      setReadonly(this.detailUiSchema);
    }
  }
}
export const ObjectControlRendererTester: RankedTester = rankWith(
  2,
  isObjectControl
);
