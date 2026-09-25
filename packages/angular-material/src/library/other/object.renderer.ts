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
  findUISchema,
  Generate,
  GroupLayout,
  isObjectControl,
  OwnPropsOfRenderer,
  RankedTester,
  rankWith,
  setReadonly,
  UISchemaElement,
} from '@jsonforms/core';
import cloneDeep from 'lodash/cloneDeep';
import { depsChanged } from '../util/deps';

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
  /**
   * The UI schema to render for the object's detail.
   *
   * This is always a defensive copy: `findUISchema` can hand back the inline
   * `options.detail` UI schema or a UI schema from the registry, i.e. objects
   * owned by the user, and we modify the result below.
   */
  detailUiSchema: UISchemaElement;
  /**
   * The props to render the detail with.
   *
   * Bound as a whole instead of as separate `uischema`, `schema` and `path`
   * inputs: `jsonforms-outlet` only re-dispatches when its `renderProps` setter
   * is called, so with separate inputs a new detail UI schema would only be
   * picked up on the next emitted state.
   */
  renderProps: OwnPropsOfRenderer;
  private detailUiSchemaDeps: unknown[] | undefined;
  private changeDetectorRef = inject(ChangeDetectorRef);
  mapAdditionalProps(props: ControlWithDetailProps) {
    const deps = [
      props.uischema,
      props.uischemas,
      props.schema,
      props.rootSchema,
      props.path,
      this.isEnabled(),
    ];
    if (!depsChanged(this.detailUiSchemaDeps, deps)) {
      return;
    }
    this.detailUiSchemaDeps = deps;

    const detailUiSchema = cloneDeep(
      findUISchema(
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
            'Group',
            undefined,
            this.rootSchema
          );
        },
        props.uischema,
        props.rootSchema
      )
    );
    if (isEmpty(props.path)) {
      detailUiSchema.type = 'VerticalLayout';
    } else {
      (detailUiSchema as GroupLayout).label = startCase(props.path);
    }
    if (!this.isEnabled()) {
      setReadonly(detailUiSchema);
    }
    this.detailUiSchema = detailUiSchema;
    this.renderProps = {
      uischema: detailUiSchema,
      schema: props.schema,
      path: props.path,
    };
    // the component is OnPush and nothing below it reports the change, so
    // without this the new detail is not rendered until the view happens to be
    // checked for an unrelated reason
    this.changeDetectorRef.markForCheck();
  }
}
export const ObjectControlRendererTester: RankedTester = rankWith(
  2,
  isObjectControl
);
