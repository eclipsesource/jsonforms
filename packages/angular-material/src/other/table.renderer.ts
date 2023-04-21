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
import startCase from 'lodash/startCase';
import { Component, OnInit } from '@angular/core';
import {
  JsonFormsAngularService,
  JsonFormsArrayControl,
} from '@jsonforms/angular';
import {
  ArrayControlProps,
  ArrayTranslations,
  ControlElement,
  createDefaultValue,
  deriveTypes,
  encode,
  isObjectArrayControl,
  isPrimitiveArrayControl,
  JsonSchema,
  mapDispatchToArrayControlProps,
  or,
  OwnPropsOfRenderer,
  Paths,
  RankedTester,
  rankWith,
  setReadonly,
  UISchemaElement,
} from '@jsonforms/core';

@Component({
  selector: 'TableRenderer',
  template: `
    <table
      mat-table
      [dataSource]="data"
      class="mat-elevation-z8"
      [trackBy]="trackElement"
    >
      <ng-container matColumnDef="action">
        <tr>
          <th mat-header-cell *matHeaderCellDef>
            <button
              mat-button
              color="primary"
              (click)="add()"
              [disabled]="!isEnabled()"
              [matTooltip]="translations.addTooltip"
            >
              <mat-icon>add</mat-icon>
            </button>
          </th>
        </tr>
        <tr>
          <td
            mat-cell
            *matCellDef="
              let row;
              let i = index;
              let first = first;
              let last = last
            "
          >
            <button
              *ngIf="uischema?.options?.showSortButtons"
              class="item-up"
              mat-button
              [disabled]="first"
              (click)="up(i)"
              [matTooltip]="translations.upAriaLabel"
              matTooltipPosition="right"
            >
              <mat-icon>arrow_upward</mat-icon>
            </button>
            <button
              *ngIf="uischema?.options?.showSortButtons"
              class="item-down"
              mat-button
              [disabled]="last"
              (click)="down(i)"
              [matTooltip]="translations.downAriaLabel"
              matTooltipPosition="right"
            >
              <mat-icon>arrow_downward</mat-icon>
            </button>
            <button
              mat-button
              color="warn"
              (click)="remove(i)"
              [disabled]="!isEnabled()"
              matTooltipPosition="right"
              [matTooltip]="translations.removeTooltip"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </tr>

        <tr></tr
      ></ng-container>

      <ng-container
        *ngFor="let item of items"
        matColumnDef="{{ item.property }}"
      >
        <th mat-header-cell *matHeaderCellDef>{{ item.header }}</th>
        <td mat-cell *matCellDef="let index = index">
          <jsonforms-outlet
            [renderProps]="getProps(index, item.props)"
          ></jsonforms-outlet>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: ['table {width: 100%;}', '.cdk-column-action { width: 15%}'],
})
export class TableRenderer extends JsonFormsArrayControl implements OnInit {
  detailUiSchema: UISchemaElement;
  displayedColumns: string[];
  items: ColumnDescription[];
  readonly columnsToIgnore = ['array', 'object'];
  addItem: (path: string, value: any) => () => void;
  moveItemUp: (path: string, index: number) => () => void;
  moveItemDown: (path: string, index: number) => () => void;
  removeItems: (path: string, toDelete: number[]) => () => void;
  translations: ArrayTranslations;

  constructor(jsonformsService: JsonFormsAngularService) {
    super(jsonformsService);
  }
  trackElement(index: number, _element: any) {
    return index ? index : null;
  }
  mapAdditionalProps(props: ArrayControlProps) {
    this.items = this.generateCells(props.schema, props.path);
    this.displayedColumns = this.items.map((item) => item.property);
    if (this.isEnabled()) {
      this.displayedColumns.push('action');
    }
    this.translations = props.translations;
  }
  getProps(index: number, props: OwnPropsOfRenderer): OwnPropsOfRenderer {
    const rowPath = Paths.compose(props.path, `${index}`);
    return {
      schema: props.schema,
      uischema: props.uischema,
      path: rowPath,
    };
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

  generateCells = (
    schema: JsonSchema,
    rowPath: string
  ): ColumnDescription[] => {
    if (schema.type === 'object') {
      return this.getValidColumnProps(schema).map((prop) => {
        const encProp = encode(prop);
        const uischema = controlWithoutLabel(`#/properties/${encProp}`);
        if (!this.isEnabled()) {
          setReadonly(uischema);
        }
        return {
          property: prop,
          header: startCase(prop),
          props: {
            schema: schema,
            uischema,
            path: rowPath,
          },
        };
      });
    }
    // needed to correctly render input control for multi attributes
    return [
      {
        property: 'DUMMY',
        header: this.label,
        props: {
          schema: schema,
          uischema: controlWithoutLabel(`#`),
          path: rowPath,
        },
      },
    ];
  };

  getValidColumnProps = (scopedSchema: JsonSchema) => {
    if (scopedSchema.type === 'object') {
      return Object.keys(scopedSchema.properties).filter((prop) => {
        const types = deriveTypes(scopedSchema.properties[prop]);
        if (types.length > 1) {
          return false;
        }
        return this.columnsToIgnore.indexOf(types[0]) === -1;
      });
    }
    // primitives
    return [''];
  };
}
export const TableRendererTester: RankedTester = rankWith(
  3,
  or(isObjectArrayControl, isPrimitiveArrayControl)
);

interface ColumnDescription {
  property: string;
  header: string;
  props: OwnPropsOfRenderer;
}

export const controlWithoutLabel = (scope: string): ControlElement => ({
  type: 'Control',
  scope: scope,
  label: false,
});
