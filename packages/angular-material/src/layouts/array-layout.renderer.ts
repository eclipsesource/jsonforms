/*
  The MIT License

  Copyright (c) 2017-2020 EclipseSource Munich
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
import {
  JsonFormsAngularService,
  JsonFormsArrayControl
} from '@jsonforms/angular';
import {
  ArrayControlProps,
  createDefaultValue,
  findUISchema,
  isObjectArrayWithNesting,
  mapDispatchToArrayControlProps,
  OwnPropsOfRenderer,
  Paths,
  RankedTester,
  rankWith,
  setReadonly,
  UISchemaElement,
  UISchemaTester,
  unsetReadonly,
} from '@jsonforms/core';

@Component({
  selector: 'app-array-layout-renderer',
  template: `
    <div fxLayout="column" fxLayoutGap="16px" [fxHide]="hidden">
      <mat-toolbar color="primary">
        <h2>{{ this.label }}</h2>
        <span fxFlex></span>
        <button
          mat-icon-button
          [disabled]="!isEnabled()"
          (click)="add()"
          attr.aria-label="{{ 'Add to ' + this.label + 'button' }}"
        >
          <mat-icon>add</mat-icon>
        </button>
      </mat-toolbar>
      <p *ngIf="noData">No data</p>
      <div
        *ngFor="
          let item of data;
          let idx = index;
          trackBy: trackByFn;
          last as last
        "
      >
        <mat-card>
          <mat-card-content>
            <jsonforms-outlet [renderProps]="getProps(idx)"></jsonforms-outlet>
          </mat-card-content>
          <mat-card-actions *ngIf="isEnabled()">
            <button mat-fab color="primary" (click)="remove(idx)" aria-label="Remove">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrayLayoutRenderer extends JsonFormsArrayControl {
  noData: boolean;
  addItem: (path: string, value: any) => () => void;
  removeItems: (path: string, toDelete: number[]) => () => void;
  uischemas: {
    tester: UISchemaTester;
    uischema: UISchemaElement;
  }[];

  constructor(jsonFormsService: JsonFormsAngularService) {
    super(jsonFormsService);
  }
  remove(index: number): void {
    this.removeItems(this.propsPath, [index])();
  }
  add(): void {
    this.addItem(this.propsPath, createDefaultValue(this.scopedSchema))();
  }
  ngOnInit() {
    super.ngOnInit();
    const { addItem, removeItems } = mapDispatchToArrayControlProps(
      this.jsonFormsService.updateCore.bind(this.jsonFormsService)
    );
    this.addItem = addItem;
    this.removeItems = removeItems;
  }

  mapAdditionalProps(props: ArrayControlProps) {
    this.noData =
      !props.data || (Array.isArray(props.data) && !props.data.length);
    this.uischemas = props.uischemas;
  }

  getProps(index: number): OwnPropsOfRenderer {
    const uischema = findUISchema(
      this.uischemas,
      this.scopedSchema,
      this.uischema.scope,
      this.propsPath,
      undefined,
      this.uischema
    );
    if (this.isEnabled()) {
      unsetReadonly(uischema);
    } else {
      setReadonly(uischema);
    }
    return {
      schema: this.scopedSchema,
      path: Paths.compose(this.propsPath, `${index}`),
      uischema
    };
  }
  trackByFn(index: number) {
    return index;
  }
}

export const ArrayLayoutRendererTester: RankedTester = rankWith(
  4,
  isObjectArrayWithNesting
);
