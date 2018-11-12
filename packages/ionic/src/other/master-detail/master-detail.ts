import * as _ from 'lodash';
import { Component, ViewChild } from '@angular/core';
import {
    composeWithUi,
    ControlElement,
    Generate,
    JsonFormsState,
    JsonSchema,
    RankedTester,
    rankWith,
    resolveSchema,
    toDataPath,
    UISchemaElement,
    uiTypeIs,
} from '@jsonforms/core';
import { JsonFormsControl } from '@jsonforms/angular';
import { Nav, Platform } from 'ionic-angular';
import { NgRedux } from '@angular-redux/store';
import { MasterDetailNavService } from './master-detail-nav.service';
import { MasterPage } from './pages/master/master';
import { DetailPage } from './pages/detail/detail';
import { removeSchemaKeywords } from '../../common';

export interface MasterItem {
    label: string;
    data: any;
    path: string;
    schema: JsonSchema;
    uischema: UISchemaElement;
}

@Component({
    selector: 'jsonforms-master-detail',
    template: `
        <ion-split-pane (ionChange)="onSplitPaneChange($event)">
            <ion-nav [root]="masterPage" [rootParams]="masterParams" #masterNav ></ion-nav>
            <ion-nav [root]="detailPage" #detailNav main></ion-nav>
        </ion-split-pane>
    `
})
export class MasterDetailComponent extends JsonFormsControl {

    @ViewChild('masterNav') masterNav: Nav;
    @ViewChild('detailNav') detailNav: Nav;
    masterPage: any;
    detailPage: any;
    masterItems: MasterItem[];
    masterParams: any;

    constructor(
        private parentNav: Nav,
        private platform: Platform,
        ngRedux: NgRedux<JsonFormsState>,
        private masterDetailService: MasterDetailNavService
    ) {
        super(ngRedux);
        this.masterPage = MasterPage;
        this.detailPage = DetailPage;
    }

    ngOnInit() {

        this.masterDetailService.masterNav = this.masterNav;
        this.masterDetailService.detailNav = this.detailNav;
        this.masterDetailService.parentNav = this.parentNav;

        this.subscription = this.ngRedux
            .select()
            .subscribe((state: JsonFormsState) => {
                const { data, schema, uischema } = this.mapToProps(state);
                const controlElement = uischema as ControlElement;
                const instancePath = toDataPath(`${controlElement.scope}/items`);
                const resolvedSchema = resolveSchema(schema, `${controlElement.scope}/items`);
                const detailUISchema = controlElement.options.detail ||
                    Generate.uiSchema(resolvedSchema, 'VerticalLayout');
                const masterItems = data.map((d: any, index: number) => {
                    const labelRefInstancePath =
                        removeSchemaKeywords(controlElement.options.labelRef);
                    const masterItem: MasterItem = {
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
                    this.masterParams = {
                        addToNavStack: true,
                        items: this.masterItems,
                        path: composeWithUi(this.uischema as ControlElement, this.path),
                        uischema: this.uischema,
                        schema: this.schema
                    };
                    this.masterDetailService.masterNav.setRoot(
                        MasterPage,
                        this.masterParams
                    );
                }

                if (this.platform.width() < 768) {
                    this.masterDetailService.useParentNav = true;
                } else {
                    this.masterDetailService.useParentNav = false;
                }
            });
    }

    onSplitPaneChange(event: any) {
        const isDetailVisible = event._visible;
        this.masterDetailService.onDetailVisibilityChanged(isDetailVisible, this.parentNav);
    }
}

export const masterDetailTester: RankedTester = rankWith(
    4,
    uiTypeIs('ListWithDetail')
);
