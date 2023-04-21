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
  OnInit,
} from '@angular/core';
import {
  JsonFormsAngularService,
  JsonFormsAbstractControl,
} from '@jsonforms/angular';
import {
  ArrayLayoutProps,
  ArrayTranslations,
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
  unsetReadonly,
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
          matBadge="{{
            this.error.split(
              '
'
            ).length
          }}"
          matBadgeColor="warn"
          matTooltip="{{ this.error }}"
          matTooltipClass="error-message-tooltip"
        >
          error_outline
        </mat-icon>
        <span fxFlex></span>
        <button
          mat-button
          matTooltip="{{ translations.addTooltip }}"
          [disabled]="!isEnabled()"
          (click)="add()"
          attr.aria-label="{{ translations.addAriaLabel }}"
        >
          <mat-icon>add</mat-icon>
        </button>
      </div>
      <p *ngIf="noData">{{ translations.noDataMessage }}</p>
      <div
        *ngFor="
          let item of [].constructor(data);
          let idx = index;
          trackBy: trackByFn;
          last as last;
          first as first
        "
      >
        <mat-card>
          <mat-card-content>
            <jsonforms-outlet [renderProps]="getProps(idx)"></jsonforms-outlet>
          </mat-card-content>
          <mat-card-actions *ngIf="isEnabled()">
            <button
              *ngIf="uischema?.options?.showSortButtons"
              class="item-up"
              mat-button
              [disabled]="first"
              (click)="up(idx)"
              attr.aria-label="{{ translations.upAriaLabel }}"
              matTooltip="{{ translations.up }}"
              matTooltipPosition="right"
            >
              <mat-icon>arrow_upward</mat-icon>
            </button>
            <button
              *ngIf="uischema?.options?.showSortButtons"
              class="item-down"
              mat-button
              [disabled]="last"
              (click)="down(idx)"
              attr.aria-label="{{ translations.downAriaLabel }}"
              matTooltip="{{ translations.down }}"
              matTooltipPosition="right"
            >
              <mat-icon>arrow_downward</mat-icon>
            </button>
            <button
              mat-button
              color="warn"
              (click)="remove(idx)"
              attr.aria-label="{{ translations.removeAriaLabel }}"
              matTooltip="{{ translations.removeTooltip }}"
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
    `
      .array-layout-toolbar {
        display: flex;
        align-items: center;
      }
      .array-layout-title {
        margin: 0;
      }
      ::ng-deep .error-message-tooltip {
        white-space: pre-line;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayLayoutRenderer
  extends JsonFormsAbstractControl<StatePropsOfArrayLayout>
  implements OnInit, OnDestroy
{
  noData: boolean;
  translations: ArrayTranslations;
  addItem: (path: string, value: any) => () => void;
  moveItemUp: (path: string, index: number) => () => void;
  moveItemDown: (path: string, index: number) => () => void;
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
  up(index: number): void {
    this.moveItemUp(this.propsPath, index)();
  }
  down(index: number): void {
    this.moveItemDown(this.propsPath, index)();
  }
  ngOnInit() {
    super.ngOnInit();
    const { addItem, removeItems, moveUp, moveDown } =
      mapDispatchToArrayControlProps(
        this.jsonFormsService.updateCore.bind(this.jsonFormsService)
      );
    this.addItem = addItem;
    this.moveItemUp = moveUp;
    this.moveItemDown = moveDown;
    this.removeItems = removeItems;
  }
  mapAdditionalProps(props: ArrayLayoutProps) {
    this.translations = props.translations;
    this.noData = !props.data || props.data === 0;
    this.uischemas = props.uischemas;
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
      uischema,
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
