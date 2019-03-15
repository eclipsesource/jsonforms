import some from 'lodash/some';
import get from 'lodash/get';
import { Component } from '@angular/core';
import { JsonFormsArrayControl } from '@jsonforms/angular';
import { NgRedux } from '@angular-redux/store';
import {
  ArrayControlProps,
  ControlElement,
  createDefaultValue,
  findUISchema,
  JsonFormsState,
  mapDispatchToArrayControlProps,
  mapStateToArrayControlProps,
  RankedTester,
  rankWith,
  uiTypeIs
} from '@jsonforms/core';

const keywords = ['#', 'properties', 'items'];

export const removeSchemaKeywords = (path: string) => {
  return path
    .split('/')
    .filter(s => !some(keywords, key => key === s))
    .join('.');
};

@Component({
  selector: 'jsonforms-list-with-detail-master',
  template: `
    <mat-sidenav-container class="container" [fxHide]="hidden">
      <mat-sidenav mode="side" opened>
        <mat-nav-list>
          <mat-list-item *ngIf="masterItems.length === 0"
            >No items</mat-list-item
          >
          <mat-list-item
            *ngFor="
              let item of masterItems;
              let i = index;
              trackBy: trackElement
            "
            [class.selected]="item === selectedItem"
            (click)="onSelect(item, i)"
            (mouseover)="onListItemHover(i)"
            (mouseout)="onListItemHover(undefined)"
          >
            <a matLine>{{ item.label || 'No label set' }}</a>
            <button
              mat-icon-button
              class="button hide"
              (click)="onDeleteClick(i)"
              [ngClass]="{ show: highlightedIdx == i }"
            >
              <mat-icon mat-list-icon>delete</mat-icon>
            </button>
          </mat-list-item>
        </mat-nav-list>
        <button
          mat-fab
          color="primary"
          class="add-button"
          (click)="onAddClick()"
        >
          <mat-icon aria-label="Add item to list">add</mat-icon>
        </button>
      </mat-sidenav>
      <mat-sidenav-content class="content">
        <jsonforms-detail
          *ngIf="selectedItem"
          [item]="selectedItem"
        ></jsonforms-detail>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      mat-list-item.selected {
        background: rgba(0, 0, 0, 0.04);
      }
      .container {
        height: 100vh;
      }
      .content {
        padding: 15px;
        background-color: #fff;
      }
      .add-button {
        float: right;
        margin-top: 0.5em;
        margin-right: 0.25em;
      }
      .button {
        float: right;
        margin-right: 0.25em;
      }
      .hide {
        display: none;
      }
      .show {
        display: inline-block;
      }
      mat-sidenav {
        width: 20%;
      }
    `
  ]
})
export class MasterListComponent extends JsonFormsArrayControl {
  masterItems: any[];
  selectedItem: any;
  selectedItemIdx: number;
  addItem: (path: string, value: any) => () => void;
  removeItems: (path: string, toDelete: number[]) => () => void;
  propsPath: string;
  highlightedIdx: number;

  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
  }

  onListItemHover(idx: number) {
    this.highlightedIdx = idx;
  }

  trackElement(_index: number, element: any) {
    return element ? element.label : null;
  }

  ngOnInit() {
    super.ngOnInit();
    const { addItem, removeItems } = mapDispatchToArrayControlProps(
      this.ngRedux.dispatch
    );
    this.addItem = addItem;
    this.removeItems = removeItems;
  }

  mapAdditionalProps(props: ArrayControlProps) {
    const { data, path, schema, uischema } = props;
    const controlElement = uischema as ControlElement;
    this.propsPath = props.path;
    const detailUISchema =
      controlElement.options.detail ||
      findUISchema(
        props.uischemas,
        schema,
        `${controlElement.scope}/items`,
        props.path,
        'VerticalLayout'
      );

    const masterItems = (data || []).map((d: any, index: number) => {
      const labelRefInstancePath = removeSchemaKeywords(
        controlElement.options.labelRef
      );
      const masterItem = {
        label: get(d, labelRefInstancePath),
        data: d,
        path: `${path}.${index}`,
        schema,
        uischema: detailUISchema
      };
      return masterItem;
    });
    this.masterItems = masterItems;
    let newSelectedIdx = -1;
    let newSelectedItem;
    if (this.masterItems.length === 0) {
      // unset select if no elements anymore
      this.selectedItem = undefined;
      this.selectedItemIdx = -1;
    } else if (this.selectedItemIdx >= this.masterItems.length) {
      // the previous index is to high, reduce it to the maximal possible
      newSelectedIdx = this.masterItems.length - 1;
      newSelectedItem = this.masterItems[newSelectedIdx];
    } else if (
      this.selectedItemIdx !== -1 &&
      this.selectedItemIdx < this.masterItems.length
    ) {
      newSelectedIdx = this.selectedItemIdx;
      newSelectedItem = this.masterItems[this.selectedItemIdx];
    }

    if (
      newSelectedItem !== undefined &&
      this.selectedItem !== undefined &&
      newSelectedItem.label === this.selectedItem.label
    ) {
      // after checking that we are on the same path, set selection
      this.selectedItem = newSelectedItem;
      this.selectedItemIdx = newSelectedIdx;
    } else if (this.masterItems.length > 0) {
      // pre-select 1st entry if the previous selected element as fallback
      this.selectedItem = this.masterItems[0];
      this.selectedItemIdx = 0;
    }
  }

  onSelect(item: any, idx: number): void {
    this.selectedItem = item;
    this.selectedItemIdx = idx;
  }

  onAddClick() {
    this.addItem(this.propsPath, createDefaultValue(this.scopedSchema))();
  }

  onDeleteClick(item: number) {
    this.removeItems(this.propsPath, [item])();
  }

  protected mapToProps(state: JsonFormsState): ArrayControlProps {
    const props = mapStateToArrayControlProps(state, this.getOwnProps());
    const dispatch = mapDispatchToArrayControlProps(this.ngRedux.dispatch);
    return { ...props, ...dispatch };
  }
}

export const masterDetailTester: RankedTester = rankWith(
  4,
  uiTypeIs('ListWithDetail')
);
