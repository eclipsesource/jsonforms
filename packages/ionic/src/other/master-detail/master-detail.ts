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
import { MasterDetailNavService } from './master-detail-nav.service';
import { MasterPage } from './pages/master/master';
import { removeSchemaKeywords } from '../../common';
import { NgRedux } from '@angular-redux/store';

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
          <ion-nav [root]="masterPage" #masterNav ></ion-nav>
          <ion-nav [root]="detailPage" #detailNav main></ion-nav>
      </ion-split-pane>
  `
})
export class MasterDetailComponent extends JsonFormsControl {

    @ViewChild('masterNav') masterNav: Nav;
    @ViewChild('detailNav') detailNav: Nav;
    masterItems: MasterItem[];

    constructor(
        private parentNav: Nav,
        private platform: Platform,
        ngRedux: NgRedux<JsonFormsState>,
        private masterDetailService: MasterDetailNavService
    ) {
        super(ngRedux);
    }

    ngOnInit() {

        this.masterDetailService.masterNav = this.masterNav;
        this.masterDetailService.detailNav = this.detailNav;
        this.masterDetailService.parentNav = this.parentNav;

        this.subscription = this.ngRedux
            .select()
            .map((s: JsonFormsState) => this.mapToProps(s))
            .subscribe(({ data, schema, uischema, }) => {
                const controlElement = uischema as ControlElement;
                const instancePath = toDataPath(`${controlElement.scope}/items`);
                const resolvedSchema = resolveSchema(schema, `${controlElement.scope}/items`);
                const detailUISchema = controlElement.options.detail ||
                    Generate.uiSchema(resolvedSchema, 'VerticalLayout');
                const masterItems = data.map((d, index) => {
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
                    this.masterDetailService.masterNav.setRoot(
                        MasterPage,
                        {
                            addToNavStack: true,
                            items: this.masterItems,
                            path: composeWithUi(this.uischema as ControlElement, this.path),
                            uischema: this.uischema,
                            schema: this.schema
                        }
                    );
                }

                if (this.platform.width() < 768) {
                    this.masterDetailService.useParentNav = true;
                } else {
                    this.masterDetailService.useParentNav = false;
                }
            });
    }

    onSplitPaneChange(event) {
        const isDetailVisible = event._visible;
        this.masterDetailService.onDetailVisibilityChanged(isDetailVisible, this.parentNav);
    }
}

export const masterDetailTester: RankedTester = rankWith(
    4,
    uiTypeIs('FlatMasterDetail')
);
