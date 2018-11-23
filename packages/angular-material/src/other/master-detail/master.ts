import { Component } from '@angular/core';
import * as _ from 'lodash';
import { JsonFormsControl } from '@jsonforms/angular';
import { NgRedux } from '@angular-redux/store';
import {
  ControlElement,
  ControlProps,
  Generate,
  JsonFormsState,
  mapDispatchToArrayControlProps,
  RankedTester,
  rankWith,
  resolveSchema,
  toDataPath,
  uiTypeIs
} from '@jsonforms/core';

const keywords = ['#', 'properties', 'items'];

export const removeSchemaKeywords = (path: string) => {
  return path.split('/').filter(s => !_.some(keywords, key => key === s)).join('.');
};

@Component({
  selector: 'jsonforms-list-with-detail-master',
  template: `
    <mat-sidenav-container class="container" [fxHide]="hidden">
        <mat-sidenav mode="side" opened>
          <mat-nav-list>
            <mat-list-item *ngIf="masterItems.length === 0">No items</mat-list-item>
            <mat-list-item
                *ngFor="let item of masterItems; let i = index; trackBy: trackElement"
                [class.selected]="item === selectedItem"
                (click)="onSelect(item, i)"
                (mouseover)="onListItemHover(i)"
                (mouseout)="onListItemHover(undefined)"
            >
                <a matLine>{{item.label}}</a>
                <button mat-icon-button
                        class="button hide"
                        (click)="onDeleteClick(item, i)"
                        [ngClass]="{'show': highlightedIdx == i}"
                >
                  <mat-icon mat-list-icon>delete</mat-icon>
                </button>
            </mat-list-item>
          </mat-nav-list>
           <button mat-fab color="primary" class="add-button" (click)="onAddClick()" >
               <mat-icon aria-label="Add item to list">add</mat-icon>
           </button>
        </mat-sidenav>
        <mat-sidenav-content class="content">
          <jsonforms-detail *ngIf="selectedItem" [item]="selectedItem"></jsonforms-detail>
        </mat-sidenav-content>
    </mat-sidenav-container>`,
  styles: [`
      .container {
        height: 100vh;
      }
      .content {
        padding: 15px;
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
    `]
})
export class MasterListComponent extends JsonFormsControl {

  masterItems: any[];
  selectedItem: any;
  selectedItemIdx: number;
  addItem: (path: string) => () => void;
  removeItems: (path: string, toDelete: any[]) => () => void;
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
    const { addItem, removeItems } = mapDispatchToArrayControlProps(this.ngRedux.dispatch, {
      uischema: this.uischema as ControlElement,
      schema: this.schema,
    });
    this.addItem = addItem;
    this.removeItems = removeItems;
  }

  mapAdditionalProps(props: ControlProps) {
    const { data, schema, uischema } = props;
    const controlElement = uischema as ControlElement;
    const instancePath = toDataPath(`${controlElement.scope}/items`);
    this.propsPath = props.path;
    const resolvedSchema = resolveSchema(schema, `${controlElement.scope}/items`);
    const detailUISchema = controlElement.options.detail ||
      Generate.uiSchema(resolvedSchema, 'VerticalLayout');
    const masterItems = (data || []).map((d: any, index: number) => {
      const labelRefInstancePath =
        removeSchemaKeywords(controlElement.options.labelRef);
      const masterItem = {
        label: _.get(d, labelRefInstancePath),
        data: d,
        path: `${instancePath}.${index}`,
        schema: resolvedSchema,
        uischema: detailUISchema
      };
      return masterItem;
    });
    this.masterItems = masterItems;

    // pre-select 1st entry
    if (this.masterItems.length > 0 && this.selectedItem === undefined) {
      this.selectedItem = this.masterItems[0];
      this.selectedItemIdx = 0;
    }
  }

  onSelect(item: any, idx: number): void {
    this.selectedItem = item;
    this.selectedItemIdx = idx;
  }

  onAddClick() {
    this.addItem(this.propsPath)();
  }

  onDeleteClick(item: any, idx: number) {
    this.deleteItem(item);
    if (this.selectedItem.path === item.path && this.masterItems[idx]) {
      // select next element, if possible
      this.selectedItem = this.masterItems[idx];
      this.selectedItemIdx = idx;
    } else if (this.selectedItem.path === item.path && this.masterItems.length > 0) {
      // select 1st entry, if no next element available
      this.selectedItem = this.masterItems[0];
      this.selectedItemIdx = 0;
    } else if (this.selectedItemIdx >= idx) {
      // selected index has changed
      this.selectedItemIdx -= 1;
      this.selectedItem = this.masterItems[this.selectedItemIdx];
    } else if (this.masterItems.length === 0) {
      // unset select if no elements anymore
      this.selectedItemIdx = -1;
      this.selectedItem = undefined;
    }
  }

  deleteItem(item: any) {
    this.removeItems(this.propsPath, [item.data])();
  }
}

export const masterDetailTester: RankedTester = rankWith(
  4,
  uiTypeIs('ListWithDetail')
);
