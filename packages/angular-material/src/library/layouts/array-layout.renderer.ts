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
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JsonFormsAbstractControl, JsonFormsModule } from '@jsonforms/angular';
import {
  arrayDefaultTranslations,
  ArrayLayoutProps,
  ArrayTranslations,
  createDefaultValue,
  defaultJsonFormsI18nState,
  findUISchema,
  getArrayTranslations,
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
} from '@jsonforms/core';
import cloneDeep from 'lodash/cloneDeep';
import { depsChanged } from '../util/deps';

@Component({
  selector: 'app-array-layout-renderer',
  template: `
    <div [ngStyle]="{ display: hidden ? 'none' : '' }" class="array-layout">
      <div class="array-layout-toolbar">
        <h2 class="mat-h2 array-layout-title">{{ label }}</h2>
        <span></span>
        <mat-icon
          *ngIf="this.error?.length"
          color="warn"
          matBadge="{{ this.error.split('\\n').length }}"
          matBadgeColor="warn"
          matTooltip="{{ this.error }}"
          matTooltipClass="error-message-tooltip"
        >
          error_outline
        </mat-icon>
        <span></span>
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
          let item of itemProps;
          let idx = index;
          trackBy: trackByFn;
          last as last;
          first as first
        "
      >
        <mat-card class="array-item" appearance="outlined">
          <mat-card-content>
            <jsonforms-outlet [renderProps]="item"></jsonforms-outlet>
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
      .array-layout {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .array-layout > * {
        flex: 1 1 auto;
      }
      .array-layout-toolbar {
        display: flex;
        align-items: center;
      }
      .array-layout-title {
        margin: 0;
      }
      .array-layout-toolbar > span {
        flex: 1 1 auto;
      }
      .array-item {
        padding: 16px;
      }
      ::ng-deep .error-message-tooltip {
        white-space: pre-line;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    JsonFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
  ],
})
export class ArrayLayoutRenderer
  extends JsonFormsAbstractControl<StatePropsOfArrayLayout>
  implements OnInit
{
  noData: boolean;
  translations: ArrayTranslations = {};
  addItem: (path: string, value: any) => () => void;
  moveItemUp: (path: string, index: number) => () => void;
  moveItemDown: (path: string, index: number) => () => void;
  removeItems: (path: string, toDelete: number[]) => () => void;
  /**
   * The registered UI schemas. Kept up to date for subclasses; the renderer
   * itself resolves the item UI schema from the mapped props.
   */
  uischemas: {
    tester: UISchemaTester;
    uischema: UISchemaElement;
  }[];
  /**
   * The UI schema to render for each of the array's items.
   *
   * This is always a defensive copy: `findUISchema` can hand back the inline
   * `options.detail` UI schema or a UI schema from the registry, i.e. objects
   * owned by the user, and we set the `readonly` option on it.
   */
  detailUiSchema: UISchemaElement;
  /**
   * The props to render each of the array's items with.
   *
   * Also determines how many items are rendered, so that the rendered items and
   * their props can't get out of sync.
   */
  itemProps: OwnPropsOfRenderer[] = [];
  private detailUiSchemaDeps: unknown[] | undefined;
  private itemPropsDeps: unknown[] | undefined;
  mapToProps(
    state: JsonFormsState
  ): StatePropsOfArrayLayout & { translations: ArrayTranslations } {
    const props = mapStateToArrayLayoutProps(state, this.getOwnProps());
    const t =
      state.jsonforms.i18n?.translate ?? defaultJsonFormsI18nState.translate;
    const translations = getArrayTranslations(
      t,
      arrayDefaultTranslations,
      props.i18nKeyPrefix,
      props.label
    );
    return { ...props, translations };
  }
  remove(index: number): void {
    this.removeItems(this.propsPath, [index])();
  }
  add(): void {
    this.addItem(
      this.propsPath,
      createDefaultValue(this.scopedSchema, this.rootSchema)
    )();
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
  mapAdditionalProps(
    props: ArrayLayoutProps & { translations: ArrayTranslations }
  ) {
    this.noData = !props.data || props.data === 0;
    this.uischemas = props.uischemas;
    this.translations = props.translations;
    this.detailUiSchema = this.resolveDetailUiSchema(props);
    this.updateItemProps(props, this.detailUiSchema);
  }
  private resolveDetailUiSchema(props: ArrayLayoutProps): UISchemaElement {
    const deps = [
      props.uischema,
      props.uischemas,
      props.schema,
      props.rootSchema,
      props.path,
      this.isEnabled(),
    ];
    if (!depsChanged(this.detailUiSchemaDeps, deps)) {
      return this.detailUiSchema;
    }
    this.detailUiSchemaDeps = deps;

    // `findUISchema` can hand back the inline `options.detail` UI schema or a
    // UI schema from the registry, i.e. objects owned by the user. We set the
    // `readonly` option on the result, so we have to work on a copy.
    const detailUiSchema = cloneDeep(
      findUISchema(
        props.uischemas,
        props.schema,
        props.uischema.scope,
        props.path,
        undefined,
        props.uischema,
        props.rootSchema
      )
    );
    if (!this.isEnabled()) {
      setReadonly(detailUiSchema);
    }
    return detailUiSchema;
  }
  /**
   * Precalculates the props of every item.
   *
   * These must not be created in the template: `jsonforms-outlet` re-evaluates
   * its inputs whenever the bound object changes, and doing so deep clones the
   * whole form state, which would then happen once per item per change
   * detection cycle.
   */
  private updateItemProps(
    props: ArrayLayoutProps,
    detailUiSchema: UISchemaElement
  ): void {
    // `props.data` is the item count, but it is only derived from `length`, so
    // it is `undefined` for data that isn't an array. Treat that as no items.
    const itemCount = props.data > 0 ? props.data : 0;
    const deps = [detailUiSchema, props.schema, props.path, itemCount];
    if (!depsChanged(this.itemPropsDeps, deps)) {
      return;
    }
    this.itemPropsDeps = deps;

    this.itemProps = Array.from({ length: itemCount }, (_unused, index) => ({
      schema: props.schema,
      path: Paths.compose(props.path, `${index}`),
      uischema: detailUiSchema,
    }));
  }
  getProps(index: number): OwnPropsOfRenderer {
    return this.itemProps[index];
  }
  trackByFn(index: number) {
    return index;
  }
}

export const ArrayLayoutRendererTester: RankedTester = rankWith(
  4,
  isObjectArrayWithNesting
);
