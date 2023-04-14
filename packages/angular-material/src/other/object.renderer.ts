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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  JsonFormsAngularService,
  JsonFormsControlWithDetail,
} from '@jsonforms/angular';
import {
  ControlWithDetailProps,
  findUISchema,
  GroupLayout,
  isObjectControl,
  RankedTester,
  rankWith,
  setReadonly,
  UISchemaElement,
} from '@jsonforms/core';

@Component({
  selector: 'ObjectRenderer',
  template: `
    <mat-card>
      <jsonforms-outlet
        [uischema]="detailUiSchema"
        [schema]="scopedSchema"
        [path]="propsPath"
      >
      </jsonforms-outlet>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectControlRenderer extends JsonFormsControlWithDetail {
  detailUiSchema: UISchemaElement;
  constructor(jsonformsService: JsonFormsAngularService) {
    super(jsonformsService);
  }
  mapAdditionalProps(props: ControlWithDetailProps) {
    this.detailUiSchema = findUISchema(
      props.uischemas,
      props.schema,
      props.uischema.scope,
      props.path,
      'Group',
      props.uischema,
      props.rootSchema
    );
    if (isEmpty(props.path)) {
      this.detailUiSchema.type = 'VerticalLayout';
    } else {
      (this.detailUiSchema as GroupLayout).label = startCase(props.path);
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
