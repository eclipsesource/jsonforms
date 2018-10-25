import { Component } from '@angular/core';
import * as _ from 'lodash';
import { JsonFormsControl } from '@jsonforms/angular';
import { NgRedux } from '@angular-redux/store';
import {
    ControlElement,
    ControlProps,
    Generate,
    JsonFormsState,
    RankedTester,
    rankWith,
    resolveSchema,
    toDataPath,
    uiTypeIs
} from '@jsonforms/core';
import { MasterDetailService } from './master-detail.service';

const keywords = ['#', 'properties', 'items'];

export const removeSchemaKeywords = (path: string) => {
    return path.split('/').filter(s => !_.some(keywords, key => key === s)).join('.');
};

@Component({
    selector: 'jsonforms-list-with-detail-master',
    template: `
    <mat-sidenav-container class="container">
        <mat-sidenav mode="side" opened>
          <mat-nav-list>
            <mat-list-item
                *ngFor="let item of masterItems"
                [class.selected]="item === selectedItem"
                (click)="onSelect(item)"
            >
                <a matLine>{{item.label}}</a>
            </mat-list-item>
          </mat-nav-list>
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
    `]
})
export class MasterListComponent extends JsonFormsControl {

    masterItems: any[];
    selectedItem: any;

    constructor(
        ngRedux: NgRedux<JsonFormsState>,
        private masterDetailService: MasterDetailService
    ) {
        super(ngRedux);
        this.selectedItem = this.masterDetailService.getSelectedItem();
    }

    mapAdditionalProps(props: ControlProps) {
        const { data, schema, uischema} = props;
        const controlElement = uischema as ControlElement;
        const instancePath = toDataPath(`${controlElement.scope}/items`);
        const resolvedSchema = resolveSchema(schema, `${controlElement.scope}/items`);
        const detailUISchema = controlElement.options.detail ||
            Generate.uiSchema(resolvedSchema, 'VerticalLayout');
        const masterItems = data.map((d: any, index: number) => {
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

        if (this.masterItems === undefined ||
            this.masterItems.length !== masterItems.length) {
            this.masterItems = masterItems;
        }
    }

    onSelect(item: any): void {
        this.selectedItem = item;
        this.masterDetailService.setSelectedItem(item);
    }
}

export const masterDetailTester: RankedTester = rankWith(
    4,
    uiTypeIs('ListWithDetail')
);
