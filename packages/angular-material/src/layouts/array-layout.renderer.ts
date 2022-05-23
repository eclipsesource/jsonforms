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
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { JsonFormsAngularService, JsonFormsAbstractControl } from '@jsonforms/angular';
import {
  ArrayLayoutProps,
  createDefaultValue,
  findUISchema,
  isObjectArrayWithNesting,
  JsonFormsState,
  mapDispatchToArrayControlProps,
  mapStateToArrayLayoutProps,
  OwnPropsOfRenderer,
  Paths,
  RankedTester,
  rankWith,
  setReadonly,
  StatePropsOfArrayLayout,
  UISchemaElement,
  UISchemaTester,
  unsetReadonly
} from '@jsonforms/core';

@Component({
  selector: 'app-array-layout-renderer',
  template: `
    <div fxLayout="column" fxLayoutGap="16px" [fxHide]="hidden">
      <div [ngClass]="'array-layout-toolbar'">
        <h2 [ngClass]="['mat-h2', 'array-layout-title']">{{ label }}</h2>
        <span fxFlex></span>
        <mat-icon
          *ngIf="this.error?.length"
          color="warn"
          matBadge="{{ this.error.split('\n').length }}"
          matBadgeColor="warn"
          matTooltip="{{ this.error }}"
          matTooltipClass="error-message-tooltip"
          >
            error_outline
        </mat-icon>
        <span fxFlex></span>
        <button
          mat-button
          matTooltip="{{ this.addTooltip }}"
          [disabled]="!isEnabled()"
          (click)="add()"
          attr.aria-label="{{ this.addAriaLabel }}"
        >
          <mat-icon>add</mat-icon>
        </button>
      </div>
      <p *ngIf="noData">{{ this.noDataMessage }}</p>
      <div
        *ngFor="
          let item of [].constructor(data);
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
            <button
              mat-button
              color="warn"
              (click)="remove(idx)"
              attr.aria-label="{{ this.removeAriaLabel }}"
              matTooltip="{{ this.removeTooltip }}"
              matTooltipPosition="right"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `.array-layout-toolbar {
       display: flex;
       align-items: center;
      }
      .array-layout-title {
        margin: 0;
      }
      ::ng-deep .error-message-tooltip {
        white-space: pre-line;
      }
      `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrayLayoutRenderer
  extends JsonFormsAbstractControl<StatePropsOfArrayLayout>
  implements OnInit, OnDestroy {
  addTooltip: string;
  addAriaLabel: string;
  noDataMessage: string;
  removeTooltip: string;
  removeAriaLabel: string;
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
  mapToProps(state: JsonFormsState): StatePropsOfArrayLayout {
    const props = mapStateToArrayLayoutProps(state, this.getOwnProps());
    return { ...props };
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
  mapAdditionalProps(props: ArrayLayoutProps) {
    this.noData = !props.data || props.data === 0;
    this.uischemas = props.uischemas;
    this.addTooltip = `Add to ${this.label}`;
    this.addAriaLabel = `Add to ${this.label} button`;
    this.removeTooltip = `Delete`;
    this.removeAriaLabel = `Delete button`;
    this.noDataMessage = `No data`;
  }
  getProps(index: number): OwnPropsOfRenderer {
    const uischema = findUISchema(
      this.uischemas,
      this.scopedSchema,
      this.uischema.scope,
      this.propsPath,
      undefined,
      this.uischema,
      this.rootSchema
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
