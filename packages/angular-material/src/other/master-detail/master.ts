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
            <mat-list-item
                *ngFor="let item of masterItems; trackBy: trackElement"
                [class.selected]="item === selectedItem"
                (click)="onSelect(item)"
            >
                <a matLine>{{item.label}}</a>
                <button mat-icon-button class="button" (click)="onDeleteClick(item)">
                  <mat-icon mat-list-icon>delete</mat-icon>
                </button>
            </mat-list-item>
          </mat-nav-list>
           <button mat-fab color="primary" class="button" (click)="onAddClick()">
               <mat-icon aria-label="Add item to list">add</mat-icon>
           </button>
        </mat-sidenav>
        <mat-sidenav-content class="content">
          <jsonforms-detail [item]="selectedItem"></jsonforms-detail>
        </mat-sidenav-content>
    </mat-sidenav-container>`,
  styles: [`
      .container {
        height: 100vh;
      }
      .content {
        padding: 15px;
      }
      .button {
        float: right;
        margin-right: 0.25em;
      }
    `]
})
export class MasterListComponent extends JsonFormsControl {

  masterItems: any[];
  selectedItem: any;
  addItem: (path: string) => () => void;
  removeItems: (path: string, toDelete: any[]) => () => void;
  propsPath: string;

  constructor(ngRedux: NgRedux<JsonFormsState>) {
    super(ngRedux);
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
  }

  onSelect(item: any): void {
    this.selectedItem = item;
  }

  onAddClick() {
    this.addItem(this.propsPath)();
  }

  onDeleteClick(item: any) {
    this.removeItems(this.propsPath, [item.data])();
  }
}

export const masterDetailTester: RankedTester = rankWith(
  4,
  uiTypeIs('ListWithDetail')
);
